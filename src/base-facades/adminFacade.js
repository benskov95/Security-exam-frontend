import URL from "../utils/settings";
import apiFacade, { handleHttpErrors } from "./apiFacade";

const adminFacade = () => {
  const getUsers = () => {
    return fetch(URL + "/api/user", apiFacade.makeOptions("GET", true)).then(
      handleHttpErrors
    );
  };

  const deleteUser = (userName) => {
    return fetch(
      URL + `/api/user/${userName}`,
      apiFacade.makeOptions("DELETE", true)
    ).then(handleHttpErrors);
  };

  return { getUsers, deleteUser };
};

const facade = adminFacade();
export default facade;
