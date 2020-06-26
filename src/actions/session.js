import { LOGIN, LOGOUT } from './types';

export const login = (data) => ({
	type: LOGIN,
	data
});

export const logout = () => ({
	type: LOGOUT
});