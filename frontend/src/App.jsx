import React from 'react'
import './App.css'
import {getUsers, getTracks, getTrackById, getPlaylists, getPlaylistById, getPlaylistTracks, getArtists, getGenres, getAlbums} from './hooks/get.js';

function App() {
	const users = getUsers();
	const tracks = getTracks();
	const playlists = getPlaylists();
	const artists = getArtists();
	const genres = getGenres();
	const albums = getAlbums();

	return (
		<>
			<ul>{tracks.map(track => (
				<li key={track.id}>{track.title} - {artists.find(artist => artist.id === track.artist_id)?.name} - {albums.find(album => album.id === track.album_id)?.title} - {genres.find(genre => genre.id === track.genre_id)?.name}</li>
			))}</ul>
		</>
	)
}

export default App
