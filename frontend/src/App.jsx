import React, { useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './styles/App.css'
import Navbar from './components/NavBar.jsx';
import SearchTracks from './components/tracks/SearchTracks.jsx';
import PlaylistsList from './components/playlists/PlaylistsList.jsx';
import Playlist from './components/playlists/Playlist.jsx';
import AlbumsList from './components/albums/AlbumsList.jsx';
import Album from './components/albums/Album.jsx';
import ArtistsList from './components/artists/ArtistsList.jsx';
import Artist from './components/artists/Artist.jsx';
import AddTrack from './components/tracks/AddTrack.jsx';
import AddAlbum from './components/albums/AddAlbum.jsx';
import AddArtist from './components/artists/AddArtist.jsx';
import AddPlaylist from './components/playlists/AddPlaylist.jsx';
import AddTrackToPlaylist from './components/playlists/AddTrackToPlaylist.jsx';
import Player from './components/Player.jsx';
import Login from './components/auth/Login.jsx';
import Register from './components/auth/Register.jsx';
import Profile from './components/auth/Profile.jsx';
import Saved from './components/Saved.jsx';
import { fetchTracksData } from './hooks/get.js';

function shuffleIds(trackIds) {
	const shuffled = [...trackIds];
	for (let index = shuffled.length - 1; index > 0; index -= 1) {
		const randomIndex = Math.floor(Math.random() * (index + 1));
		[shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
	}
	return shuffled;
}

function buildPlayOrder(tracks, currentTrackId, mixEnabled) {
	const trackIds = tracks.map(track => track.id);
	if (!mixEnabled) {
		return trackIds;
	}

	const remainingTrackIds = trackIds.filter(trackId => trackId !== currentTrackId);
	return currentTrackId ? [currentTrackId, ...shuffleIds(remainingTrackIds)] : shuffleIds(trackIds);
}

function App() {
	const [queue, setQueue] = useState([]);
	const [playOrder, setPlayOrder] = useState([]);
	const [currentOrderIndex, setCurrentOrderIndex] = useState(-1);
	const [contextParams, setContextParams] = useState(null);
	const [mixEnabled, setMixEnabled] = useState(false);
	const [canLoadMore, setCanLoadMore] = useState(false);
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
		const playableTracks = Array.isArray(tracks)
			? tracks.filter(candidate => candidate && candidate.id)
			: [];

		if (!track || playableTracks.length === 0) {
			return;
		}

		const nextOrder = buildPlayOrder(playableTracks, track.id, mixEnabled);

		setQueue(playableTracks);
		setPlayOrder(nextOrder);
		setContextParams(params || null);
		setCanLoadMore(Boolean(params));
		setCurrentOrderIndex(Math.max(nextOrder.findIndex(trackId => trackId === track.id), 0));
	};

	const handleNext = async () => {
		if (currentOrderIndex < playOrder.length - 1) {
			setCurrentOrderIndex(index => index + 1);
			return;
		}

		if (!contextParams || !canLoadMore) {
			if (playOrder.length > 0) {
				setCurrentOrderIndex(0);
			}
			return;
		}

		const fetchedTracks = await fetchTracksData({
			...contextParams,
			offset: queue.length,
			limit: 10,
		});

		if (!Array.isArray(fetchedTracks) || fetchedTracks.length === 0) {
			setCanLoadMore(false);
			if (playOrder.length > 0) {
				setCurrentOrderIndex(0);
			}
			return;
		}

		const existingTrackIds = new Set(queue.map(track => track.id));
		const uniqueTracks = fetchedTracks.filter(track => track?.id && !existingTrackIds.has(track.id));

		if (uniqueTracks.length === 0) {
			setCanLoadMore(false);
			if (playOrder.length > 0) {
				setCurrentOrderIndex(0);
			}
		} else {
			const appendedOrder = mixEnabled
				? shuffleIds(uniqueTracks.map(track => track.id))
				: uniqueTracks.map(track => track.id);

			setQueue(prev => [...prev, ...uniqueTracks]);
			setPlayOrder(prev => [...prev, ...appendedOrder]);
			setCurrentOrderIndex(index => index + 1);
			setCanLoadMore(fetchedTracks.length === 10);
		}
	};

	const handlePrev = () => {
		if (playOrder.length === 0) {
			return;
		}

		if (currentOrderIndex > 0) {
			setCurrentOrderIndex(index => index - 1);
		} else {
			setCurrentOrderIndex(playOrder.length - 1);
		}
	};

	const handleToggleMix = () => {
		const nextMixState = !mixEnabled;
		setMixEnabled(nextMixState);

		if (queue.length === 0 || currentOrderIndex < 0 || currentOrderIndex >= playOrder.length) {
			return;
		}

		const currentTrackId = playOrder[currentOrderIndex];

		if (!nextMixState) {
			const sequentialOrder = queue.map(track => track.id);
			setPlayOrder(sequentialOrder);
			setCurrentOrderIndex(Math.max(sequentialOrder.findIndex(trackId => trackId === currentTrackId), 0));
			return;
		}

		const playedTrackIds = playOrder.slice(0, currentOrderIndex);
		const playedTrackSet = new Set(playedTrackIds);
		const upcomingTrackIds = queue
			.map(track => track.id)
			.filter(trackId => trackId !== currentTrackId && !playedTrackSet.has(trackId));
		const nextOrder = [...playedTrackIds, currentTrackId, ...shuffleIds(upcomingTrackIds)];

		setPlayOrder(nextOrder);
		setCurrentOrderIndex(playedTrackIds.length);
	};

	const currentTrackId = currentOrderIndex >= 0 && currentOrderIndex < playOrder.length
		? playOrder[currentOrderIndex]
		: null;
	const currentTrack = currentTrackId
		? queue.find(track => track.id === currentTrackId) || null
		: null;
	const hasPrev = playOrder.length > 1;
	const hasNext = playOrder.length > 1 || canLoadMore;

	const playlistIdMatch = location.pathname.match(/^\/playlists\/(\d+)$/);
	const playlistId = playlistIdMatch ? playlistIdMatch[1] : null;

	return (
		<div style={{ paddingBottom: currentTrack ? '86px' : '0' }}>
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
				<Route path="/saved" element={token ? <Saved onPlay={handlePlay} /> : <Navigate to="/login" />} />
				<Route path="/login" element={token ? <Navigate to="/profile" /> : <Login onLogin={handleLogin} />} />
				<Route path="/register" element={token ? <Navigate to="/profile" /> : <Register onLogin={handleLogin} />} />
				<Route path="/profile" element={token ? <Profile token={token} onLogout={handleLogout} /> : <Navigate to="/login" />} />
				<Route path="*" element={<div>Not Found</div>} />
			</Routes>
			{playlistId && <AddTrackToPlaylist token={token} playlistId={playlistId} style={{ bottom: currentTrack ? '96px' : '30px' }} />}
			{location.pathname === '/tracks' && <AddTrack token={token} style={{ bottom: currentTrack ? '96px' : '30px' }} />}
			{location.pathname === '/albums' && <AddAlbum token={token} style={{ bottom: currentTrack ? '96px' : '30px' }} />}
			{location.pathname === '/playlists' && <AddPlaylist token={token} style={{ bottom: currentTrack ? '96px' : '30px' }} />}
			{location.pathname === '/artists' && <AddArtist token={token} style={{ bottom: currentTrack ? '96px' : '30px' }} />}
			{currentTrack && (
				<Player
					token={token}
					track={currentTrack}
					onNext={handleNext}
					onPrev={handlePrev}
					hasNext={hasNext}
					hasPrev={hasPrev}
					mixEnabled={mixEnabled}
					onToggleMix={handleToggleMix}
				/>
			)}
		</div>
	)
}

export default App;