import React, { useState } from "react";
import apiFacade from "../base-facades/apiFacade";
import {URL} from "./Home";

export default function Register() {
    const initialState = { username: "", password: "" };
    const [user, setUser] = useState(initialState);
    const [error, setError] = useState("");
    const [msg, setMsg] = useState("");

    const handleChange = e => {
        setUser({ ...user, [e.target.name]: e.target.value });
        setError("");
    };

    const registerUser = e => {
        e.preventDefault();
        if (URL === "") {
            setError("Remember to select an API on the Home page.");
        } else {
        if (user.username !== "" || user.password !== "") {
            apiFacade.register(user)
            .then(res => setMsg(`${res.username} has been registered.`))
            .catch(promise => {
                promise.fullError.then((error) => {
                    setError(error.message)
                })
            })
            setUser(initialState);
        } else {
            setError("All fields must be filled out.")
        }
    }};

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={registerUser}>
                <br />
                <label>Username</label><br />
                <input onChange={handleChange} value={user.username} name="username"></input>
                <br />
                <label>Password</label><br />
                <input 
                onChange={handleChange} 
                type="password"
                value={user.password} 
                name="password">
                </input>
                <br /><br />
                <input type="submit" value="Register" className="btn btn-secondary"></input>
                <br /><br />
                <p style={{ color: "red" }}>{error}</p>
                <p style={{color: "green"}}>{msg}</p>
            </form>
        </div>
    )
}
