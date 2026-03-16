import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { getArtists } from '../hooks/get.js';
import './styles/Lists.css';

function ArtistsList() {
	const artists = getArtists();
	const navigate = useNavigate();

	return (
		<>
			<ul className="list">
				{artists.map(artist => (
					<li key={artist.id} onClick={() => navigate(`/artists/${artist.id}`)} style={{ cursor: 'pointer' }}>
						<div className="info">
							<img src="" alt="" />
							<div className="details">
								<span className="title">{artist.name}</span>
							</div>
						</div>
					</li>
				))}
			</ul>
		</>
	);
}

export default ArtistsList;