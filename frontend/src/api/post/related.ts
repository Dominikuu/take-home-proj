import req from "../http-common";
import {HttpMethods} from '../struct'

export enum Sort {
  ASC = 'asc',
  DESC = 'desc'
}
export interface QueryParams {
  sort: Sort;
}

const listAllRelated = ({postId}, params?: QueryParams, ) => {
  return req(HttpMethods.GET, `/post/${postId}/related`, params)
}

export  {
  listAllRelated
}
