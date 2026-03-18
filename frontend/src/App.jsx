import React, { useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css'
import Navbar from './components/NavBar.jsx';
import SearchTracks from './components/SearchTracks.jsx';
import PlaylistsList from './components/PlaylistsList.jsx';
import Playlist from './components/Playlist.jsx';
import AlbumsList from './components/AlbumsList.jsx';
import Album from './components/Album.jsx';
import ArtistsList from './components/ArtistsList.jsx';
import Artist from './components/Artist.jsx';
import AddTrack from './components/AddTrack';
import AddAlbum from './components/AddAlbum';
import AddArtist from './components/AddArtist';
import AddPlaylist from './components/AddPlaylist';
import AddTrackToPlaylist from './components/AddTrackToPlaylist';
import Player from './components/Player.jsx';
import Login from './components/Login.jsx';
import Profile from './components/Profile.jsx';
import { fetchTracksData } from './hooks/get.js';

function App() {
	const [queue, setQueue] = useState([]);
	const [currentTrackIndex, setCurrentTrackIndex] = useState(-1);
	const [contextParams, setContextParams] = useState(null);
	const [token, setToken] = useState(localStorage.getItem('token') || null);
	const location = useLocation();

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

	const playlistIdMatch = location.pathname.match(/^\/playlists\/(\d+)$/);
	const playlistId = playlistIdMatch ? playlistIdMatch[1] : null;

	return (
		<div style={{ paddingBottom: currentTrack ? '80px' : '0' }}>
			<Navbar token={token} />
			<Routes>
				<Route path="/" element={<Navigate to="/tracks" />} />
				<Route path="/tracks" element={<SearchTracks onPlay={handlePlay} />} />
				<Route path="/playlists" element={<PlaylistsList />} />
				<Route path="/playlists/:id" element={<Playlist onPlay={handlePlay} />} />
				<Route path="/albums" element={<AlbumsList />} />
				<Route path="/albums/:id" element={<Album onPlay={handlePlay} />} />
				<Route path="/artists" element={<ArtistsList />} />
				<Route path="/artists/:id" element={<Artist token={token} />} />
				<Route path="/login" element={token ? <Navigate to="/profile" /> : <Login onLogin={handleLogin} />} />
				<Route path="/profile" element={token ? <Profile token={token} onLogout={handleLogout} /> : <Navigate to="/login" />} />
				<Route path="*" element={<div>Not Found</div>} />
			</Routes>
			{playlistId && <AddTrackToPlaylist token={token} playlistId={playlistId} style={{ bottom: currentTrack ? '90px' : '30px' }} />}
			{location.pathname === '/tracks' && <AddTrack token={token} style={{ bottom: currentTrack ? '90px' : '30px' }} />}
			{location.pathname === '/albums' && <AddAlbum token={token} style={{ bottom: currentTrack ? '90px' : '30px' }} />}
			{location.pathname === '/playlists' && <AddPlaylist token={token} style={{ bottom: currentTrack ? '90px' : '30px' }} />}
			{location.pathname === '/artists' && <AddArtist token={token} style={{ bottom: currentTrack ? '90px' : '30px' }} />}
			{currentTrack && (
				<Player
					token={token}
					track={currentTrack}
					onNext={handleNext}
					onPrev={handlePrev}
					hasNext={true}
					hasPrev={true}
				/>
			)}
		</div>
	)
}

export default App;