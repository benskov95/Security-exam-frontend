import URL from "../utils/settings";
import apiFacade, { handleHttpErrors } from "../base-facades/apiFacade";

const categoryFacade = () => {
  
  const getAllCategories = () => {
    return fetch(URL + "/api/category", apiFacade.makeOptions("GET", true))
    .then(handleHttpErrors);
  };

  return { getAllCategories };
};

const facade = categoryFacade();
export default facade;