import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/Login.css';

const Register = ({ onLogin }) => {
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [error, setError] = useState('');
	const [submitting, setSubmitting] = useState(false);
	const navigate = useNavigate();

	const handleRegister = async (e) => {
		e.preventDefault();
		setError('');

		if (password !== confirmPassword) {
			setError('Passwords do not match');
			return;
		}

		setSubmitting(true);

		try {
			const registerResponse = await fetch('/api/users', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					username,
					email,
					password,
				}),
			});

			if (!registerResponse.ok) {
				const data = await registerResponse.json();
				throw new Error(data.detail || 'Registration failed');
			}

			const formData = new URLSearchParams();
			formData.append('username', username);
			formData.append('password', password);

			const loginResponse = await fetch('/token', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: formData,
			});

			if (!loginResponse.ok) {
				const data = await loginResponse.json();
				throw new Error(data.detail || 'Registration succeeded, but login failed');
			}

			const data = await loginResponse.json();
			onLogin(data.access_token);
			navigate('/profile');
		} catch (err) {
			setError(err.message);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<div className="login-container">
			<h2>Register</h2>
			{error && <div className="error">{error}</div>}
			<form onSubmit={handleRegister}>
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
					<label htmlFor="email">Email</label>
					<input
						type="email"
						id="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
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
				<div className="form-gr">
					<label htmlFor="confirmPassword">Confirm password</label>
					<input
						type="password"
						id="confirmPassword"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
					/>
				</div>
				<button type="submit" className="login-btn" disabled={submitting}>
					{submitting ? 'Registering...' : 'Register'}
				</button>
			</form>
			<p className="auth-switch">
				Already have an account? <Link to="/login">Login</Link>
			</p>
		</div>
	);
};

export default Register;