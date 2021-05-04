import "../styles/App.css";
import "../styles/Navbar.css";
import { Nav } from 'react-bootstrap';
import React, { useEffect, useState } from "react";
import {
  Switch,
  Route,
  NavLink,
  Redirect,
} from "react-router-dom";
import { Login } from "./Login";
import Home from "./Home";
import Admin from "./Admin";
import Register from "./Register";
import NoMatch from "./NoMatch"
import PrivateRoute from "./PrivateRoute"
import CatThreads from "../components/CatThreads";
import Thread from "../components/Thread";
import Admin_cat from "../components/Admin_cat"
import EditUser from "../components/EditUser";
import AddThread from "../components/AddThread";

export default function Header({ isLoggedIn, setLoginStatus, loginMsg }) {
  
  let token = isLoggedIn ? JSON.parse(atob(localStorage.getItem("jwtToken").split(".")[1])) : {"username": "", "role": ""};
  const [user, setUser] = useState(token.username);

  useEffect(() => {
    setUser(token.username)
  }, [token])

  return (
    <div>
      <ul className="header">
        <li>
          <NavLink exact activeClassName="selected" to="/home">
            Home
          </NavLink>
        </li>
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
          <NavLink activeClassName="active" to="/login">
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
        <Nav.Item style={{ float: "right", marginRight: "15px" }}>
          {isLoggedIn && (
            <NavLink activeClassName="active" to="/edit">
            <img src={token.imageUrl}
              alt=""
              style={{
                height: "30px",
                width: "30px",
                marginTop: "-2px",
                cursor: "pointer"
              }}>
            </img>
            </NavLink>
          )}
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

        <Route exact path="/home">
          <Home />
        </Route>
        <Route path="/home/:catId/add-thread">
          <AddThread isLoggedIn={isLoggedIn} component={AddThread} token={token} />
        </Route>
        <Route path="/home/:catId/:threadId">
          <Thread isLoggedIn={isLoggedIn} token={token} />
        </Route>
        <Route path="/home/:catId">
          <CatThreads isLoggedIn={isLoggedIn} token={token} />
        </Route>

                 
        <PrivateRoute path="/manage-users" isLoggedIn={isLoggedIn} component={Admin} token={token}/>
        <PrivateRoute path="/manage-categories" isLoggedIn={isLoggedIn} component={Admin_cat}/>
        <PrivateRoute path="/edit" isLoggedIn={isLoggedIn} component={EditUser} token={token} setUser={setUser}/>

        <Route>
         <NoMatch />
        </Route>

      </Switch>
    </div>
  );
}


