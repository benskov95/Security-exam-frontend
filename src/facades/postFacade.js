import URL from "../utils/settings";
import apiFacade, { handleHttpErrors } from "../base-facades/apiFacade";

const postFacade = () => {
  
  const getPostsByThreadId = (id) => {
    return fetch(URL + `/api/post/${id}`, apiFacade.makeOptions("GET", true))
    .then(handleHttpErrors);
  };

  const addPost = (post) => {
    return fetch(URL + "/api/post", apiFacade.makeOptions("POST", true, post))
    .then(handleHttpErrors);
  }

  return { getPostsByThreadId
         , addPost 
         };
};

const facade = postFacade();
export default facade;