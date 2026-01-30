import React, { useState } from 'react';
import TracksList from './TracksList';
import { getArtists, getGenres } from '../hooks/get';
import './styles/Search.css';

function SearchTracks({ onPlay }) {
	const [q, setQ] = useState('');
	const [genreId, setGenreId] = useState('');
	const [artistId, setArtistId] = useState('');
	const [year, setYear] = useState('');

	const artists = getArtists();
	const genres = getGenres();

	return (
		<div className="search">
			<h2>Search Tracks</h2>
			<div className="filters">
				<input
					type="text"
					placeholder="Search by title..."
					value={q}
					onChange={(e) => setQ(e.target.value)}
				/>

				<select value={genreId} onChange={(e) => setGenreId(e.target.value)}>
					<option value="">All Genres</option>
					{genres.map(genre => (
						<option key={genre.id} value={genre.id}>
							{genre.name}
						</option>
					))}
				</select>

				<select value={artistId} onChange={(e) => setArtistId(e.target.value)}>
					<option value="">All Artists</option>
					{artists.map(artist => (
						<option key={artist.id} value={artist.id}>
							{artist.name}
						</option>
					))}
				</select>

				<input
					type="number"
					placeholder="Year"
					value={year}
					onChange={(e) => setYear(e.target.value)}
				/>
			</div>

			<TracksList
				q={q}
				genre_id={genreId}
				artist_id={artistId}
				year={year}
				onPlay={onPlay}
			/>
		</div>
	);
}

export default SearchTracks;