import React, { useState } from "react";
import printError from "../utils/error";
import userFacade from "../facades/userFacade";

export default function EditUser({token, setUser}) {
    let editDefault = { imageUrl: token.imageUrl, username: token.username, oldPassword: "", password: "", confirmNewPw: "" };
    const [eUser, setEditUser] = useState(editDefault);
    const [error, setError] = useState("");
    const [picFile, setPicFile] = useState(undefined);

    const handleChange = (e) => {
        if (e.target.id === "confirmNewPw") {
            verifyPwMatch(e.target.value)
        }
        setEditUser({ ...eUser, [e.target.id]: e.target.value });
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      uploadImage()
      userFacade.editUser(eUser)
      .then(res => {
          let updatedUser = {...editDefault}
          updatedUser["username"] = res.username
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

    const grabFile = (e) => {
      let file = e.target.files[0]
      if (!file.type.includes("image")) {
        setError("Only images can be uploaded.")
        e.target.value = ""
        setPicFile(undefined)
      } else {
      setError("")
      setPicFile(e.target.files[0])
      }
    }

    const uploadImage = () => {
      if (picFile !== undefined) {
        userFacade.uploadImage(picFile)
        .then(res => {
          let userNewPic = {...eUser}
          userNewPic["imageUrl"] = res.data.data.display_url
          setEditUser({...userNewPic})
        })
        .catch((promise) => {
          if (promise.fullError) {
            printError(promise, setError);
          } else {
            setError("IMGBB not responding.");
          }
        })} 
    }

    return (
        <div style={{marginTop: "20px"}}>
        <h1>Edit your account</h1>
        <br />
        <form onSubmit={handleSubmit}>
        <label>Picture</label><br />
        <img src={eUser.imageUrl}
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