import req from "../../http-common";
import {HttpMethods} from '../../struct'
import authHeader from '../../auth-header';

const updateAllRead = ( data) => {
  return req(HttpMethods.POST, `/user/notifications/mark-as-all-read`, data, {headers: authHeader()})
}

export {
  updateAllRead
};
