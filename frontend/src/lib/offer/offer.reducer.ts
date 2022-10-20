import { AnyAction } from 'redux';
import {ActionType} from "./offer.action"

const initialState: OfferState = {offer: []};

export default function offerReducer(state: OfferState = initialState, action: AnyAction): OfferState {
  const { type, ...payload } = action;
  switch (type) {
    case ActionType.CREATE:
      console.log(type)
      return {
        ...state,
        offer: payload.offer,
    };
    case ActionType.LIST:
      return {
        ...state,
        offer: [],
    };
    case ActionType.DELETE:
      return {
        ...state,
        offer: payload.offer,
    };
    case ActionType.LOAD:
      return {
        ...state,
        offer: payload.offer,
    };
    default:
      return state;
  }
}
