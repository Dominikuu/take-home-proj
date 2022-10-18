import req from "../../http-common";
import {HttpMethods} from '../../struct'
import authHeader from '../../auth-header';

const updateOneRead = (data) => {
  return req(HttpMethods.POST, `/user/notification/read`, data, {headers: authHeader()})
}

export {
  updateOneRead
};
