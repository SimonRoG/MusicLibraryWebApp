import React from 'react'
import { getArtists, getAlbums } from '../hooks/get.js';
import AlbumCard from './AlbumCard.jsx';
import './styles/Lists.css';

function AlbumsList() {
	const artists = getArtists();
	const albums = getAlbums();

	return (
		<>
			<ul className="list">
				{albums.map(album => (
					<AlbumCard
						key={album.id}
						album={album}
						artist={artists.find(artist => artist.id === album.artist_id)}
					/>
				))}
			</ul>
		</>
	);
}

export default AlbumsList;