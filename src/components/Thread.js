import { useEffect, useState } from "react";
import postFacade from "../facades/postFacade";
import printError from "../utils/error";
import { Button, Form, Container } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import "../styles/posts.css";
import "react-bootstrap/dist/react-bootstrap.min"
import { useParams } from "react-router";

export default function Thread({isLoggedIn, user, threads}) {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState("");
    const [newPost, setNewPost] = useState({ "threadId": 0, "content": ""})
    let {threadId} = useParams();
    const [currentThread, setCurrentThread] = useState();

    useEffect(() => {
      getAllPosts();
      getCurrentThread();
    }, [])

    const getCurrentThread = () => {
      threads.forEach(thread => {
        if (thread.id === parseInt(threadId)) {
          setCurrentThread(thread)
        }
      })
    }

    const handleChange = (e) => {
      setNewPost({ ...newPost, [e.target.name]: e.target.value });
    }
  
    const handleSubmit = (e) => {
      e.preventDefault()
      newPost.threadId = threadId
      postFacade.addPost(newPost).then(res => {
        let refresh = [...posts]
        refresh.push(res)
        setPosts(refresh)
        setNewPost({ "threadId": 0, "content": "" })
        setError("")
      })
      .catch((promise) => {
        if (promise.fullError) {
          printError(promise, setError);
        } else {
          setError("No response from API. Make sure it is running.");
        }
      });  
    }

    const getAllPosts = () => {
      postFacade.getPostsByThreadId(threadId)
      .then(res => setPosts([...res]))
      .catch((promise) => {
          if (promise.fullError) {
            printError(promise, setError);
          } else {
            setError("No response from API. Make sure it is running.");
          }
        });  
    }

    const deleteMyPost = (e) => {
      if (posts.length === 1 && posts[0].user.includes(user.username)) {
        setError("Only one post in thread. Go back to the previous page and delete the thread instead.")
      } else {
        let id = e.currentTarget.value
        postFacade.deleteMyPost(id)
        .then(res => getAllPosts())
        .catch((promise) => {
          if (promise.fullError) {
            printError(promise, setError);
          } else {
            setError("No response from API. Make sure it is running.");
          }
        });    
      }
    }

    const deletePost = (e) => {
      if (posts.length === 1) {
        setError("Only one post in this thread. Go back to the previous page and delete the thread instead.")
      } else {
        let id = e.currentTarget.value
        postFacade.deletePost(id)
        .then(res => getAllPosts())
        .catch((promise) => {
          if (promise.fullError) {
            printError(promise, setError);
          } else {
            setError("No response from API. Make sure it is running.");
          }
        });    
      }
    }

    return (
      <Container className="content" style={{marginTop: "40px"}}>
        <h1 style={{marginBottom: "40px", fontSize: "34px"}}>{currentThread !== undefined && currentThread.title}</h1>
         <p style={{ color: "red" }}>{error}</p> 
          {posts.map(post => 
           <div 
           className="commentContent" 
           key={post.id} 
           style={post.content.includes(`@${user.username}`) ? 
           {backgroundColor: "rgba(255, 0, 0, 0.3)"} : 
           {backgroundColor: "white"}}> 

              {isLoggedIn && (
                <div>
                {(post.user.includes(user.username) && post.role.includes("user")) && (
                  <Button 
                  style={{float: "right", marginTop: "5px", backgroundColor : "red"}}
                  icon="delete"
                  value={post.id}
                  primary
                  onClick={deleteMyPost}>
                  </Button>
                )}
                {(user.role.includes("admin") || (user.role.includes("moderator"))) && (
                  <Button 
                  style={{float: "right", marginTop: "5px", backgroundColor : "#5a6268"}}
                  icon="delete"
                  value={post.id}
                  primary
                  onClick={deletePost}>
                  </Button>
                )}
                </div>
              )}

              <div className="commentHeader">
                {(post.user.includes(user.username) && (user !== "")) ? (
                  <h3 style={{fontSize: "22px"}}>{post.user} (me)</h3>
                ) : 
                  <h3 style={{fontSize: "22px"}}>{post.user}</h3>
                }
              </div>
              <div className="commentTime">{post.postedOn}</div> 
              <div className="profilpicture">
              <img className="profileImg" src={post.userImage} alt=""/>
              <p style={{textAlign: "center", fontSize: "12px", color: "red", fontWeight: "bold"}}>
                {(post.role.includes("admin") || post.role.includes("moderator")) && (
                  post.role
                )}
              </p>
              </div>
          <div className="commentText">
            <span>
              {post.content}
            </span>
          </div>                    
         </div>
       )} 
      
      <div className="commentForm">
        {isLoggedIn ? (
          <Form reply onSubmit={handleSubmit}>
            <Form.TextArea onChange={handleChange} name={"content"} value={newPost.content} />
            <Button style={{backgroundColor : "green"}} content='Post' labelPosition='right' icon='send' primary />
          </Form>  

        ): <p style={{color : "red"}}>You must be logged in to comment</p>}
      </div>    

      </Container>
    )
}