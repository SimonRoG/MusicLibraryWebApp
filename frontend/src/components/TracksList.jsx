import React from 'react'
import { getUsers, getTracks, getTrackById, getPlaylists, getPlaylistById, getPlaylistTracks, getArtists, getGenres, getAlbums } from '../hooks/get.js';
import './styles/Lists.css';

function TracksList() {
	const users = getUsers();
	const tracks = getTracks();
	const playlists = getPlaylists();
	const artists = getArtists();
	const genres = getGenres();
	const albums = getAlbums();

	return (
		<>
			<ul className="list">
				{tracks.map(track => (
					<a href={`/${track.audio_file}`}>
						<li key={track.id}>
							<img
								src={`/${albums.find(album => album.id === track.album_id)?.cover_image}`}
								alt={`/${albums.find(album => album.id === track.album_id)?.title}`}
								height="20px"
								width="20px" />
							{track.title}
							<span className="dash"> - </span>
							<a href="/api/artists">
								{artists.find(artist => artist.id === track.artist_id)?.name}
							</a>
						</li>
					</a>
				))}
			</ul>
		</>
	);
}

export default TracksList;