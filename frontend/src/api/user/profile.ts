import req from "../http-common";
import authHeader from '../auth-header';
import {HttpMethods} from '../struct'

const updateOneProfile = (reqBody) => {
  return req(HttpMethods.POST, `/user/profile`, reqBody, {headers: authHeader()})
}
const getOneProfile = () => {
  return req(HttpMethods.GET, '/user/profile', null, {headers: authHeader()})
}

export {
    updateOneProfile,
    getOneProfile
};
