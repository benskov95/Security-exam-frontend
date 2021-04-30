import React, { useState } from "react";
import printError from "../utils/error";
import userFacade from "../facades/userFacade";

export default function EditUser({token, setUser}) {
    const [eUser, setEditUser] = useState({ userPic: "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg", username: token.username, oldPassword: "", password: "", confirmNewPw: "" });
    const [error, setError] = useState("");
  
    const handleChange = (e) => {
        if (e.target.id === "confirmNewPw") {
            verifyPwMatch(e.target.value)
        }
        setEditUser({ ...eUser, [e.target.id]: e.target.value });
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      userFacade.editUser(eUser)
      .then(res => {
          let updatedUser = {...eUser}
          updatedUser["username"] = res.username
          updatedUser["oldPassword"] = ""
          updatedUser["password"] = ""
          updatedUser["confirmNewPw"] = ""
          setEditUser({...updatedUser})
          setUser(res.username)
      })
      .catch((promise) => {
        if (promise.fullError) {
          printError(promise, setError);
        } else {
          setError("No response from API. Make sure it is running.");
        }
      });
    };

    const verifyPwMatch = (val) => {
        if (val === eUser.password) {
            setError("")
        } else {
            setError("Passwords do not match");
        }
    }

    return (
        <div style={{marginTop: "20px"}}>
        <h1>Edit your account</h1>
        <br />
        <form onSubmit={handleSubmit}>
        <label>Picture</label><br />
        <img src={eUser.userPic}
              alt=""
              style={{
                height: "120px",
                width: "120px",
              }}>
        </img>
        <br />
        <br />
          <input
            type="file"
            id="userPic"
            onChange={handleChange}
          />
          <br />
          <br />
        <label>Username</label><br />
          <input
            id="username"
            value={eUser.username}
            onChange={handleChange}
          />
          <br />
          <label>Current password</label><br />
          <input
            id="oldPassword"
            type="password"
            onChange={handleChange}
          />
          <br />
          <label>New password</label><br />
          <input
            id="password"
            type="password"
            onChange={handleChange}
          />
          <br />
          <label>Confirm new password</label><br />
          <input
            id="confirmNewPw"
            type="password"
            onChange={handleChange}
          />
          <br />
          <br />
          <p style={{ color: "red" }}>{error}</p>
          <input type="submit" value="Update account" className="btn btn-secondary"/>
          <br />
        </form>
      </div>
    )
}