import React from 'react';
import { connect } from 'react-redux';
import { startLoading, stopLoading } from '../actions/common';
import { getUserDetailsReq, updateProfileReq, deleteAccountReq, logoutReq } from '../config/httpRoutes';
import { alertError, alertInfo, alertSuccess } from '../config/toaster';
import { nameRE, mobileRE, usernameRE } from '../config/RegEx';
import { logout } from '../actions/session';
import { removeToken } from '../config/localStorage';
import { Row, Col, Card, Image, Form, Button } from 'react-bootstrap';
const defImg = require('../assets/noImage.png');

class UserDetails extends React.Component {
	constructor(props) {
		super(props);

		if(!this.props.match.params.userid) {
			this.props.history.goBack();
		}

		this.imgInputRef = React.createRef();

		this.state = {
			profpic: '',
			name: '',
			username: '',
			email: '',
			mobile: '',
			isUser: false,
			prof: null
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
		this.setState({profpic: URL.createObjectURL(files[0]), prof: files[0]});
	}

	validate = () => {
		let { name, mobile, username } = this.state;
		return nameRE.test(name) && mobileRE.test(mobile) && usernameRE.test(username) && this.props.userid === this.props.match.params.userid;
	}

	handleSubmit = (e) => {
		e.preventDefault();
		if(this.validate()) {
			this.props.startLoading();
			let { name, username, mobile, prof } = this.state;
			let { userid } = this.props;
			let formData = new FormData();
			formData.append('name', name);
			formData.append('username', username);
			formData.append('mobile', mobile);
			formData.append('userid', userid);
			if(prof) {
				formData.append('prof', prof);
			}
			updateProfileReq(formData)
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
		if(this.props.userid === this.props.match.params.userid && window.confirm("Are you sure you want to logout?")) {
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
		let { handleSubmit, handleChange, validate, handleFile, delProf, logout, imgInputRef, state: { profpic, name, username, email, mobile, isUser, prof } } = this;
		return (
			<Row style={{marginLeft: 0, marginRight: 0}}>
				<Col md={{span: 7, offset: 2}} lg={{span: 8, offset: 2}} xs={12}>
					<Card style={{marginTop: '10%'}}>
						<Card.Body>
							{isUser ?
								<Form onSubmit={handleSubmit}>
									<Row style={{marginLeft: 0, marginRight: 0}}>
										<Col>
											<Form.Group>
												<Form.Control type="file" style={{display: 'none'}} ref={imgInputRef} onChange={handleFile} />
												<Image fluid rounded onClick={() => {imgInputRef.current.click()}} src={prof || defImg} style={{cursor: 'pointer'}} />
											</Form.Group>
										</Col>

										<Col style={{marginLeft: '10%', paddingTop: '10%'}}>
											<Form.Group>
												<Form.Control value={name} onChange={handleChange} name="name" type="text" placeholder="Name" />
											</Form.Group>
											<Form.Group>
												<Form.Control value={username} onChange={handleChange} name="username"type="text" placeholder="Username" />
											</Form.Group>
											<Form.Group>
												<Form.Control value={email} onChange={handleChange} name="email" type="email" placeholder="Email" />
											</Form.Group>
											<Form.Group>
												<Form.Control value={mobile} onChange={handleChange} name="mobile" type="text" placeholder="Mobile Number" />
											</Form.Group>
											<Form.Group>
												<Button variant="primary" type="submit" style={{width: '100%'}} disabled={!validate()}>
													Save Changes
												</Button>
											</Form.Group>
											<Form.Group>
												<Button variant="info" type="submit" style={{width: '45%', color: 'white'}} onClick={logout}>
													Logout
												</Button>
												<Button variant="outline-danger" type="submit" style={{width: '45%', marginLeft: '10%'}} onClick={delProf}>
													Delete Profile
												</Button>
											</Form.Group>
										</Col>
									</Row>
								</Form>
							:
								<Row style={{marginLeft: 0, marginRight: 0}}>
									<Col>
										<Image fluid rounded src={profpic || defImg} />
									</Col>

									<Col style={{marginLeft: '10%'}}>
										<p style={{fontWeight: 'bolder', fontSize: 55}}>{name}</p>
										<p style={{color: 'gray', fontSize: 22, marginTop: '10%'}}>{username}</p>
										<p style={{color: 'gray', fontSize: 22}}>{email}</p>
										<p style={{color: 'gray', fontSize: 22}}>{mobile || ''}</p>
									</Col>
								</Row>
							}
						</Card.Body>
					</Card>
				</Col>
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
	logout: () => {dispatch(logout());}
});

export default connect(mapStateToProps, mapDispatchToProps)(UserDetails);