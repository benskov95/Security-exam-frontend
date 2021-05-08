import React, { useState } from "react";
import apiFacade from "../base-facades/apiFacade";

export default function Register() {
    const initialState = { email: "", username: "", password: "", phone: "" };
    const [user, setUser] = useState(initialState);
    const [error, setError] = useState("");
    const [msg, setMsg] = useState("");

    const handleChange = e => {
        setUser({ ...user, [e.target.name]: e.target.value });
        setError("");
    };

    const registerUser = e => {
        e.preventDefault();
        if (user.username !== "" || user.password !== "" || user.phone !== "") {
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
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={registerUser}>
                <br />
                <label>Email</label><br />
                <input onChange={handleChange} value={user.email} name="email"></input>
                <br />
                <label>Username</label><br />
                <input onChange={handleChange} value={user.username} name="username"></input>
                <br />
                <label>Password</label><br />
                <input onChange={handleChange} type="password" value={user.password} name="password"></input>
                <br />
                <label>Phone number</label><br />
                <input onChange={handleChange} value={user.phone} name="phone"></input>
                <br /><br />
                <input type="submit" value="Register" className="btn btn-secondary"></input>
                <br /><br />
                <p style={{ color: "red" }}>{error}</p>
                <p style={{color: "green"}}>{msg}</p>
            </form>
        </div>
    )
}
