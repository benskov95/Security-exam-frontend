import "../styles/App.css";
import "../styles/Navbar.css";
import React from "react";
import {
  Switch,
  Route,
  NavLink,
  Redirect,
  useRouteMatch,
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

  let token = JSON.parse(atob(localStorage.getItem("jwtToken").split(".")[1]));
  let user = isLoggedIn ? `Logged in as: ${token.username}` : "";

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
