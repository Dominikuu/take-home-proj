import req from "./http-common";
import authHeader from './auth-header';
import {HttpMethods} from './struct'


const checkOne = (reqBody) => {
  return req(HttpMethods.POST, `/user/verify-token`, reqBody)
}
const getOneUserProfile = () => {
  return req(HttpMethods.GET, '/user/profile', null, {headers: authHeader()})
}
const logout = () => {
  return req(HttpMethods.POST, `/user/logout`)
}
export {
  checkOne,
  getOneUserProfile,
  logout
};
