import store from 'lib/store';
import {v4 as uuidv4} from 'uuid';

export enum ActionType {
    DELETE = 'DELETE',
    UPDATE = 'UPDATE',
    CREATE = 'CREATE',
    LIST = 'LIST',
    FIND = 'FIND',
    LOAD = 'LOAD',
    CREATE_COMMENT = 'CREATE_COMMENT',
    UPDATE_COMMENT = 'UPDATE_COMMENT',
}

export function createComment(offerId: string, comment) {
    const {offer: offerList} = store.getState();

    const action: OfferAction = {
        type: ActionType.CREATE_COMMENT,
        offer: offerList.offer,
    };
    return (dispatch: OfferDispatchType) => {
        const target_offer = action.offer?.find(({id}) => id === offerId);
        target_offer && target_offer.comments.push({...comment, id: uuidv4(), author: {}, create_time: Date.now()});
        localStorage.setItem('OFFERS', JSON.stringify(action.offer));
        dispatch(action);
    };
}

export function loadOffers() {
    const action: OfferAction = {
        type: ActionType.LOAD,
        offer: [],
    };
    return (dispatch: OfferDispatchType) => {
        action.offer = JSON.parse(localStorage.getItem('OFFERS') as string) || [];
        dispatch(action);
    };
}

export function listOffer() {
    const {offer: offerList} = store.getState();
    const action: OfferAction = {
        type: ActionType.LIST,
        offer: offerList.offer,
    };
    return (dispatch: OfferDispatchType) => {
        dispatch(action);
    };
}

export function getOffer(offerId: string) {
    const {offer: offerList} = store.getState();
    const action: OfferAction = {
        type: ActionType.FIND,
        offer: offerList.offer,
    };
    return (dispatch: OfferDispatchType) => {
        dispatch(action);
    };
}

export function createOffer(newOffer: any) {
    const {offer: offerList} = store.getState();
    const action: OfferAction = {
        type: ActionType.CREATE,
        offer: offerList.offer,
    };

    return (dispatch: OfferDispatchType) => {
        const {offer: offerList} = store.getState();
        action.offer = [{...newOffer, id: uuidv4(), comments: [], create_time: Date.now()}, ...offerList.offer];
        localStorage.setItem('OFFERS', JSON.stringify(action.offer));
        dispatch(action);
    };
}

export function clearOffer() {
    const action: OfferAction = {
        type: ActionType.DELETE,
    };
    return (dispatch: OfferDispatchType) => {
        dispatch(action);
    };
}
