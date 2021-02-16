import { URL } from "../base-components/Home";
import apiFacade, { handleHttpErrors } from "./apiFacade";

const adminFacade = () => {
  const getUsers = () => {
    return fetch(URL + "/api/users", apiFacade.makeOptions("GET", true)).then(
      handleHttpErrors
    );
  };

  const deleteUser = (userName) => {
    return fetch(
      URL + `/api/users/${userName}`,
      apiFacade.makeOptions("DELETE", true)
    ).then(handleHttpErrors);
  };
  return { getUsers, deleteUser };
};

const facade = adminFacade();
export default facade;
