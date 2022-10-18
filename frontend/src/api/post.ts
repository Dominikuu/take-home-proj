import req from "./http-common";
import authHeader from './auth-header';
import {HttpMethods} from './struct'
export enum SortType {
    ASC = 'asc',
    DESC = 'desc'
 }

export enum Status {
  NONE = 'none',
  ONGOING = 'ongoing',
  NEW = 'new'
}


export interface QueryParams {
    sort_type?: SortType;
    search?: string;
    sort?: string;
    filter?: string;
    limit?: number;
    skip?: number;
}

export module CreateOne {
  export const url = "/post/create";
  export const method = HttpMethods.POST;
  export interface RequestBody {
    content: string;
    title: string;
    category: string;
    tags: string[];
    author: string;
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
  export const url = "/posts";
  export const method = HttpMethods.GET;
  export interface ResponseBody {

  }
  export interface Response {
      status: number;
      message: string;
      body: ResponseBody;
  }
}
const createOnePost = (reqBody) => {
  return req(HttpMethods.POST, "/post/create", reqBody, {headers: authHeader()})
}

const getOnePost = (postId: string) => {
  return req(HttpMethods.GET, "/post/" + postId, null, {headers: authHeader()} )
}

const updateOnePost = (postId: string, reqBody) => {
  return req(HttpMethods.PUT, "/post/" + postId, reqBody, {headers: authHeader()})
}

const listAllPosts = (params?: QueryParams) => {
  return req(HttpMethods.GET, "/posts/", params, {headers: authHeader()})
}

const listManyPosts = (reqBody: {post_ids: string[]}) => {
  return req(HttpMethods.POST, "/posts/", reqBody)
}

const deleteManyPosts = (reqBody: string[]) => {
  return req(HttpMethods.DELETE, "/posts/", reqBody,  {headers: authHeader()})
}

const deleteOnePost = (userNo) => {
  return req(HttpMethods.DELETE, "/post/delete", userNo)
}
const statisticPosts = () => {
  return req(HttpMethods.GET, "/posts/statistic", null, {headers: authHeader()})
}
export  {
    createOnePost,
    getOnePost,
    listAllPosts,
    deleteOnePost,
    statisticPosts,
    updateOnePost,
    deleteManyPosts,
    listManyPosts,
}
