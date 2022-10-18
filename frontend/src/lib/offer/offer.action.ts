import store from 'lib/store';

export const MAX_VIEW_AMOUNT = 5

export enum ActionType {
    DELETE = 'DELETE',
    UPDATE = 'UPDATE',
    CREATE = 'CREATE',
    LIST = 'List'
}

export const STORAGE_KEY = 'view_history'

export function loadViewHistory() {
  const action: OfferAction = {
    type: ActionType.UPDATE,
    offer: [],
  };
  return  (dispatch: ViewHistoryDispatchType) => {
    const offer = localStorage.getItem(STORAGE_KEY) || []
    action.offer = []
    dispatch(action);

  };
}

export function listViewHistory() {
  const {offer: offerList} = store.getState();
  const action: OfferAction = {
    type: ActionType.LIST,
    offer: offerList.offer,
  };
  return  (dispatch: ViewHistoryDispatchType) => {
    dispatch(action);

  };
}

export function saveViewHistory(post_id: string) {
  const {offer: offerList} = store.getState();
  const action: OfferAction = {
    type: ActionType.CREATE,
    offer: offerList.offer,
  };
  return  (dispatch: OfferDispatchType) => {
    const offer = offerList.offer
    // Record post
    // if(offer.includes()){
    //   offer.delete(post_id)
    // }
    // offer.add(post_id)
    // // Limit amount of record in localstorage
    // if (offer.size > MAX_VIEW_AMOUNT) {
    //   const first = Array.from(offer)[0]
    //   offer.delete(first)
    // }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(offer).reverse()))
    action.offer = offer;
    dispatch(action);

  };
}

export  function clearVeiwHistory() {
  const action: OfferAction = {
    type: ActionType.DELETE,
  };
  return  (dispatch: ViewHistoryDispatchType) => {
    localStorage.removeItem(STORAGE_KEY)
    dispatch(action);
  };
}
