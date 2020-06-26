import { START_LOADING, STOP_LOADING } from '../actions/types';

const initialState = {
	loading: false
};

const commonReducer = (state, action) => {
	if(!state) {return initialState;}
	
	switch(action.type) {
		case START_LOADING:
			return {
				...state,
				loading: true
			};
		case STOP_LOADING:
			return {
				...state,
				loading: false
			};
		default:
			return state;
	}
};

export default commonReducer;