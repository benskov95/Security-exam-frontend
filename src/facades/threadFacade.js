import URL from "../utils/settings";
import apiFacade, { handleHttpErrors } from "../base-facades/apiFacade";

const threadFacade = () => {
  
  const getAllThreadsByCatId = (id) => {
    return fetch(URL + `/api/thread/${id}`, apiFacade.makeOptions("GET"))
    .then(handleHttpErrors);
  };

  const getThreadById = (id) => {
    return fetch(URL + `/api/thread/info/${id}`, apiFacade.makeOptions("GET"))
    .then(handleHttpErrors)
  }
  const addThread = (newThread) => {
    return fetch(URL + `/api/thread`, apiFacade.makeOptions("POST",true,newThread))
    .then(handleHttpErrors)
  }
  const deleteThread = (id) => {
    return fetch(URL + `/api/thread/${id}`, apiFacade.makeOptions("DELETE",true))
    .then(handleHttpErrors)
  }

  const deleteMyThread = (id) => {
    return fetch(URL + `/api/thread/me/${id}`, apiFacade.makeOptions("DELETE", true))
    .then(handleHttpErrors)
  }

  return { getAllThreadsByCatId
         , getThreadById
         , addThread
         , deleteThread
         , deleteMyThread
         };
};

const facade = threadFacade();
export default facade;