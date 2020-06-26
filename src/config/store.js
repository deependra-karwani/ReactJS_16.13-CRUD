import { createStore } from 'redux';
import rootReducer from '../reducers';

const persistedState = localStorage.getItem('persist') ? JSON.parse(localStorage.getItem('persist')) : {};

const store = createStore(rootReducer, persistedState);
store.subscribe(() => {
	localStorage.setItem('persist', JSON.stringify(store.getState()));
});

export default store;