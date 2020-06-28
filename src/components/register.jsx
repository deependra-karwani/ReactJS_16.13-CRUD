import React from 'react';
import { connect } from 'react-redux';
import { startLoading, stopLoading } from '../actions/common';
import { login } from '../actions/session';
import { nameRE, emailRE, mobileRE, usernameRE, passwordRE } from '../config/RegEx';
import { registerReq } from '../config/httpRoutes';
import { saveToken } from '../config/localStorage';
import { alertError, alertSuccess } from '../config/toaster';
import { Row, Form, Col, Card, Button, Nav, Image } from 'react-bootstrap';
const defImg = require('../assets/defImg.png');

class Register extends React.Component {
	constructor(props) {
		super(props);

		this.imgInputRef = React.createRef();

		this.state = {
			name: '',
			email: '',
			mobile: '',
			username: '',
			password: '',
			confPass: '',
			prof: null
		};
	}

	handleChange = ({target: { name, value }}) => {
		this.setState({[name]: value});
	}

	handleFile = ({ target: { files } }) => {
		this.setState({prof: files[0]});
	}

	handleSubmit = (e) => {
		e.preventDefault();
		if(this.validate()) {
			this.props.startLoading();
			let { name, email, mobile, username, password, prof } = this.state;
			let formData = new FormData();
			formData.append('name', name);
			formData.append('email', email);
			formData.append('mobile', mobile);
			formData.append('username', username);
			formData.append('password', password);
			formData.append('prof', prof);
			registerReq(formData)
			.then( (res) => {
				let { userid, message } = res.data;
				alertSuccess(message || "Registration Successful");
				this.props.login({userid});
				saveToken(res.headers.token);
				this.setState({
					name: '',
					email: '',
					mobile: '',
					username: '',
					password: '',
					confPass: '',
					prof: null
				});
				this.props.history.push("/users");
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

	validate = () => {
		let { name, email, mobile, username, password, confPass } = this.state;
		return nameRE.test(name) && emailRE.test(email) && mobileRE.test(mobile) && usernameRE.test(username) && passwordRE.test(password) && password === confPass;
	}

	render() {
		let { handleSubmit, handleChange, handleFile, validate, imgInputRef, state: { name, email, mobile, username, password, confPass, prof } } = this;
		return (
			<Row style={{marginLeft: 0, marginRight: 0}}>
				<Col md={{span: 4, offset: 4}} lg={{span: 4, offset: 4}} xs={12}>
					<Card style={{marginTop: '5%'}}>
						<Card.Header>
							<Card.Title style={{textAlign: 'center', fontWeight: "bold"}}>Create Account</Card.Title>
						</Card.Header>
						<Card.Body>
							<Form onSubmit={handleSubmit}>
								<Form.Group>
									<Form.Control onChange={handleFile} type="file" style={{display: 'none'}} ref={imgInputRef} />
									{prof ?
										<Image fluid roundedCircle style={{marginLeft: '25%', width: '50%', height: 150, cursor: 'pointer'}} onClick={() => {imgInputRef.current.click()}} src={URL.createObjectURL(prof)} />
									:
										<Image fluid rounded style={{marginLeft: '25%', width: '50%', height: 150, cursor: 'pointer'}} onClick={() => {imgInputRef.current.click()}} src={defImg} />
									}
								</Form.Group>

								<Form.Group>
									<Form.Control name="name" value={name} onChange={handleChange} type="text" placeholder="Name" />
								</Form.Group>

								<Form.Group>
									<Form.Control name="email" value={email} onChange={handleChange} type="email" placeholder="E-mail Address" />
								</Form.Group>

								<Form.Group>
									<Form.Control name="mobile" value={mobile} onChange={handleChange} type="text" placeholder="Contact Number" />
								</Form.Group>

								<Form.Group>
									<Form.Control name="username" value={username} onChange={handleChange} type="text" placeholder="Username" />
								</Form.Group>

								<Form.Group>
									<Form.Control name="password" value={password} onChange={handleChange} type="password" placeholder="Password" />
								</Form.Group>

								<Form.Group>
									<Form.Control name="confPass" value={confPass} onChange={handleChange} type="password" placeholder="Confirm Password" />
								</Form.Group>

								<Form.Group>
									<Button variant="primary" type="submit" style={{width: '100%'}} disabled={!validate()}>
										Sign Up
									</Button>
								</Form.Group>
							</Form>
						</Card.Body>
						<Card.Footer>
							<small>
								<Nav.Item>
									Already have an Account? <Nav.Link style={{display: 'initial', padding: 0}} href="/login">Login</Nav.Link>
								</Nav.Item>
							</small>
						</Card.Footer>
					</Card>
				</Col>
			</Row>
		);
	}
}

const mapDispatchToProps = (dispatch) => ({
	startLoading: () => {dispatch(startLoading());},
	stopLoading: () => {dispatch(stopLoading());},
	login: (data) => {dispatch(login(data));}
});

export default connect(null, mapDispatchToProps)(Register);