import axios from './interceptor';

const baseUrl = "http://localhost:3600/user/";
// const baseUrl = "http://localhost:8080/user/";

export const registerReq = (formData) => {
	return axios.put(baseUrl+'register', formData);
};

export const loginReq = (data) => {
	return axios.put(baseUrl+'login', data);
};

export const forgotPasswordReq = (data) => {
	return axios.put(baseUrl+'forgot', data);
};

export const logoutReq = (token) => {
	return axios.get(baseUrl+'logout', {headers: {token}});
};

export const getAllUsersReq = (data) => {
	return axios.get(baseUrl+'getAll', {params: data});
};

export const getUserDetailsReq = (data) => {
	return axios.get(baseUrl+'getDetails', {params: data});
};

export const updateProfileReq = (data) => {
	return axios.put(baseUrl+'updProf', data);
};

export const deleteAccountReq = (data) => {
	return axios.delete(baseUrl+'delAcc', {data});
};

export const refreshTokenReq = (token) => {
	return axios.get(baseUrl+'refresh', {headers: {token}});
};