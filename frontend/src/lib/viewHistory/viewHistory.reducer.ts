import { AnyAction } from 'redux';
import {ActionType, STORAGE_KEY} from "./veiwHistory.action"
const local = localStorage.getItem(STORAGE_KEY)? JSON.parse(localStorage.getItem(STORAGE_KEY) as string) : []
const view_history = new Set(local) as Set<string>;
const initialState: ViewHistoryState = { posts: view_history};
export default function viewHistorReducer(state: ViewHistoryState = initialState, action: AnyAction): ViewHistoryState {
  const { type, ...payload } = action;
  switch (type) {
    case ActionType.LOAD:
      return {
        ...state,
    };
    case ActionType.CLEAR:
      return {
        ...state,
        posts: new Set(),
    };
    case ActionType.SAVE:
      return {
        ...state,
        posts: payload.posts,
    };
    default:
      return state;
  }
}
