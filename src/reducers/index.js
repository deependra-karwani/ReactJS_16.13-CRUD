import { combineReducers } from 'redux';
import session from "./session";
import common from "./common";

export default combineReducers({
	session,
	common
});