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

  return { getAllThreadsByCatId
         , getThreadById
         };
};

const facade = threadFacade();
export default facade;