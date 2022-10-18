import store from 'lib/store';

export const MAX_VIEW_AMOUNT = 5

export enum ActionType {
    CLEAR = 'CLEAR',
    LOAD = 'LOAD',
    SAVE = 'SAVE',
    LIST = 'List'
}

export const STORAGE_KEY = 'view_history'

export function loadViewHistory() {
  const action: ViewHistoryAction = {
    type: ActionType.LOAD,
    posts: new Set(),
  };
  return  (dispatch: ViewHistoryDispatchType) => {
    const posts = localStorage.getItem(STORAGE_KEY) || []
    action.posts = new Set(posts)
    dispatch(action);

  };
}

export function listViewHistory() {
  const {viewHistory} = store.getState();
  const action: ViewHistoryAction = {
    type: ActionType.LIST,
    posts: viewHistory.posts,
  };
  return  (dispatch: ViewHistoryDispatchType) => {
    dispatch(action);

  };
}

export function saveViewHistory(post_id: string) {
  const {viewHistory} = store.getState();
  const action: ViewHistoryAction = {
    type: ActionType.SAVE,
    posts: viewHistory.posts,
  };
  return  (dispatch: ViewHistoryDispatchType) => {
    const posts = viewHistory.posts
    // Record post
    if(posts.has(post_id)){
      posts.delete(post_id)
    }
    posts.add(post_id)
    // Limit amount of record in localstorage
    if (posts.size > MAX_VIEW_AMOUNT) {
      const first = Array.from(posts)[0]
      posts.delete(first)
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(posts).reverse()))
    action.posts = posts;
    dispatch(action);

  };
}

export  function clearVeiwHistory() {
  const action: ViewHistoryAction = {
    type: ActionType.CLEAR,
  };
  return  (dispatch: ViewHistoryDispatchType) => {
    localStorage.removeItem(STORAGE_KEY)
    dispatch(action);
  };
}
