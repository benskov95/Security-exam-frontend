import URL from "../utils/settings";
import apiFacade, { handleHttpErrors } from "./apiFacade";

const adminFacade = () => {
  const getUsers = () => {
    return fetch(URL + "/api/user", apiFacade.makeOptions("GET", true)).then(
      handleHttpErrors
    );
  };

  const deleteUser = (email) => {
    return fetch(
      URL + `/api/user/${email}`,
      apiFacade.makeOptions("DELETE", true)
    ).then(handleHttpErrors);
  };
  const promoteUser = (email) => {
    return fetch(URL + `/api/user/promote/${email}`, apiFacade.makeOptions("PUT", true))
    .then(handleHttpErrors)
  }
  const demoteUser = (email) => {
    return fetch(URL + `/api/user/demote/${email}`, apiFacade.makeOptions("PUT", true))
    .then(handleHttpErrors)
  }

  return { getUsers, deleteUser, promoteUser, demoteUser };
};

const facade = adminFacade();
export default facade;
