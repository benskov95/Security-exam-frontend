import React, { useState } from "react";
import apiFacade from "../base-facades/apiFacade";
import printError from "../utils/error";

export const Auth = ({ isLoggedIn, setLoginStatus, setToken}) => {
    const [auth, setAuth] = useState({authcode: "", user_id: ""});
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setError("");
        setAuth({ ...auth, [e.target.id]: e.target.value });
    };

    let cookies = document.cookie.split(';').toString();
    const cookieValue = cookies.split("=");

    const handleSubmit = (e) => {
        e.preventDefault();
        auth["user_id"] = cookieValue[1]
        apiFacade
            .authadmin(auth)
            .then((res) => {
                setLoginStatus(!isLoggedIn)
                setToken(JSON.parse(atob(res.token.split(".")[1])))
                apiFacade.setTokenInUse(res.token);
            })
            .catch((promise) => {
                if (promise.fullError) {
                    printError(promise, setError);
                } else {
                    setError("No response from API. Make sure it is running.");
                }
            });
    };

    return (
        <div>
            <h2>2-factor authentication</h2>
            <br />
            <form onSubmit={handleSubmit}>
                <label>Authentication code</label><br />
                <input id="authcode" onChange={handleChange} />
                <br />
                <br />
                <input type="submit" value="Authenticate" className="btn btn-secondary"/>
                <br />
                <p style={{ color: "red" }}>{error}</p>
            </form>
        </div>
    );

};