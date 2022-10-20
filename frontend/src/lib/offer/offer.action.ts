import store from 'lib/store';
import {v4 as uuidv4} from "uuid"
export const MAX_VIEW_AMOUNT = 5

export enum ActionType {
    DELETE = 'DELETE',
    UPDATE = 'UPDATE',
    CREATE = 'CREATE',
    LIST = 'LIST',
    FIND = 'FIND',
    LOAD = 'LOAD'
}


export function loadOffers() {
  const action: OfferAction = {
    type: ActionType.LOAD,
    offer: [],
  };
  return  (dispatch: OfferDispatchType) => {
    const data = JSON.parse(localStorage.getItem('OFFERS') as string)
    console.log(JSON.parse(localStorage.getItem('OFFERS') as string))
    const offers: Offer[] = []
    action.offer = JSON.parse(localStorage.getItem('OFFERS') as string)
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
    const {offer: offerList} = store.getState();  
    action.offer = [...offerList.offer, {...newOffer, id: uuidv4(), comments: []}];
    localStorage.setItem('OFFERS', JSON.stringify(action.offer))
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
