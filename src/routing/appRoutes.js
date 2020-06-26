import React, { Component } from 'react';

import Register from '../components/register';
import Login from '../components/login';
import ForgotPassword from '../components/forgotPass';
import Users from '../components/users';
import UserDetails from '../components/userDetails';

import { Router, /* Route, */ Redirect, Switch } from 'react-router-dom';
import history from '../config/history';
import UnauthRoute from './unauthRoute';
import AuthRoute from './authRoute';

class AppRouter extends Component {
	render() {
		return (
			<div className="container-fluid">
				<Router history={history}>
					<Switch>
						<Redirect exact from="/" to="/login" />
			
						<UnauthRoute exact path="/register" component={Register} />
						<UnauthRoute exact path="/login" component={Login} />
						<UnauthRoute exact path="/forgot" component={ForgotPassword} />

						<AuthRoute exact path="/users" component={Users} />
						<AuthRoute exact path="/details/:userid" component={UserDetails} />

						<Redirect from="*" to="/login" />
					</Switch>
				</Router>
			</div>
		);
	}
}

export default AppRouter;