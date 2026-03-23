import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Profile.css';

const Profile = ({ token, onLogout }) => {
	const [user, setUser] = useState(null);
	const [error, setError] = useState('');
	const navigate = useNavigate();

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await fetch('/api/users/me', {
					headers: {
						'Authorization': `Bearer ${token}`
					}
				});

				if (!response.ok) {
					if (response.status === 401) {
						onLogout();
						navigate('/login');
					}
					throw new Error('Failed to fetch user data');
				}

				const data = await response.json();
				setUser(data);
			} catch (err) {
				setError(err.message);
			}
		};

		fetchUser();
	}, [token, navigate, onLogout]);

	if (error) {
		return <div className="error-message">{error}</div>;
	}

	if (!user) {
		return <div>Loading...</div>;
	}

	const handleLogoutClick = () => {
		onLogout();
		navigate('/login');
	};

	return (
		<div className="profile-container">
			<h2>User Profile</h2>
			<div className="details">
				<p><strong>Username:</strong> {user.username}</p>
				<p><strong>Email:</strong> {user.email}</p>
				<p><strong>Joined:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
			</div>
			<button onClick={handleLogoutClick} className="logout-btn">Logout</button>
		</div>
	);
};

export default Profile;
