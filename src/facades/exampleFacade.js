import { URL } from "../base-components/Home";
import apiFacade, { handleHttpErrors } from "../base-facades/apiFacade";

const exampleFacade = () => {
  
  const exampleMethod1 = () => {
    return fetch(URL + "/api/example", apiFacade.makeOptions("GET", true))
    .then(handleHttpErrors);
  };

  return { exampleMethod1 };
};

const facade = exampleFacade();
export default facade;
