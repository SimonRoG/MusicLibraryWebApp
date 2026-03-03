import React from 'react'
import { Link } from 'react-router-dom';
import { getUsers, getPlaylists, getFirstPlaylistTrack, getAlbums } from '../hooks/get.js';
import './styles/Lists.css';

function PlaylistListItem({ playlist, albums, users }) {
	const firstTrack = getFirstPlaylistTrack(playlist.id);
	const album = firstTrack ? albums.find(album => album.id === firstTrack.album_id) : null;

	return (
		<Link to={`/playlists/${playlist.id}`}>
			<li>
				<div className="info">
					{album && (
						<img
							src={`/${album.cover_image}`}
							alt={album.title}
						/>
					)}
					<div className="details">
						<span className="title">{playlist.name}</span>
						<span className="artist">
							{playlist.user_id === 1 ? "MusLi" : users.find(user => user.id === playlist.user_id)?.username}
						</span>
					</div>
				</div>
			</li>
		</Link>
	);
}

function PlaylistsList() {
	const users = getUsers();
	const playlists = getPlaylists();
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