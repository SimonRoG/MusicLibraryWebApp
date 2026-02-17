import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import Navbar from './components/NavBar.jsx';
import SearchTracks from './components/SearchTracks.jsx';
import PlaylistsList from './components/PlaylistsList.jsx';
import Playlist from './components/Playlist.jsx';
import AlbumsList from './components/AlbumsList.jsx';
import Album from './components/Album.jsx';
import ArtistsList from './components/ArtistsList.jsx';
import Player from './components/Player.jsx';
import Login from './components/Login.jsx';
import Profile from './components/Profile.jsx';
import { fetchTracksData } from './hooks/get.js';

function App() {
	const [queue, setQueue] = useState([]);
	const [currentTrackIndex, setCurrentTrackIndex] = useState(-1);
	const [contextParams, setContextParams] = useState(null);
	const [token, setToken] = useState(localStorage.getItem('token') || null);

	const handleLogin = (newToken) => {
		localStorage.setItem('token', newToken);
		setToken(newToken);
	};

	const handleLogout = () => {
		localStorage.removeItem('token');
		setToken(null);
	};

	const handlePlay = (track, tracks, params) => {
		setQueue(tracks);
		setContextParams(params);
		setCurrentTrackIndex(tracks.findIndex(t => t.id === track.id));
	};

	const handleNext = async () => {
		if (currentTrackIndex < queue.length - 1) {
			setCurrentTrackIndex(currentTrackIndex + 1);
		} else {
			if (contextParams) {
				const newTracks = await fetchTracksData({ ...contextParams, offset: queue.length, limit: 10 });
				if (newTracks && newTracks.length > 0) {
					setQueue(prev => [...prev, ...newTracks]);
					setCurrentTrackIndex(currentTrackIndex + 1);
				} else {
					setCurrentTrackIndex(0);
				}
			} else {
				setCurrentTrackIndex(0);
			}
		}
	};

	const handlePrev = () => {
		if (currentTrackIndex > 0) {
			setCurrentTrackIndex(currentTrackIndex - 1);
		}
	};

	const currentTrack = currentTrackIndex >= 0 && currentTrackIndex < queue.length ? queue[currentTrackIndex] : null;

	return (
		<>
			<Navbar token={token} />
			<Routes>
				<Route path="/" element={<Navigate to="/tracks" />} />
				<Route path="/tracks" element={<SearchTracks onPlay={handlePlay} />} />
				<Route path="/playlists" element={<PlaylistsList />} />
				<Route path="/playlists/:id" element={<Playlist onPlay={handlePlay} />} />
				<Route path="/albums" element={<AlbumsList />} />
				<Route path="/albums/:id" element={<Album onPlay={handlePlay} />} />
				<Route path="/artists" element={<ArtistsList />} />
				<Route path="/login" element={token ? <Navigate to="/profile" /> : <Login onLogin={handleLogin} />} />
				<Route path="/profile" element={token ? <Profile token={token} onLogout={handleLogout} /> : <Navigate to="/login" />} />
				<Route path="*" element={<div>Not Found</div>} />
			</Routes>
			{currentTrack && (
				<Player
					track={currentTrack}
					onNext={handleNext}
					onPrev={handlePrev}
					hasNext={true}
					hasPrev={true}
				/>
			)}
		</>
	)
}

export default App;