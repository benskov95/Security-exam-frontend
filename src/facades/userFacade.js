import URL, {IMGBB_URL, IMGBB_API_KEY} from "../utils/settings";
import apiFacade, { handleHttpErrors } from "../base-facades/apiFacade";
import axios from 'axios';

const userFacade = () => {
  
  const editUser = (user) => {
    return fetch(URL + "/api/user/me", apiFacade.makeOptions("PUT", true, user))
    .then(handleHttpErrors);
  };

  const uploadImage = (file) => {
    let body = new FormData();
    body.set("key", IMGBB_API_KEY)
    body.append("image", file)

    return axios({
      method: 'post',
      url: IMGBB_URL,
      data: body
    })
  }

  return { editUser
         , uploadImage 
         };
};

const facade = userFacade();
export default facade;