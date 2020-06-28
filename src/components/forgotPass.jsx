import React from 'react';
import { connect } from 'react-redux';
import { startLoading, stopLoading } from '../actions/common';
import { emailRE, passwordRE } from '../config/RegEx';
import { forgotPasswordReq } from '../config/httpRoutes';
import { alertError, alertSuccess } from '../config/toaster';
import { Row, Form, Col, Card, Button } from 'react-bootstrap';

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

	handleSubmit = (e) => {
		e.preventDefault();
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
		let { handleSubmit, handleChange, validate, state: { email, password, confPass } } = this;
		return (
			<Row style={{marginLeft: 0, marginRight: 0}}>
				<Col md={{span: 4, offset: 4}} lg={{span: 4, offset: 4}} xs={12}>
					<Card style={{marginTop: '25%'}}>
						<Card.Header>
							<Card.Title style={{textAlign: 'center', fontWeight: "bold"}}>Change Password</Card.Title>
						</Card.Header>
						<Card.Body>
							<Form onSubmit={handleSubmit}>
								<Form.Group>
									<Form.Control name="email" value={email} onChange={handleChange} type="email" placeholder="E-mail Address" />
								</Form.Group>

								<Form.Group>
									<Form.Control name="password" value={password} onChange={handleChange} type="password" placeholder="Password" />
								</Form.Group>

								<Form.Group>
									<Form.Control name="confPass" value={confPass} onChange={handleChange} type="password" placeholder="Confirm Password" />
								</Form.Group>

								<Form.Group>
									<Button variant="primary" type="submit" style={{width: '100%'}} disabled={!validate()}>
										Change Password
									</Button>
								</Form.Group>
							</Form>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		);
	}
}

const mapDispatchToProps = (dispatch) => ({
	startLoading: () => {dispatch(startLoading());},
	stopLoading: () => {dispatch(stopLoading());},
});

export default connect(null, mapDispatchToProps)(ForgotPassword);