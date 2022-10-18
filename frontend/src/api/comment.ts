import req from "./http-common";
import {HttpMethods} from './struct'
import authHeader from './auth-header';

export enum Sort {
  ASC = 'asc',
  DESC = 'desc'
}
export interface QueryParams {
  sort: Sort;
}

export module CreateOne {
  export const url = "/post/:postId/comment";
  export const method = HttpMethods.POST;
  export interface RequestBody {
    content: string;
    author: string;
    commentId: string;
  }
  export interface ResponseBody {

  }
  export interface Response {
      status: number;
      message: string;
      body: ResponseBody;
  }
}

export module ListAll {
  export const url = "/post/:postId/comment";
  export const method = HttpMethods.GET;
  export interface ResponseBody {

  }
  export interface Response {
      status: number;
      message: string;
      body: ResponseBody;
  }
}
const createOneComment = ({postId}, reqBody) => {
  return req(HttpMethods.POST, `/post/${postId}/comment`, reqBody, {headers: authHeader()})
}

const updateOneComment = ({postId, commentId}, reqBody)=>{
  return req(HttpMethods.PUT, `/post/${postId}/comment/${commentId}`, reqBody, {headers: authHeader()})
}

const getOneComment = ({postId, commentId})=>{
  return req(HttpMethods.GET, `/post/${postId}/comment/${commentId}`)
}

const listAllCommentReplies= ({postId, commentId})=>{
  return req(HttpMethods.GET, `/post/${postId}/comment/${commentId}/reply`)
}

const listAllComments = ({postId}, params?: QueryParams, ) => {
  return req(HttpMethods.GET, `/post/${postId}/comment`, params)
}

const deleteOneComment = ({postId, commentId}) => {
  return req(HttpMethods.DELETE, `/post/${postId}/comment/${commentId}`, null,  {headers: authHeader()})
}
export  {
  createOneComment,
  listAllComments,
  listAllCommentReplies,
  updateOneComment,
  deleteOneComment,
  getOneComment
}
