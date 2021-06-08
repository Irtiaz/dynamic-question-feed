import React from 'react';
import Head from 'next/head';
import Router from 'next/router';

import validateToken from '../../lib/validateToken.js';

import styles from '../../styles/AdminLogin.module.css';

export default class AdminLogin extends React.Component {

	state = {
		validated: undefined
	};

	handleSubmit = async (event) => {
		event.preventDefault();
		const data = {
			password: event.target.password.value
		};
		const options = {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		};
		const response = await fetch('/api/admin/login' ,options);
		const token = await response.text();
		localStorage.setItem('adminToken', token);

		const validated = await validateToken(token);

		if (validated) Router.replace('/admin/feed');
		else {
			this.setState({
				validated
			});
		}
	}

	handleChange = () => {
		this.setState({
			validated: undefined
		});
	}

	render() {

		let Feedback = null;
		if (this.state.validated != undefined) {
			Feedback = <div className={styles.wrong_password}>
				Wrong Password!
			</div>;
		}

		return (
			<>
				<Head>
					<title>Admin Login</title>
				</Head>
						<form className={styles.form} onSubmit={this.handleSubmit} >
							<input name="password" type="password" placeholder="Password" onChange={this.handleChange} />
							<br />
							<button type="submit">Login</button>
							{Feedback}
						</form>
			</>
		);
	}
}
