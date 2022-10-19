import { AnyAction } from 'redux';
import {ActionType} from "./offer.action"
import {v4 as uuidv4} from "uuid"
const initialState: OfferState = {offer: []};

export default function offerReducer(state: OfferState = initialState, action: AnyAction): OfferState {
  const { type, ...payload } = action;
  switch (type) {
    case ActionType.CREATE:
      console.log(type)
      return {
        ...state,
        offer: [...state.offer,Object.assign(payload.offer, {id: uuidv4()})],
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
