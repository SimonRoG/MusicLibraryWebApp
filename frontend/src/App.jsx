import React from 'react'
import { Routes, Route } from 'react-router-dom';
import './App.css'
import Navbar from './components/NavBar.jsx';
import TracksList from './components/TracksList.jsx';
import PlaylistsList from './components/PlaylistsList.jsx';

function App() {
	return (
		<>
			<Navbar />
			<Routes>
				<Route path="/" element={<TracksList />} />
				<Route path="/playlists" element={<PlaylistsList />} />
				<Route path="*" element={<div>Not Found</div>} />
			</Routes>
		</>
	)
}

export default App;