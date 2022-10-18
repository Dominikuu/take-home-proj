import { AnyAction } from 'redux';
import {ActionType} from "./offer.action"
const initialState: OfferState = {offer: []};
export default function viewHistorReducer(state: OfferState = initialState, action: AnyAction): OfferState {
  const { type, ...payload } = action;
  switch (type) {
    case ActionType.CREATE:
      return {
        ...state,
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
    default:
      return state;
  }
}
