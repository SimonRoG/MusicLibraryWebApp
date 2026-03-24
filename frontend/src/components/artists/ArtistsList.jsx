import React from 'react'
import { getArtists } from '../../hooks/get.js';
import ArtistCard from './ArtistCard.jsx';
import '../../styles/Lists.css';

function ArtistsList() {
	const artists = getArtists();

	return (
		<>
			<ul className="list">
				{artists.map(artist => (
					<ArtistCard key={artist.id} artist={artist} />
				))}
			</ul>
		</>
	);
}

export default ArtistsList;