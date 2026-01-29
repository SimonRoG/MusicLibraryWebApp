import React from 'react';
import { Link } from 'react-router-dom';
import './styles/Navbar.css';

const Navbar = () => {
	return (
		<nav>
			<div className="brand"><Link to="/">MusLi</Link></div>
			<ul>
				<li><Link to="/">Home</Link></li>
				<li><Link to="/playlists">Playlists</Link></li>
				<li><Link to="/albums">Albums</Link></li>
				<li><Link to="/artists">Artists</Link></li>
			</ul>
		</nav>
	);
};

export default Navbar;