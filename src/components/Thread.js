import { useEffect, useState } from "react";
import postFacade from "../facades/postFacade";
import "bootstrap/dist/css/bootstrap.css";
import printError from "../utils/error";
import { useParams } from "react-router";

export default function Thread() {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState("");
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

    return (
        <div className="container">
        <p style={{ color: "red" }}>{error}</p>
        <table className="table" style={{borderCollapse: "separate", borderSpacing: "1px 5px"}}>
        <th></th>
        <tbody>
        {posts.map((post) => {
            return (
            <tr key={post.id} style={{border: "solid black 1px"}}>
            <td>{post.content}</td>
            </tr>
            )
        })}
        </tbody>
        </table>
        </div>
    )
}