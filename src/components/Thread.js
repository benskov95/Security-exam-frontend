import { useEffect, useState } from "react";
import threadFacade from "../facades/threadFacade";
import "bootstrap/dist/css/bootstrap.css";
import {
    Switch,
    Route,
    Link
  } from "react-router-dom";


export default function Thread() {
    const [threads, setThreads] = useState([]);
    const [error, setError] = useState("");

    return (
        <div>
        <div className="container">
        <p style={{ color: "red" }}>{error}</p>
        <table className="table" style={{borderCollapse: "separate", borderSpacing: "1px 5px"}}>
        <thead>
            <th></th>
            <th></th>
            <th></th>
        </thead>
        <tbody>
        {threads.map((thread) => {
            return (
            <tr key={thread.title} style={{border: "solid black 1px"}}>
            <td><Link to="/#">{thread.title}</Link></td>
            <td>{thread.user}</td>
            <td>{thread.posts.length}</td>
            </tr>
            )
        })}
        </tbody>
        </table>
      </div>
        </div>
    )
}