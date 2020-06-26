import axios from 'axios';
import store from './store';
import { refreshTokenReq, logoutReq } from '../config/httpRoutes';
import { removeToken, saveToken, getToken } from './localStorage';
import { logout } from '../actions/session';


var axiosInstance = axios.create();
axiosInstance.defaults.timeout = 30000;

let isAlreadyFetchingAccessToken = false;
let subscribers = [];

function onAccessTokenFetched(token) {
	subscribers = subscribers.filter(callback => callback(token));
}

function addSubscriber(callback) {
	subscribers.push(callback);
}

axiosInstance.interceptors.request.use(function (config) {
	const token = getToken();

	if(token) {
		config.headers['token'] = token;
	}
	return config;
});

axiosInstance.interceptors.response.use(function (response) {
	return response;
}, function (error) {
	const { config, response: { status } } = error;
	const originalRequest = config;

	if (config.headers['token'] && status === 401) {
		let token = config.headers['token'];
		if (!isAlreadyFetchingAccessToken) {
			isAlreadyFetchingAccessToken = true;

			refreshTokenReq(token).then((res) => {
				isAlreadyFetchingAccessToken = false;
				saveToken(res.headers.token);
				onAccessTokenFetched(res.headers.token);
			}).catch( async (err) => {
				await logoutReq(token);
				store.dispatch(logout());
				removeToken();
				return Promise.reject(err);
			}).catch( (err) => {
				return Promise.reject(err);
			});
		}

		const retryOriginalRequest = new Promise((resolve, reject) => {
			addSubscriber(token => {
				originalRequest.headers.token = token;
				resolve(axios(originalRequest));
			});
		});

		return retryOriginalRequest;
	} else {
		return Promise.reject(error);
	}
});

export default axiosInstance;
