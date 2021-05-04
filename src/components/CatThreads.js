import { useEffect, useState } from "react";
import threadFacade from "../facades/threadFacade";
import "bootstrap/dist/css/bootstrap.css";
import printError from "../utils/error";
import {
    Link,
    useParams,
    useRouteMatch
  } from "react-router-dom";


export default function CatThreads({isLoggedIn, user, categories, threads, setThreads}) {
    const [currentCat, setCurrentCat] = useState("");
    const [error, setError] = useState("");
    const [msg, setMsg] = useState("")
    let {catId} = useParams();
    let {url} = useRouteMatch();

    useEffect(() => {
      getCurrentCategory();
      threadFacade.getAllThreadsByCatId(catId)
      .then(res => setThreads([...res]))
      .catch((promise) => {
          if (promise.fullError) {
            printError(promise, setError);
          } else {
            setError("No response from API. Make sure it is running.");
          }
        });
    }, [msg])

    const getCurrentCategory = () => {
      categories.forEach(cat => {
        if (cat.id === parseInt(catId)) {
          setCurrentCat(cat.name)
        }
      })
    }

    const deleteThread = (e) => {
      e.preventDefault()
      threadFacade.deleteThread(e.currentTarget.value)
      .then(res => {
        setError("")
        setMsg(`${res.title} has been deleted`)
      })
      .catch((promise) => {
        if (promise.fullError) {
          printError(promise, setError);
        } else {
          setError("No response from API. Make sure it is running.");
        }
      });
    }

    const deleteMyThread = (e) => {
      e.preventDefault()
      threadFacade.deleteMyThread(e.currentTarget.value)
      .then(res => {
        setError("")
        setMsg(`${res.title} has been deleted`)
      })
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
            <div className="container">
              <h1 style={{marginTop: "20px"}}>{currentCat}</h1>
              <h4>The place to be if you want to talk about {currentCat}</h4>
              <p style={{ color: "red" }}>{error}</p>
              <p style={{ color: "green" }}>{msg}</p>
              {isLoggedIn ? 
              (<Link to={`${url}/add-thread`}><button className="btn btn-primary">Add Thread</button></Link>) : 
              <p style={{color : "red"}}>You must be logged in to start a thread</p>}
              <table className="table" style={{borderCollapse: "separate", borderSpacing: "1px 5px"}}>
                <thead>
                  <tr>
                  <th>Title</th>
                  <th>Posted by</th>
                  <th># of posts</th>
                  <th>Last active</th>
                  <th></th>
                  </tr>
                </thead>
                <tbody>
                {threads.map((thread) => {
                    return (
                    <tr key={thread.id} style={{border: "solid black 1px"}}>
                    <td style={{fontSize: "20px"}}><Link to={`${url}/${thread.id}`}>{thread.title}</Link></td>
                    <td>{thread.user}</td>
                    <td>{thread.posts.length}</td>
                    <td>{thread.posts.length > 0 ? thread.posts.pop().postedOn : ""}</td>
                    {isLoggedIn && (
                      <td>
                        {(user.role.includes("admin") || user.role.includes("moderator")) ? (
                        <button 
                        onClick={deleteThread} 
                        value={thread.id} 
                        className="btn btn-danger">Delete
                        </button>
                        ) : (user.role.includes("user") && thread.user.includes(user.username)) ? (
                          <button 
                          onClick={deleteMyThread} 
                          value={thread.id} 
                          className="btn btn-danger">Delete
                          </button>
                        ): ""} 
                      </td>
                    )}
                    </tr>
                    )
                })}
                </tbody>
              </table>
            </div>
        </div>
    )
}