import {combineReducers} from 'redux';
import auth from './auth/auth.reducer';
import offer from './offer/offer.reducer';
export default combineReducers({
    auth,
    offer,
});
