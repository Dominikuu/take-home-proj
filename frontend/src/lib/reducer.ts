import { combineReducers } from "redux";
import auth from "./auth/auth.reducer";
import viewHistory from "./viewHistory/viewHistory.reducer"
export default combineReducers({
  auth,
  viewHistory
});
