import "../styles/App.css";
import "../styles/Navbar.css";
import React from "react";
import { Nav } from 'react-bootstrap';
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

export default function Header({ isLoggedIn, setLoginStatus, loginMsg }) {

  let token = isLoggedIn ? JSON.parse(atob(localStorage.getItem("jwtToken").split(".")[1])) : {"role": ""};
  let user = isLoggedIn ? `${token.username}` : "";

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
        {token.role.includes("admin") && (
          <React.Fragment>
            <li>
              <NavLink activeClassName="active" to="/admin">
                Admin
              </NavLink>
            </li>
          </React.Fragment>
        )}
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
        <Nav.Item style={{ position: 'fixed', right: 0, marginRight: "15px" }}>
          {isLoggedIn &&
            <img src="https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"
              alt=""
              // onClick={toggleUserOptions}
              style={{
                height: "30px",
                width: "30px",
                marginTop: "-2px",
                cursor: "pointer"
              }}>
            </img>
          }
          <p style={{ marginTop: "1px", color: "white" }}>{user}</p>
        </Nav.Item>
      </ul>

      <Switch>
      {/* for deployment */}
        <Route path="/ca3-startcode">
          <Redirect to="/home" />
        </Route>
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
        <Route exact path="/home">
          <Home />
        </Route>
        <Route path="/home/:catId/:threadId">
          <Thread isLoggedIn={isLoggedIn} user={user} />
        </Route>
        <Route path="/home/:catId">
          <CatThreads />
        </Route>
        <PrivateRoute path="/example" isLoggedIn={isLoggedIn} component={Example} />
        <PrivateRoute path="/admin" isLoggedIn={isLoggedIn} component={Admin} />
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
