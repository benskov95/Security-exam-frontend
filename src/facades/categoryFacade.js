import URL from "../utils/settings";
import apiFacade, { handleHttpErrors } from "../base-facades/apiFacade";

const categoryFacade = () => {
  
  const getAllCategories = () => {
    return fetch(URL + "/api/category", apiFacade.makeOptions("GET", true))
    .then(handleHttpErrors);
  };

  const deleteCategory = (id) => {
    return fetch(URL + "/api/category/"+ id, apiFacade.makeOptions("DELETE", true))
    .then(handleHttpErrors)
  }
  const addCategory = (cat) => {
    return fetch(URL + "/api/category", apiFacade.makeOptions("POST", true,cat))
    .then(handleHttpErrors)
  }
  const editCategory = (cat) => {
    return fetch(URL + "/api/category", apiFacade.makeOptions("PUT", true,cat))
    .then(handleHttpErrors)
  }

  return { getAllCategories, deleteCategory, addCategory, editCategory };
};

const facade = categoryFacade();
export default facade;