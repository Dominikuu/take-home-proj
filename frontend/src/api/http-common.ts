import axios from 'axios';
import {stringify} from 'qs'
import authHeader from './auth-header'
import {HttpMethods} from './struct';
import {logout} from 'lib/auth/auth.action';
import store from 'lib/store';

const BASE_URL = process.env.REACT_APP_API_ENDPOINT;
const {dispatch} = store;
const instance = axios.create({
    baseURL: BASE_URL,
    headers: {
        ...authHeader(),
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': process.env.REACT_APP_API_ENDPOINT as string,
    },
    timeout: 20000
  });

instance.interceptors.request.use(
    function (config) {
        // Do something before request is sent
        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    function (response) {
      // Do something with response data
      return response;
    },
    function (error) {
      if (error.response){
        switch (error.response.status) {
          case 404:
            console.log("NOT_FOUND")
            // go to 404 page
            break
          case 500:
            console.log("INVALID_REQUEST")
            // go to 500 page
            break
          case 401:
            console.log("NO_AUTHORIZED")
            // go to 500 page
            dispatch(logout() as any)
            break
          default:
            console.log(error.message)
        }
      }
      if (!window.navigator.onLine) {
        alert("INTERNET_CONNECT_ERROR");
        return;
      }
      return Promise.reject(error.response);
    }
  );


export default function httpCommon(method:HttpMethods, url: string, data?:any, config?: any): any {
    let responeBody = null;
    switch (method) {
        case HttpMethods.POST:
            return instance.post(url, data, config);
        case HttpMethods.GET:
            return instance.get(url, Object.assign({ 
              params: data, 
              paramsSerializer: (params) => stringify(params, {arrayFormat: 'repeat'})}, 
              config
            ));
        case HttpMethods.DELETE:
            return instance.delete(url, {...config, data});
        case HttpMethods.PUT:
            return instance.put(url, data, config);
        case HttpMethods.PATCH:
            return instance.patch(url, data);
        default:
            console.log(`Unknown method: ${method}`);
            return Promise.reject(false);
    }
}
