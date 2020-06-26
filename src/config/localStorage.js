export const saveToken = (token) => {
	localStorage.setItem('unsafe', token);
}

export const getToken = () => {
	return localStorage.getItem('unsafe');
}

export const removeToken = () => {
	localStorage.removeItem('unsafe');
}

export const isLoggedIn = () => {
	return Boolean(localStorage.getItem('unsafe'));
}