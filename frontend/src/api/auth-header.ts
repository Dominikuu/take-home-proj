import {AxiosRequestHeaders} from 'axios';
import {get as getByPath} from 'lodash';
import store from 'lib/store';

export default function authHeader(): AxiosRequestHeaders {
    // const user = JSON.parse(localStorage.getItem('user')!);
    const {auth: authState} = store.getState();
    const jwtToken = getByPath(authState, 'user.jwtToken') || localStorage.getItem('token');
    return jwtToken ? {Authorization: `Bearer ${jwtToken}`, 'Set-Cookie': 'access_token_cookie=' + jwtToken} : {};
    // return user && user.accessToken ? {'x-access-token': user.accessToken} : {};
}
