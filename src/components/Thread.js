import { useEffect, useState } from "react";
import postFacade from "../facades/postFacade";
import printError from "../utils/error";
import { Button, Form, Container } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import { useParams } from "react-router-dom"
import "../styles/posts.css";
import "react-bootstrap/dist/react-bootstrap.min"

export default function Thread({isLoggedIn, user}) {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState("");
    const [newPost, setNewPost] = useState({ "threadId": 0, "content": ""})
    let {threadId} = useParams();

    useEffect(() => {
        postFacade.getPostsByThreadId(threadId)
        .then(res => setPosts([...res]))
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

    return (
      <Container className="content" style={{marginTop: "80px"}}>
         <p style={{ color: "red" }}>{error}</p> 
          
          {posts.map(post => 
           <div className="commentContent" key={post.id}> 
              <div className="commentHeader">
                {post.user === user ? (
                  <h3 style={{fontSize: "22px"}}>{post.user} (me)</h3>
                ) : 
                  <h3 style={{fontSize: "22px"}}>{post.user}</h3>
                }
              </div>
              <div className="commentTime">{post.postedOn}</div> 
              <div className="profilpicture">
              <img className="profileImg" src="https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg" alt=""/>
              </div>
          <div className="commentText"><span>{post.content}</span>
          </div>                    
         </div>
       )} 
      
      <div className="commentForm">
           {isLoggedIn ? (
         <Form reply onSubmit={handleSubmit}>
            <Form.TextArea onChange={handleChange} name={"content"} value={newPost.content} />
            <Button style={{backgroundColor : "#5a6268"}} content='Add Post' labelPosition='left' icon='edit' primary />
          </Form>  

           ): <p style={{color : "red"}}>You must be logged in to comment</p>}
           
          </div>    

      </Container>
    )
}