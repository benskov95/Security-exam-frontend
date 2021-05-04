import React, { useState } from "react";
import printError from "../utils/error";
import userFacade from "../facades/userFacade";


export default function EditUser({user, setUser}) {
    let editDefault = { imageUrl: user.imageUrl, username: user.username, oldPassword: "", password: "", confirmNewPw: "" };
    const [editUser, setEditUser] = useState({...editDefault});
    const [error, setError] = useState("");
    const [msg,setMsg] = useState("")
    const [picFile, setPicFile] = useState(undefined);
    const [pwMatch, setPwMatch] = useState(false)
    
    const handleChange = (e) => {
        if (e.target.id === "confirmNewPw") {
            verifyPwMatch(e.target.value)
        }
        setEditUser({ ...editUser, [e.target.id]: e.target.value });
        setMsg("")
    };
  
    const handleSubmit = async(e) => {
      e.preventDefault();
      let userCopy = {...editUser}

      if (editUser.username === "") {
        setError("Username cannot be empty.")
      } else {
        if(picFile !== undefined){
        const response = await userFacade.uploadImage(picFile)
        editUser["imageUrl"] = response.data.data.display_url
        }
        userFacade.editUser(editUser)
        .then(res => {
          updateUsers(res)
        })
        .catch((promise) => {
          if (promise.fullError) {
            printError(promise, setError);
            setEditUser(userCopy)
          } else {
            setError("No response from API. Make sure it is running.");
          }
        });
      }
    }

    const verifyPwMatch = (val) => {
        if (val === editUser.password) {
            setPwMatch(false)
            setError("")
        } else {
            setPwMatch(true)
            setError("Passwords do not match");
        }
    }

    const grabFile = (e) => {
      let file = e.target.files[0]
      if (file !== undefined && !file.type.includes("image")) {
        setError("Only images can be uploaded.")
        e.target.value = ""
        setPicFile(undefined)
      } else {
      setError("")
      setPicFile(e.target.files[0])
      }
    }

    const updateUsers = (res) => {
      let updatedUser = {...editDefault}
      updatedUser["username"] = res.username
      updatedUser["imageUrl"] = res.imageUrl
      setEditUser(updatedUser)

      let stateUser = {...user}
      stateUser["username"] = res.username;
      stateUser["imageUrl"] = res.imageUrl;
      setUser(stateUser)

      setMsg("Changes saved.")
      setError("")
      setPicFile(undefined)
    }

    return (
        <div style={{marginTop: "20px"}}>
        <h1>Edit your account</h1>
        <br />
        <form onSubmit={handleSubmit}>
        <label>Picture</label><br />
        <img src={editUser.imageUrl}
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
            accept="image/*"
            id="userPic"
            onChange={grabFile}
            style={{marginLeft: "200px"}}
          />
          <br />
          <br />
        <label>Username</label><br />
          <input
            id="username"
            value={editUser.username}
            minLength={4}
            maxLength={16}
            onChange={handleChange}
          />
          <br />
          <label>Current password</label><br />
          <input
            id="oldPassword"
            type="password"
            minLength={8}
            maxLength={16}
            onChange={handleChange}
          />
          <br />
          <label>New password</label><br />
          <input
            id="password"
            type="password"
            minLength={8}
            maxLength={16}
            onChange={handleChange}
          />
          <br />
          <label>Confirm new password</label><br />
          <input
            id="confirmNewPw"
            type="password"
            minLength={8}
            maxLength={16}
            onChange={handleChange}
          />
          <br />
          <br />
          <p style={{color:"green"}}>{msg}</p>
          <p style={{ color: "red" }}>{error}</p>
          <input disabled={pwMatch} type="submit" value="Update account" className="btn btn-secondary"/>
          <br />
        </form>
      </div>
    )
}