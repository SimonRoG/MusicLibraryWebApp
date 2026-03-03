import React from 'react'
import { Link } from 'react-router-dom';
import { getArtists } from '../hooks/get.js';
import './styles/Lists.css';

function ArtistsList() {
	const artists = getArtists();

	return (
		<>
			<ul className="list">
				{artists.map(artist => (
					<Link to={`/artists/${artist.id}`} key={artist.id}>
						<li>
							<div className="info">
								<img src="" alt="" />
								<div className="details">
									<span className="title">{artist.name}</span>
								</div>
							</div>
						</li>
					</Link>
				))}
			</ul>
		</>
	);
}

export default ArtistsList;