import React from 'react'
import { getUsers, getTracks, getTrackById, getPlaylists, getPlaylistById, getPlaylistTracks, getArtists, getGenres, getAlbums } from '../hooks/get.js';
import './styles/Lists.css';

function ArtistsList() {
	const users = getUsers();
	const tracks = getTracks();
	const playlists = getPlaylists();
	const artists = getArtists();
	const genres = getGenres();
	const albums = getAlbums();

	return (
		<>
			<ul className="list">
				{artists.map(artist => (
					<a href={`artists/${artist.id}`}>
						<li key={artist.id}>
							{artist.name}
						</li>
					</a>
				))}
			</ul>
		</>
	);
}

export default ArtistsList;