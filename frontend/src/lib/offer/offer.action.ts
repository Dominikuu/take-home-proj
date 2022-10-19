import store from 'lib/store';

export const MAX_VIEW_AMOUNT = 5

export enum ActionType {
    DELETE = 'DELETE',
    UPDATE = 'UPDATE',
    CREATE = 'CREATE',
    LIST = 'LIST',
    FIND = 'FIND'
}


export function loadOffer() {
  const action: OfferAction = {
    type: ActionType.UPDATE,
    offer: [],
  };
  return  (dispatch: OfferDispatchType) => {
    action.offer = []
    dispatch(action);

  };
}

export function listOffer() {
  const {offer: offerList} = store.getState();
  const action: OfferAction = {
    type: ActionType.LIST,
    offer: offerList.offer,
  };
  return  (dispatch: OfferDispatchType) => {
    dispatch(action);

  };
}

export function getOffer(offerId: string) {
  const {offer: offerList} = store.getState();
  const action: OfferAction = {
    type: ActionType.FIND,
    offer: offerList.offer,
  };
  return  (dispatch: OfferDispatchType) => {
    dispatch(action);

  };
}

export function createOffer(newOffer: any) {
  const {offer: offerList} = store.getState();
  const action: OfferAction = {
    type: ActionType.CREATE,
    offer: offerList.offer,
  };
  
  return  (dispatch: OfferDispatchType) => {
    action.offer = newOffer;
    dispatch(action);
  };
}

export  function clearOffer() {
  const action: OfferAction = {
    type: ActionType.DELETE,
  };
  return  (dispatch: OfferDispatchType) => {
    dispatch(action);
  };
}
