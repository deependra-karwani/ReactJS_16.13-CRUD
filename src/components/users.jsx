import React from 'react';
import { connect } from 'react-redux';
import { startLoading, stopLoading } from '../actions/common';
import { getAllUsersReq } from '../config/httpRoutes';
import { alertError, alertInfo } from '../config/toaster';
import { Row, Col, Card, Image } from 'react-bootstrap';
import LazyLoad from 'react-lazyload';
const defImg = require('../assets/noImage.png');

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

	navigateDetails = (userid) => {
		this.props.history.push("/details/"+userid);
	}

	render() {
		let { users } = this.state;
		return (
			<Row style={{marginLeft: 0, marginRight: 0, paddingLeft: '10%', paddingRight: '10%', paddingTop: '5%'}}>
				{Array.isArray(users) ?
					users.length > 0 ?
						users.map( (user, i) =>
							<LazyLoad key={i}>
								<Col md={6} lg={6} xs={12} key={i} style={{marginBottom: 15}}>
									<Card style={{padding: 30, cursor: 'pointer'}} onClick={() => this.navigateDetails(user.id)}>
										<Row style={{marginLeft: 0, marginRight: 0}}>
											<Col md={4} xs={4} lg={4}>
												<Image fluid roundedCircle src={user.profpic || defImg} />
											</Col>
											<Col md={8} xs={8} lg={8}>
												<p style={{fontWeight: 'bold', fontSize: 18}}>{user.username}</p>
												<p style={{color: 'gray', fontSize: 16}}>{user.name}</p>
											</Col>
										</Row>
									</Card>
								</Col>
							</LazyLoad>
						)
					:
						<p style={{position: 'fixed', marginLeft: '40%', marginTop: '20%'}}>No other users have registered yet.</p>
				:
					<></>
				}
			</Row>
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