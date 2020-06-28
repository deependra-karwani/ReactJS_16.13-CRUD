import React from 'react';
import { connect } from 'react-redux';
import { startLoading, stopLoading } from '../actions/common';
import { login } from '../actions/session';
import { usernameRE, passwordRE } from '../config/RegEx';
import { loginReq } from '../config/httpRoutes';
import { saveToken } from '../config/localStorage';
import { alertError, alertSuccess } from '../config/toaster';
import { Row, Form, Col, Card, Button, Nav } from 'react-bootstrap';

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

	handleSubmit = (e) => {
		e.preventDefault();
		if(this.validate()) {
			this.props.startLoading();
			let { username, password } = this.state;
			loginReq({username, password})
			.then( (res) => {
				let { userid, message } = res.data;
				alertSuccess(message || "Login Successful");
				this.props.login({userid});
				saveToken(res.headers.token);
				this.setState({
					username: '',
					password: ''
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
			});;
		}
	}

	validate = () => {
		let { username, password } = this.state;
		return usernameRE.test(username) && passwordRE.test(password);
	}

	render() {
		let { handleChange, handleSubmit, validate, state: { username, password } } = this;
		return (
			<Row style={{marginLeft: 0, marginRight: 0}}>
				<Col md={{span: 4, offset: 4}} lg={{span: 4, offset: 4}} xs={12}>
					<Card style={{marginTop: '20%'}}>
						<Card.Header>
							<Card.Title style={{textAlign: 'center'}}>Login</Card.Title>
						</Card.Header>
						<Card.Body>
							<Form onSubmit={handleSubmit}>
								<Form.Group>
									<Form.Label>Username</Form.Label>
									<Form.Control value={username} onChange={handleChange} name="username" type="text" placeholder="Username" />
								</Form.Group>

								<Form.Group>
									<Form.Label>Password</Form.Label>
									<Form.Control value={password} onChange={handleChange} name="password" type="password" placeholder="Password" />
								</Form.Group>

								<Form.Group>
									<Button variant="primary" type="submit" style={{marginLeft: '30%', width: '40%'}} size="lg" disabled={!validate()}>
										Login
									</Button>
								</Form.Group>
							</Form>
						</Card.Body>
						<Card.Footer>
							<small><Nav.Link href="/register">CREATE NEW ACCOUNT</Nav.Link></small>
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

export default connect(null, mapDispatchToProps)(Login);