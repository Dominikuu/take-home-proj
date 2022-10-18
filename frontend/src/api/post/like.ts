import req from "../http-common";
import {HttpMethods} from '../struct'
import authHeader from '../auth-header';
export module UpdateOneLike {
  export const url = "/post/like";
  export const method = HttpMethods.PUT;
  export interface RequestBody {
    user_id: string;
    post_id: string;
    comment_id: string | null;
  }
  export interface ResponseBody {
    data: number;
  }
  export interface Response {
      status: number;
      message: string;
      body: ResponseBody;
  }
}

export module UpdateOneUnlike {
  export const url = "/post/unlike";
  export const method = HttpMethods.PUT;
  export interface RequestBody {
    user_id: string;
    post_id: string;
    comment_id: string | null;
  }
  export interface ResponseBody {
    data: number;
  }
  export interface Response {
      status: number;
      message: string;
      body: ResponseBody;
  }
}

const updateOneLike = (reqBody: UpdateOneLike.RequestBody): UpdateOneLike.ResponseBody => {
  return req(UpdateOneLike.method, UpdateOneLike.url, reqBody, {headers: authHeader()})
}

const updateOneUnlike = (reqBody: UpdateOneUnlike.RequestBody): UpdateOneUnlike.ResponseBody => {
  return req(UpdateOneUnlike.method, UpdateOneUnlike.url, reqBody, {headers: authHeader()})
}

export  {
    updateOneLike,
    updateOneUnlike,
}
