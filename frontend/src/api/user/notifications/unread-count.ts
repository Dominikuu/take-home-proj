import req from "../../http-common";
import {HttpMethods} from '../../struct'
import authHeader from '../../auth-header';
import {LogLevel} from '../notifications'
interface RequestBody {
    start_time: number;
    end_time: number;
    log_levels: LogLevel[]
}
const getUserUnreadCount = (data) => {
  return req(HttpMethods.POST, `/user/notifications/unread`, data, {headers: authHeader()})
}

export {
    getUserUnreadCount
};
