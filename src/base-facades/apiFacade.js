import { URL } from "../base-components/Home";

export function handleHttpErrors(res) {
  if (!res.ok) {
    return Promise.reject({ status: res.status, fullError: res.json() });
  }
  return res.json();
}

function apiFacade() {
  const setToken = (token) => {
    localStorage.setItem("jwtToken", token);
  };

  const getToken = () => {
    return localStorage.getItem("jwtToken");
  };

  const setUserAndRoles = (token) => {
    let userFromToken = JSON.parse(atob(token.split(".")[1]));
    localStorage.setItem("user", userFromToken.sub);
    localStorage.setItem("roles", userFromToken.roles);
  };

  const loggedIn = () => {
    const loggedIn = getToken() != null;
    return loggedIn;
  };

  const logout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("user");
    localStorage.removeItem("roles");
  };

  const login = (user) => {
    const options = makeOptions("POST", true, {
      username: user.username,
      password: user.password,
    });
    return fetch(URL + "/api/login", options)
      .then(handleHttpErrors)
      .then((res) => {
        setUserAndRoles(res.token);
        setToken(res.token);
      });
  };


  const register = (user) => {
    const options = makeOptions("POST", false, {
      username: user.username,
      password: user.password,
    });
    return fetch(URL + "/api/users", options)
      .then(handleHttpErrors)
  }

  const makeOptions = (method, addToken, body) => {
    var opts = {
      method: method,
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
      },
    };
    if (addToken && loggedIn()) {
      opts.headers["x-access-token"] = getToken();
    }
    if (body) {
      opts.body = JSON.stringify(body);
    }
    return opts;
  };
  return {
    makeOptions,
    setToken,
    getToken,
    loggedIn,
    login,
    logout,
    register
  };
}
const facade = apiFacade();
export default facade;
