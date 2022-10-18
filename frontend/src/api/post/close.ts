import req from "../http-common";
import {HttpMethods} from '../struct'
import authHeader from '../auth-header';

export module UpdateOnePostClose {
  export const url = "/post/:postId/close";
  export const method = HttpMethods.PUT;
  export interface RequestBody {
    closed: boolean
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


const updateOnePostClose = (postId: string, reqBody: UpdateOnePostClose.RequestBody): UpdateOnePostClose.ResponseBody => {
  return req(UpdateOnePostClose.method, UpdateOnePostClose.url.replace(':postId', postId), reqBody, {headers: authHeader()})
}

export  {
    updateOnePostClose,
}
