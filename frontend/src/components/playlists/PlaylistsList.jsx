import React from 'react'
import { getUsers, getPlaylists, getAlbums } from '../../hooks/get.js';
import '../../styles/Lists.css';

import PlaylistCard from './PlaylistCard.jsx';

function PlaylistsList() {
	const users = getUsers();
	const playlists = getPlaylists();
	const albums = getAlbums();

	return (
		<>
			<ul className="list">
				{playlists.map(playlist => (
					<PlaylistCard
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
