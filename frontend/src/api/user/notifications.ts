import req from "../http-common";
import authHeader from '../auth-header';
import {HttpMethods} from '../struct'

export enum SortType {
    ASC = 'asc',
    DESC = 'desc'
}

export enum LogLevel {
  Info = 'INFO',
  Warning = 'WARNING'
}

export interface QueryParams {
    sort_type?: SortType;
    search?: string;
    sort?: string;
    filter?: string;
    limit?: number;
    skip?: number;
}

export interface RequestBody {
  start_time: number;
  end_time: number;
  log_levels: LogLevel[]
}

const listAllNotifications = (data: RequestBody) => {
    return req(HttpMethods.POST, `/user/notifications`, data, {headers: authHeader()})
}

export {
  listAllNotifications
};
