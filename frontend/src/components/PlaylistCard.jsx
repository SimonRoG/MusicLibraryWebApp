import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirstPlaylistTrack } from '../hooks/get.js';

function PlaylistCard({ playlist, albums, users }) {
	const firstTrack = getFirstPlaylistTrack(playlist.id);
	const album = firstTrack ? albums.find(album => album.id === firstTrack.album_id) : null;
	const navigate = useNavigate();

	return (
		<li onClick={() => navigate(`/playlists/${playlist.id}`)} style={{ cursor: 'pointer' }}>
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
	);
}

export default PlaylistCard;
