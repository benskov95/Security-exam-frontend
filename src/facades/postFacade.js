import URL from "../utils/settings";
import apiFacade, { handleHttpErrors } from "../base-facades/apiFacade";

const postFacade = () => {
  
  const getPostsByThreadId = (id) => {
    return fetch(URL + `/api/post/${id}`, apiFacade.makeOptions("GET", true))
    .then(handleHttpErrors);
  };

  return { getPostsByThreadId };
};

const facade = postFacade();
export default facade;