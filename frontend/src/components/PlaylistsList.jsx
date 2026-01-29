import React from 'react'
import { getUsers, getTracks, getTrackById, getPlaylists, getPlaylistById, getPlaylistTracks, getFirstPlaylistTrack, getArtists, getGenres, getAlbums } from '../hooks/get.js';
import './styles/Lists.css';

function PlaylistListItem({ playlist, albums, users }) {
	const firstTrack = getFirstPlaylistTrack(playlist.id);
	const album = firstTrack ? albums.find(album => album.id === firstTrack.album_id) : null;

	return (
		<a href={`playlists/${playlist.id}`}>
			<li>
				{album && (
					<img
						src={`/${album.cover_image}`}
						alt={album.title}
						height="20px"
						width="20px"
					/>
				)}
				{playlist.name}
			</li>
		</a>
	);
}

function PlaylistsList() {
	const users = getUsers();
	const tracks = getTracks();
	const playlists = getPlaylists();
	const artists = getArtists();
	const genres = getGenres();
	const albums = getAlbums();

	return (
		<>
			<ul className="list">
				{playlists.map(playlist => (
					<PlaylistListItem
						key={playlist.id}
						playlist={playlist}
						albums={albums}
						users={users}
					/>
				))}
			</ul>
		</>
	);
}

export default PlaylistsList;