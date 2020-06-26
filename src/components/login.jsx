import React from 'react';
import { connect } from 'react-redux';
import { startLoading, stopLoading } from '../actions/common';
import { login } from '../actions/session';
import { usernameRE, passwordRE } from '../config/RegEx';
import { loginReq } from '../config/httpRoutes';
import { saveToken } from '../config/localStorage';
import { alertError, alertSuccess } from '../config/toaster';

class Login extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			username: '',
			password: ''
		};
	}

	handleChange = ({target: { name, value }}) => {
		this.setState({[name]: value});
	}

	handleSubmit = () => {
		if(this.validate()) {
			this.props.startLoading();
			let { username, password } = this.state;
			loginReq({username, password})
			.then( (res) => {
				let { userid, message } = res.data;
				alertSuccess(message || "Login Successful");
				this.props.login({userid});
				saveToken(res.headers.token);
				this.props.history.push("/users");
			}).catch( (err) => {
				if(err.response) {
					alertError(err.response.data.message || "Unexpected Error has Occurred");
				} else {
					alertError("Server has Timed Out");
				}
			}).finally( () => {
				this.props.stopLoading();
			});;
		}
	}

	validate = () => {
		let { username, password } = this.state;
		return usernameRE.test(username) && passwordRE.test(password);
	}

	render() {
		let { username, password } = this.state;
		return (
			<></>
		);
	}
}

const mapDispatchToProps = (dispatch) => ({
	startLoading: () => {dispatch(startLoading());},
	stopLoading: () => {dispatch(stopLoading());},
	login: (data) => {dispatch(login(data));}
});

export default connect(null, mapDispatchToProps)(Login);