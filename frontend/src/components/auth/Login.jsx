import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Login.css';

const Login = ({ onLogin }) => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const handleLogin = async (e) => {
		e.preventDefault();
		setError('');

		const formData = new URLSearchParams();
		formData.append('username', username);
		formData.append('password', password);

		try {
			const response = await fetch('/token', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: formData,
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.detail || 'Login failed');
			}

			const data = await response.json();
			onLogin(data.access_token);
			navigate('/profile');
		} catch (err) {
			setError(err.message);
		}
	};

	return (
		<div className="login-container">
			<h2>Login</h2>
			{error && <div className="error">{error}</div>}
			<form onSubmit={handleLogin}>
				<div className="form-gr">
					<label htmlFor="username">Username</label>
					<input
						type="text"
						id="username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required
					/>
				</div>
				<div className="form-gr">
					<label htmlFor="password">Password</label>
					<input
						type="password"
						id="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>
				<button type="submit" className="login-btn">Login</button>
			</form>
		</div>
	);
};

export default Login;
