import req from "../http-common";
import authHeader from '../auth-header';
import {HttpMethods} from '../struct'

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
