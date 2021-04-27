import "../styles/App.css";
import "../styles/Navbar.css";
import React, {useState} from "react";
import {
  Switch,
  Route,
  NavLink,
  Redirect,
} from "react-router-dom";
import { Login } from "./Login";
import Home from "./Home";
import Example from "../components/Example";
import Admin from "./Admin";
import Register from "./Register";
import NoMatch from "./NoMatch"
import PrivateRoute from "./PrivateRoute"
import CatThreads from "../components/CatThreads";
import Thread from "../components/Thread";
import Admin_cat from "../components/Admin_cat"

export default function Header({ isLoggedIn, setLoginStatus, loginMsg }) {

  let token = isLoggedIn ? JSON.parse(atob(localStorage.getItem("jwtToken").split(".")[1])) : "";
  let user = isLoggedIn ? `Logged in as: ${token.username}` : "";
console.log("ss ")
  return (
    <div>
      <ul className="header">
        <li>
          <NavLink exact activeClassName="selected" to="/home">
            Home
          </NavLink>
        </li>
        {/* {isLoggedIn && (
          <React.Fragment>
            <li>
              <NavLink activeClassName="active" to="/example">
                Example
              </NavLink>
            </li>
          </React.Fragment>
        )} */}
        {isLoggedIn ? token.role.includes("admin") && (
          <React.Fragment>
            <li>
              <NavLink activeClassName="active" to="/manage-users">
                Manage users
              </NavLink>
            </li>
            <li>
              <NavLink activeClassName="active" to="/manage-categories">
              Manage categories
              </NavLink>
            </li>
          </React.Fragment>
        ) : ""}
        <li>
          <NavLink activeClassName="selected" to="/login">
            {loginMsg}
          </NavLink>
        </li>
        {!isLoggedIn && (
          <React.Fragment>
            <li>
              <NavLink activeClassName="active" to="/register">
                Register
              </NavLink>
            </li>
          </React.Fragment>
        )}
        <li style={{ float: "right", color: "white", marginRight: "20px" }}>
          {user}
          <br />
        </li>
      </ul>

      <Switch>
      {/* for deployment */}
        <Route path="/ca3-startcode">
          <Redirect to="/" />
        </Route>
        <Route exact path="/home">
          <Home />
        </Route>
        <Route path="/home/:catId/:threadId">
          <Thread />
        </Route>
        <Route path="/home/:catId">
          <CatThreads />
        </Route>
        <PrivateRoute path="/example" isLoggedIn={isLoggedIn} component={Example} />
        <PrivateRoute path="/manage-users" isLoggedIn={isLoggedIn} component={Admin} token={token}/>
        <PrivateRoute path="/manage-categories" isLoggedIn={isLoggedIn} component={Admin_cat}/>
        <Route path="/login">
          <Login
            setLoginStatus={setLoginStatus}
            isLoggedIn={isLoggedIn}
            loginMsg={loginMsg}
          />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <Route>
         <NoMatch />
        </Route>
      </Switch>
    </div>
  );
}


