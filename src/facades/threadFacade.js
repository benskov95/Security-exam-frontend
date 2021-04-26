import URL from "../utils/settings";
import apiFacade, { handleHttpErrors } from "../base-facades/apiFacade";

const threadFacade = () => {
  
  const getAllThreadsByCatId = (id) => {
    return fetch(URL + `api/thread/${id}`, apiFacade.makeOptions("GET", true))
    .then(handleHttpErrors);
  };

  return { getAllThreadsByCatId };
};

const facade = threadFacade();
export default facade;