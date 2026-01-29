import React from 'react'
import { getUsers, getTracks, getTrackById, getPlaylists, getPlaylistById, getPlaylistTracks, getArtists, getGenres, getAlbums } from '../hooks/get.js';
import './styles/Lists.css';

function AlbumsList() {
	const users = getUsers();
	const tracks = getTracks();
	const playlists = getPlaylists();
	const artists = getArtists();
	const genres = getGenres();
	const albums = getAlbums();

	return (
		<>
			<ul className="list">
				{albums.map(album => (
					<a href={`albums/${album.id}`}>
						<li key={album.id}>
							<img
								src={`/${album.cover_image}`}
								alt={album.title}
								height="20px"
								width="20px" />
							{album.title}
							<span className="dash"> - </span>
							<a href={`/artists/${album.artist_id}`}>
								{artists.find(artist => artist.id === album.artist_id)?.name}
							</a>
						</li>
					</a>
				))}
			</ul>
		</>
	);
}

export default AlbumsList;