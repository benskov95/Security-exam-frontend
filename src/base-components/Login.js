import React, { useState } from "react";
import apiFacade from "../base-facades/apiFacade";
import printError from "../utils/error";
import Recaptcha from 'react-recaptcha';
import { useHistory } from 'react-router-dom';

export const Login = ({ isLoggedIn, loginMsg, setLoginStatus, setToken }) => {
    const history = useHistory();
    const [user, setUser] = useState({ email: "", password: ""});
    const [error, setError] = useState("");
    const [verified, setVerified] = useState(false);

  const handleChange = (e) => {
    setError("");
    setUser({ ...user, [e.target.id]: e.target.value });
  };

  const recaptchaLoaded = () => {
    console.log('Captcha loaded');
  };

  const verifyCallback = (response) => {
    if (response) {
      setVerified(true);
    }
  };

   const createCookie = (cookieName, cookieValue, hourToExpire) => {
        let date = new Date();
        date.setTime(date.getTime()+(hourToExpire*60*60*1000));
        document.cookie = cookieName + " = " + cookieValue + "; expires = " +date.toGMTString();
   }


  const handleSubmit = (e) => {
    e.preventDefault();
      if (verified) {
        apiFacade
            .login(user)
            .then((res) => {
              if(res.hasOwnProperty("user_id")){
                  console.log(res['user_id']);
                  createCookie("auth", res['user_id'], 1)
                  history.push("/auth");
              }else{

              setLoginStatus(!isLoggedIn)
              setToken(JSON.parse(atob(res.token.split(".")[1])))
              apiFacade.setTokenInUse(res.token);
              }
            })
            .catch((promise) => {
              if (promise.fullError) {
                printError(promise, setError);
              } else {
                setError("No response from API. Make sure it is running.");
              }
            });
      } else {
        setError("Please verify that you are a human!");
      }
  };

  const logout = () => {
    setLoginStatus(false);
    setToken("");
    apiFacade.logout();
  };

  if (!isLoggedIn) {
    return (
      <div>
        <h2>{loginMsg}</h2>
        <br />
        <form onSubmit={handleSubmit}>
        <label>Email</label><br />
          <input
            id="email"
            onChange={handleChange}
          />
          <br />
          <label>Password</label><br />
          <input
            id="password"
            type="password"
            onChange={handleChange}
          />
          <div style={{ textAlign: "center", marginTop: "30px"}}>
            <div style={{ display: "inline-block" }}>
              <Recaptcha
                  sitekey={process.env.REACT_APP_CAPTCHA_KEY}
                  render="explicit"
                  onloadCallback={recaptchaLoaded}
                  verifyCallback={verifyCallback}
              />
            </div>
          </div>
          <br />
          <br />
          <input type="submit" value="Log in" className="btn btn-secondary"/>
          <br />
          <p style={{ color: "red" }}>{error}</p>
        </form>
      </div>
    );
  } else {
    return (
      <div>
        <h2>{loginMsg}</h2>
        <br />
        <button onClick={logout} className="btn btn-secondary">Log out</button>
      </div>
    );
  }
};