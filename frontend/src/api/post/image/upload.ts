import req from "../../http-common";
import {HttpMethods} from '../../struct'
import authHeader from '../../auth-header';

const createPostImage = (reqBody) => {
  return req(HttpMethods.POST, `/post/image/upload`, reqBody, {headers: authHeader()})
}

export {
    createPostImage
};
