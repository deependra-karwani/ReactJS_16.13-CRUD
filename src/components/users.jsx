import React from 'react';
import { connect } from 'react-redux';
import { startLoading, stopLoading } from '../actions/common';
import { getAllUsersReq } from '../config/httpRoutes';
import { alertError, alertInfo } from '../config/toaster';

class Users extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			users: null
		};
	}

	componentDidMount() {
		this.props.startLoading();
		let { userid } = this.props;
		getAllUsersReq({userid})
		.then( (res) => {
			let { users, message } = res.data;
			message && alertInfo(message);
			this.setState({users});
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

	render() {
		let { users } = this.state;
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
});

export default connect(mapStateToProps, mapDispatchToProps)(Users);