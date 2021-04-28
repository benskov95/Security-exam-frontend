import adminFacade from "../base-facades/adminFacade";
import { useEffect, useState } from "react";
import "../styles/App.css";
import "bootstrap/dist/css/bootstrap.css";
import printError from "../utils/error"

export default function Admin({token}) {
  const [allUsers, setAllUsers] = useState([]);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("")

  useEffect(() => {
    adminFacade.getUsers().then((users) => setAllUsers([...users]))
    .catch((promise) => {
      if (promise.fullError) {
        printError(promise, setErr)
      } else {
        setErr("No response from API. Make sure it is running.");
      }
    });
  }, [msg]);


  allUsers.forEach(user => {
    if (user.email === token.email) {
      let excludedUser = [...allUsers];
      let index = excludedUser.indexOf(user);
      excludedUser.splice(index, 1);
      setAllUsers([...excludedUser]);
    }
  });
  const promoteUser = (e) => {
    adminFacade.promoteUser(e.target.value).then((res) => setMsg(`${res.username} has been promoted`))
    .catch((promise) => {
      if (promise.fullError) {
        printError(promise, setErr)
        setMsg("")
      } else {
        setErr("No response from API. Make sure it is running.");
      }
    });
  }
  const demoteUser = (e) => {
    adminFacade.demoteUser(e.target.value).then((res) => setMsg(`${res.username} has been demoted`))
    .catch((promise) => {
      if (promise.fullError) {
        printError(promise, setErr)
        setMsg("")
      } else {
        setErr("No response from API. Make sure it is running.");
      }
    });
  }

  const deleteUser = (e) => {
    adminFacade.deleteUser(e.target.value).then((res) => setMsg( `${res.username} has been deleted`))
    .catch((promise) => {
      if (promise.fullError) {
        printError(promise, setErr)
        setMsg("")
      } else {
        setErr("No response from API. Make sure it is running.");
      }
    });
  };

  return (
    <div>
      <h1>Hello Admin</h1>
      <br />
      <p>{msg !== "" ? msg : ""} </p>
      <p style={{color:"red"}}>{err !== "" ? err : ""} </p>
      <br />
      <h3>List of registered users</h3>
      <p> (currently logged-in user is excluded)</p>
      <div className="container">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allUsers.map((user) => {
              return (
                <tr key={user.email}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    {user.role.includes("user") ? 
                    (<button className="btn btn-success" value={user.email} onClick={promoteUser}>Promote</button>) :
                     <button className="btn btn-primary" value={user.email} onClick={demoteUser}>Demote</button> } 
                    <button className="btn btn-danger"   value={user.email} onClick={deleteUser} >Delete</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
