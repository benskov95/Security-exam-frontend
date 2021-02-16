import "./styles/Navbar.css";
import Header from "./base-components/Header";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  let history = useHistory();

  const setLoginStatus = (status) => {
    setIsLoggedIn(status);
    history.push("/");
  };

  return (
    <div className="App">
      <Header
        isLoggedIn={isLoggedIn}
        loginMsg={isLoggedIn ? "Log out" : "Log in"}
        setLoginStatus={setLoginStatus}
      />
    </div>
  );
}
