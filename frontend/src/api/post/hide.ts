import req from "../http-common";
import {HttpMethods} from '../struct'
import authHeader from '../auth-header';

export module UpdateOnePostHide {
  export const url = "/post/:postId/hide";
  export const method = HttpMethods.PUT;
  export interface RequestBody {
    hidden: boolean
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


const updateOnePostHide = (postId: string, reqBody: UpdateOnePostHide.RequestBody): UpdateOnePostHide.ResponseBody => {
  return req(UpdateOnePostHide.method, UpdateOnePostHide.url.replace(':postId', postId), reqBody, {headers: authHeader()})
}

export  {
    updateOnePostHide,
}
