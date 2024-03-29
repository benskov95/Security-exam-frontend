import URL from "../utils/settings";

export function handleHttpErrors(res) {
  if (!res.ok) {
    return Promise.reject({ status: res.status, fullError: res.json() });
  }
  return res.json();
}

function apiFacade() {
  let tokenInUse = ""

  const setTokenInUse = (token) => {
    tokenInUse = token;
  };

  const getTokenInUse = () => {
    return tokenInUse;
  };

  const loggedIn = () => {
    const loggedIn = getTokenInUse() != null;
    return loggedIn;
  };

  const logout = () => {
    tokenInUse = "";
  };

  const login = (user) => {
    const options = makeOptions("POST", true, user);
    return fetch(URL + "/api/login", options)
    .then(handleHttpErrors)
  };

  const authadmin = (user) => {
    const options = makeOptions("POST", true, {
      auth: user.authcode,
      user_id: user.user_id,
    });
    return fetch(URL + "/api/auth", options)
        .then(handleHttpErrors)
  };

  const register = (user) => {
    const options = makeOptions("POST", false, {
      email: user.email,
      username: user.username,
      password: user.password,
      phone: user.phone,
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
      opts.headers["x-access-token"] = getTokenInUse();
    }
    if (body) {
      opts.body = JSON.stringify(body);
    }
    return opts;
  };
  return {
    makeOptions,
    setTokenInUse,
    getTokenInUse,
    loggedIn,
    login,
    logout,
    register,
    authadmin
  };
}
const facade = apiFacade();
export default facade;
