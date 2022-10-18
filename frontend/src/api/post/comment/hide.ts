import req from "../../http-common";
import {HttpMethods} from '../../struct'
import authHeader from '../../auth-header';

export module UpdateOneCommentHide {
  export const url = "/post/:postId/comment/:commentId/hide";
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


const updateOneCommentHide = (postId: string, commentId: string, reqBody: UpdateOneCommentHide.RequestBody): UpdateOneCommentHide.ResponseBody => {
  return req(UpdateOneCommentHide.method, UpdateOneCommentHide.url.replace(':postId', postId).replace(':commentId', commentId), reqBody, {headers: authHeader()})
}

export  {
    updateOneCommentHide,
}

