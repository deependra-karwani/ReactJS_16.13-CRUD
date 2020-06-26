import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isLoggedIn } from '../config/localStorage';

const UnauthRoute = ({component: Component, ...rest}) => {
	return (
		<Route {...rest} render={props => (
			isLoggedIn() ?
				<Redirect to="/users" />
			:
				<Component {...props} />
		)} />
	);
};

export default UnauthRoute;