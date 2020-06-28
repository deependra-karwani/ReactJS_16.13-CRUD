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
import { Container, Spinner, Modal } from 'react-bootstrap';

import { connect } from 'react-redux';

class AppRouter extends Component {
	render() {
		return (
			<Container fluid={true}>
				<Modal show={this.props.loading} centered size="sm">
					<Modal.Dialog style={{backgroundColor: 'transparent', border: 'none'}}>
						<Spinner animation="border" />
					</Modal.Dialog>
				</Modal>
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
			</Container>
		);
	}
}

const mapStateToProps = (state) => ({
	loading: state.common.loading
});

export default connect(mapStateToProps)(AppRouter);