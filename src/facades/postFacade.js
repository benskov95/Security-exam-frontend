import URL from "../utils/settings";
import apiFacade, { handleHttpErrors } from "../base-facades/apiFacade";

const postFacade = () => {
  
  const getPostsByThreadId = (id) => {
    return fetch(URL + `/api/post/${id}`, apiFacade.makeOptions("GET"))
    .then(handleHttpErrors);
  };

  const addPost = (post) => {
    return fetch(URL + "/api/post", apiFacade.makeOptions("POST", true, post))
    .then(handleHttpErrors);
  }

  const deleteMyPost = (id) => {
    return fetch(URL + `/api/post/me/${id}`, apiFacade.makeOptions("DELETE", true))
    .then(handleHttpErrors)
  }

  const deletePost = (id) => {
    return fetch(URL + `/api/post/${id}`, apiFacade.makeOptions("DELETE", true))
    .then(handleHttpErrors)
  }

  return { getPostsByThreadId
         , addPost 
         , deleteMyPost
         , deletePost
         };
};

const facade = postFacade();
export default facade;