import { useState } from "react";
import threadFacade from "../facades/threadFacade";
import printError from "../utils/error";
import { Button, Form} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import { useParams, useHistory } from "react-router-dom"
import "../styles/posts.css";
import "react-bootstrap/dist/react-bootstrap.min"





export default function AddThread(){
    const {catId} = useParams()
    const [newThread, setNewThread] = useState({title:"",posts: [{content: ""}], category: {id: catId} })
    const [error, setError] = useState("");
    const history = useHistory()
    const handleChange = (e) => {
       
        if(e.target.name === "content"){
            setNewThread({...newThread, posts:[{content: e.target.value}]})
        }else{
        setNewThread({ ...newThread, [e.target.name]: e.target.value });
        }
      }

    const addThread = (e) => {
        e.preventDefault()

        threadFacade.addThread(newThread).then(res => history.push(`/home/${catId}`))
        .catch((promise) => {
            if (promise.fullError) {
              printError(promise, setError);
            } else {
              setError("No response from API. Make sure it is running.");
            }
          });
    }  
    
    return (
   <div> 
         <p style={{color: "red"}}>{error}</p>
   <div className="commentForm" onSubmit={addThread}>
      <Form reply >
      <br />
          <label>Title</label>
          <br />
          <input required name="title" type="text"onChange={handleChange}/>
          <p style={{textAlign: "center", marginTop: "20px"}}>Content</p>
         <Form.TextArea required onChange={handleChange}  />
         <Button style={{backgroundColor : "green"}} content='Post' labelPosition='right' icon='send' primary />
       </Form>  
       </div>  
     </div>    
    )   
}