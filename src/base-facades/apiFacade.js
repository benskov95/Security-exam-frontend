import URL from "../utils/settings";

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

  const loggedIn = () => {
    const loggedIn = getToken() != null;
    return loggedIn;
  };

  const logout = () => {
    localStorage.removeItem("jwtToken");
  };

  const login = (user) => {
    const options = makeOptions("POST", true, {
      email: user.email,
      password: user.password,
    });
    return fetch(URL + "/api/login", options)
      .then(handleHttpErrors)
  };


  const register = (user) => {
    const options = makeOptions("POST", false, {
      email: user.email,
      username: user.username,
      password: user.password,
    });
    return fetch(URL + "/api/user", options)
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
