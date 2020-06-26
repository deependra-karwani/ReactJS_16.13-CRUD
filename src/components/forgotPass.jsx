import React from 'react';
import { connect } from 'react-redux';
import { startLoading, stopLoading } from '../actions/common';
import { emailRE, passwordRE } from '../config/RegEx';
import { forgotPasswordReq } from '../config/httpRoutes';
import { alertError, alertSuccess } from '../config/toaster';

class ForgotPassword extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			email: '',
			password: '',
			confPass: ''
		};
	}

	handleChange = ({target: { name, value }}) => {
		this.setState({[name]: value});
	}

	handleSubmit = () => {
		if(this.validate()) {
			this.props.startLoading();
			let { email, password } = this.state;
			forgotPasswordReq({email, password})
			.then( (res) => {
				alertSuccess(res.data.message || "Password Changed Successfully");
				this.setState({email: '', password: '', confPass: ''});
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
		let { email, password, confPass } = this.state;
		return emailRE.test(email) && passwordRE.test(password) && password === confPass;
	}

	render() {
		let { email, password, confPass } = this.state;
		return (
			<></>
		);
	}
}

const mapDispatchToProps = (dispatch) => ({
	startLoading: () => {dispatch(startLoading());},
	stopLoading: () => {dispatch(stopLoading());},
});

export default connect(null, mapDispatchToProps)(ForgotPassword);