import req from "../http-common";
import authHeader from '../auth-header';
import {HttpMethods} from '../struct'

export enum SortType {
    ASC = 'asc',
    DESC = 'desc'
}

export enum Action {
    Add = 'ADD',
    Remove = 'REMOVE'
}

export interface RequestBody {
    action: Action;
    post: string;
}

export interface QueryParams {
    sort_type?: SortType;
    search?: string;
    sort?: string;
    filter?: string;
    limit?: number;
    skip?: number;
}

const listAllBookmarks = (params?: QueryParams) => {
    return req(HttpMethods.GET, `/user/bookmark`, params, {headers: authHeader()})
}

const updateOneBookmarks = (reqBody: RequestBody) => {
    return req(HttpMethods.PUT, `/user/bookmark`, reqBody, {headers: authHeader()})
}

export {
    listAllBookmarks,
    updateOneBookmarks
};
