import { useEffect, useState } from "react";
import postFacade from "../facades/postFacade";
import threadFacade from "../facades/threadFacade";
import printError from "../utils/error";
import { Button, Form, Container } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import "../styles/posts.css";
import "react-bootstrap/dist/react-bootstrap.min"
import { useParams } from "react-router";
import { Modal } from "react-bootstrap";

export default function Thread({isLoggedIn, user, threads}) {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState("");
    const [msg, setMsg] = useState("")
    const [newPost, setNewPost] = useState({ "threadId": 0, "content": ""})
    const [editPost, setEditPost] = useState({id : "", content: ""})
    const [showEditModal, setShowEditModal] = useState(false)
    const handleHideEdit = () => setShowEditModal(false)
    const [editModelErr, setEditModalErr] = useState("")
    let {threadId} = useParams();
    const [currentThread, setCurrentThread] = useState();

    useEffect(() => {
      getAllPosts();
      getCurrentThread();
    }, [msg])

    const getCurrentThread = () => {
      if (threads.length > 0) {
        threads.forEach(thread => {
          if (thread.id === parseInt(threadId)) {
            setCurrentThread(thread)
          }
        })
      } else {
        threadFacade.getThreadById(threadId)
        .then(res => setCurrentThread(res))
        .catch((promise) => {
          if (promise.fullError) {
            printError(promise, setError);
          } else {
            setError("No response from API. Make sure it is running.");
          }
        });
      }
    }

    const handleChange = (e) => {
      setNewPost({ ...newPost, [e.target.name]: e.target.value });
    }
  
    const handleSubmit = (e) => {
      e.preventDefault()
      newPost.threadId = threadId

      if (newPost.content.length < 1) {
        setError("Post must be minimum 1 character long.")
      } else {
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

    const handleShowEdit = (e) => {
      setMsg("")
      let input = parseInt(e.currentTarget.value)
      let toEdit = posts.find(post => post.id === input)
      setEditPost({...toEdit}) 
      setShowEditModal(!showEditModal)
    }

    const handleEditPost = (e) => {
      setEditPost({ ...editPost, [e.target.name]: e.target.value })
      setError("")
    }

    const handleEditSubmit = (e) => {
      e.preventDefault()
      postFacade.editMyPost(editPost)
      .then(res => {
        setMsg("Changes saved")
        setShowEditModal(false)
      })
      .catch((promise) => {
        if (promise.fullError) {
          printError(promise, setEditModalErr)
        } else {
          setEditModalErr("No response from API. Make sure it is running.");
        }
      });
    }

    return (
      <Container className="content" style={{marginTop: "40px"}}>
        <h1 style={{marginBottom: "40px", fontSize: "34px"}}>{currentThread !== undefined && currentThread.title}</h1>
        <p style={{ color: "red"}}>{error}</p> 
        <p style={{color: "green"}}>{msg}</p>
          {posts.map(post => 
           <div 
           className="commentContent" 
           key={post.id} 
           style={post.content.includes(`@${user.username}`) ? 
           {backgroundColor: "rgba(255, 0, 0, 0.3)"} : 
           {backgroundColor: "white"}}> 

              {isLoggedIn && (
                <div>
                {post.user.includes(user.username) && (
                  <div>
                  <Button 
                  style={{float: "right", marginTop: "5px", backgroundColor : "red"}}
                  icon="delete"
                  value={post.id}
                  primary
                  onClick={deleteMyPost}>
                  </Button>
                  <Button 
                  style={{float: "right", marginTop: "5px", backgroundColor : "green"}}
                  icon="edit"
                  value={post.id}
                  primary
                  onClick={handleShowEdit}>
                  </Button>
                  </div>
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
            <Form.TextArea 
            onChange={handleChange}
            name={"content"} 
            value={newPost.content} 
            />
            <Button style={{backgroundColor : "green"}} content='Post' labelPosition='right' icon='send' primary />
          </Form>  

        ): <p style={{color : "red"}}>You must be logged in to comment</p>}
      </div> 

      <Modal show={showEditModal} onHide={handleHideEdit}>
              <Modal.Header closeButton>
                <Modal.Title style={{ marginLeft: "39%" }}>Edit post</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <form onSubmit={handleEditSubmit} style={{ textAlign: "center" }}>
                  <label>Post content</label>
                  <br />
                  <Form.TextArea 
                  style={{width: "300px", height: "300px"}}
                  onChange={handleEditPost}
                  name={"content"} 
                  value={editPost.content} 
                  />
                  <br />
                  <br />
                  <input 
                    value= "Save changes"
                    type="submit"
                    className="btn btn-secondary"
                  ></input>
                  <br/>
                  <br/>
                  <p style={{ color: "red" }}>{editModelErr}</p>
                </form>
              </Modal.Body>
            </Modal>   

      </Container>
    )
}