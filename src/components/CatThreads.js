import { useEffect, useState } from "react";
import threadFacade from "../facades/threadFacade";
import "bootstrap/dist/css/bootstrap.css";
import printError from "../utils/error";
import {
    Link,
    useParams,
    useRouteMatch
  } from "react-router-dom";


export default function Thread() {
    const [threads, setThreads] = useState([]);
    const [error, setError] = useState("");
    let {catId} = useParams();
    let {url} = useRouteMatch();

    useEffect(() => {
        threadFacade.getAllThreadsByCatId(catId)
        .then(res => setThreads([...res]))
        .catch((promise) => {
            if (promise.fullError) {
              printError(promise, setError);
            } else {
              setError("No response from API. Make sure it is running.");
            }
          });
    }, [])
 
     return (
        <div>
            <div className="container">
            <p style={{ color: "red" }}>{error}</p>
            <table className="table" style={{borderCollapse: "separate", borderSpacing: "1px 5px"}}>
            <th>Title</th>
            <th>Posted by</th>
            <th># of posts</th>
            <tbody>
            {threads.map((thread) => {
                return (
                <tr key={thread.id} style={{border: "solid black 1px"}}>
                <td style={{fontSize: "20px"}}><Link to={`${url}/${thread.id}`}>{thread.title}</Link></td>
                <td>{thread.user}</td>
                <td>{thread.nPosts}</td>
                </tr>
                )
            })}
            </tbody>
            </table>
            </div>
        </div>
    )
}