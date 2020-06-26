import { LOGIN, LOGOUT } from '../actions/types';

const initialState = {
	userid: undefined
};

const sessionReducer = (state, action) => {
	if(!state) {return initialState;}
	
	switch(action.type) {
		case LOGIN:
			return {
				...state,
				...action.data
			};
		case LOGOUT:
			return {
				...state,
				userid: undefined
			};
		default:
			return state;
	}
};

export default sessionReducer;