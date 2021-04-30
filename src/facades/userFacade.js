import URL from "../utils/settings";
import apiFacade, { handleHttpErrors } from "../base-facades/apiFacade";

const userFacade = () => {
  
  const editUser = (user) => {
    return fetch(URL + "/api/user/me", apiFacade.makeOptions("PUT", true, user))
    .then(handleHttpErrors);
  };

  return { editUser };
};

const facade = userFacade();
export default facade;