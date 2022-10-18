import req from "./http-common";
import {HttpMethods} from './struct'

export interface QueryParams {
    filter?: string;
}


const globalSearch = (params?: QueryParams) => {
  return req(HttpMethods.GET, "/global-search/", params)
}
export {
  globalSearch
}
