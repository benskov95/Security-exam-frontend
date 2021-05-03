import { useEffect, useState } from "react";
import postFacade from "../facades/postFacade";
import threadFacade from "../facades/threadFacade";
import printError from "../utils/error";
import { Button, Form, Container } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import { useParams } from "react-router-dom"
import "../styles/posts.css";
import "react-bootstrap/dist/react-bootstrap.min"

export default function Thread({isLoggedIn, token}) {
    let user = token.username;
    let role = token.role;
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState("");
    const [newPost, setNewPost] = useState({ "threadId": 0, "content": ""})
    let {threadId} = useParams();
    const [thread, setThread] = useState();

    useEffect(() => {
      getAllPosts();
      threadFacade.getThreadById(threadId)
      .then(res => setThread(res))
      .catch((promise) => {
        if (promise.fullError) {
          printError(promise, setError);
        } else {
          setError("No response from API. Make sure it is running.");
        }
      });   
    }, [])

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
      })
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
      let id = e.target.value
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

    const deletePost = (e) => {
      let id = e.target.value
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

    return (
      <Container className="content" style={{marginTop: "40px"}}>
        <h1 style={{marginBottom: "40px", fontSize: "34px"}}>{thread !== undefined && thread.title}</h1>
         <p style={{ color: "red" }}>{error}</p> 
          {posts.map(post => 
           <div 
           className="commentContent" 
           key={post.id} 
           style={post.content.includes(`@${user}`) ? 
           {backgroundColor: "rgba(255, 0, 0, 0.3)"} : 
           {backgroundColor: "white"}}> 

              {(post.user.includes(user) && post.role.includes("user")) && (
                <Button 
                style={{float: "right", marginTop: "5px", backgroundColor : "red"}}
                icon="delete"
                value={post.id}
                primary
                onClick={deleteMyPost}>
                </Button>
              )}
              {(role.includes("admin") || role.includes("moderator")) && (
                <Button 
                style={{float: "right", marginTop: "5px", backgroundColor : "#5a6268"}}
                icon="delete"
                value={post.id}
                primary
                onClick={deletePost}>
                </Button>
              )}
              <div className="commentHeader">
                {post.user.includes(user) ? (
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