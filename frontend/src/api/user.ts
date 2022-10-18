import req from "./http-common";
import authHeader from './auth-header';
import {HttpMethods} from './struct'

// class UserService {
//     getPublicContent() {
//         return axios.get(API_URL + 'all');
//     }

//     getUserBoard() {
//         return axios.get(API_URL + 'user', {headers: authHeader()});
//     }

//     getModeratorBoard() {
//         return axios.get(API_URL + 'mod', {headers: authHeader()});
//     }

//     getAdminBoard() {
//         return axios.get(API_URL + 'admin', {headers: authHeader()});
//     }
//     checkAuth() {
//       return axios.post()
//     }
// }

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
