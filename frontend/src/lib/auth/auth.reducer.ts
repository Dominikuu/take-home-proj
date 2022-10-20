import { AnyAction } from 'redux';
import {ActionType} from "./auth.action"
// // import {ActionType} from "./auth.action";
// export interface ActionState {
//   isLoggedIn: boolean;
//   user: string | null
// }

const user = JSON.parse(localStorage.getItem("user") as string);
const initialState: AuthState = user
  ? { isLoggedIn: true, user }
  : { isLoggedIn: false, user: null };
export default function authReducer(state: AuthState = initialState, action: AnyAction): AuthState {
  const { type, ...payload } = action;
  switch (type) {
    case ActionType.REGISTER_SUCCESS:
      return {
        ...state,
        isLoggedIn: false,
      };
    case ActionType.REGISTER_FAIL:
      return {
        ...state,
        isLoggedIn: false,
      };
    case ActionType.LOGIN_SUCCESS:
      console.log(payload.user)
      return {
        ...state,
        isLoggedIn: true,
        user: payload.user,
      };
    case ActionType.LOGIN_FAIL:
      return {
        ...state,
        isLoggedIn: false,
        user: null,
      };
    case ActionType.LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        user: null,
      };
    case ActionType.UPDATE_PROFILE:
      console.log(payload.user)
      return {
        ...state,
        isLoggedIn: true,
        user: payload.user
      };
    default:
      return state;
  }
}
