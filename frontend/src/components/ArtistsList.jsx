import React from 'react'
import { Link } from 'react-router-dom';
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