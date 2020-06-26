import React from 'react';
import { connect } from 'react-redux';
import { startLoading, stopLoading } from '../actions/common';
import { getUserDetailsReq, updateProfileReq, deleteAccountReq, logoutReq } from '../config/httpRoutes';
import { alertError, alertInfo, alertSuccess } from '../config/toaster';
import { nameRE, mobileRE, usernameRE } from '../config/RegEx';
import { logout } from '../actions/session';
import { removeToken } from '../config/localStorage';

class UserDetails extends React.Component {
	constructor(props) {
		super(props);

		if(!this.props.match.params.userid) {
			this.props.history.goBack();
		}

		this.state = {
			profpic: '',
			name: '',
			username: '',
			email: '',
			mobile: '',
			isUser: false
		};
	}

	componentDidMount() {
		this.props.startLoading();
		let { userid } = this.props.match.params;
		let isUser = this.props.userid === this.props.match.params.userid;
		getUserDetailsReq({userid})
		.then( (res) => {
			let { user, message } = res.data;
			message && alertInfo(message);
			this.setState({...user, isUser});
		}).catch( (err) => {
			if(err.response) {
				alertError(err.response.data.message || "Unexpected Error has Occurred");
			} else {
				alertError("Server has Timed Out");
			}
		}).finally( () => {
			this.props.stopLoading();
		});
	}

	handleChange = ({target: { name, value }}) => {
		this.setState({[name]: value});
	}

	handleFile = ({ target: { files } }) => {
		this.setState({profpic: files[0]});
	}

	validate = () => {
		let { name, mobile, username } = this.state;
		return nameRE.test(name) && mobileRE.test(mobile) && usernameRE.test(username) && this.props.userid === this.props.match.params.userid;
	}

	handleSubmit = () => {
		if(this.validate()) {
			this.props.startLoading();
			let { name, username, mobile } = this.state;
			let { userid } = this.props;
			updateProfileReq({name, username, mobile, userid})
			.then( (res) => {
				alertSuccess(res.data.message || "Profile Updated Successfully");
			}).catch( (err) => {
				if(err.response) {
					alertError(err.response.data.message || "Unexpected Error has Occurred");
				} else {
					alertError("Server has Timed Out");
				}
			}).finally( () => {
				this.props.stopLoading();
			});
		}
	}

	delProf = () => {
		if(this.props.userid === this.props.match.params.userid && window.confirm("Are you sure? This action is irreversible")) {
			this.props.startLoading();
			let { userid } = this.props;
			deleteAccountReq({userid})
			.then( (res) => {
				alertSuccess(res.data.message || "Account Removed Successfully");
				this.props.logout();
				removeToken();
				this.props.history.push("/register");
			}).catch( (err) => {
				if(err.response) {
					alertError(err.response.data.message || "Unexpected Error has Occurred");
				} else {
					alertError("Server has Timed Out");
				}
			}).finally( () => {
				this.props.stopLoading();
			});
		}
	}

	logout = () => {
		if(this.props.userid === this.props.match.params.userid) {
			this.props.startLoading();
			let { userid } = this.props;
			logoutReq({userid})
			.then( (res) => {
				alertSuccess(res.data.message || "Logout Successful");
				this.props.logout();
				removeToken();
				this.props.history.push("/login");
			}).catch( (err) => {
				if(err.response) {
					alertError(err.response.data.message || "Unexpected Error has Occurred");
				} else {
					alertError("Server has Timed Out");
				}
			}).finally( () => {
				this.props.stopLoading();
			});
		}
	}

	render() {
		let { profpic, name, username, email, mobile, isUser } = this.state;
		return (
			<></>
		);
	}
}

const mapStateToProps = (state) => ({
	userid: state.session.userid
});

const mapDispatchToProps = (dispatch) => ({
	startLoading: () => {dispatch(startLoading());},
	stopLoading: () => {dispatch(stopLoading());},
	logout: () => {dispatch(logout());}
});

export default connect(mapStateToProps, mapDispatchToProps)(UserDetails);