import React, { useState } from 'react'
import { getTracks, getArtists, getAlbums } from '../../hooks/get.js';
import TrackCard from './TrackCard.jsx';
import '../../styles/Lists.css';

function TracksList({ q, genre_id, artist_id, year, initialLimit = 10, onPlay } = {}) {
	const [page, setPage] = useState(1);
	const limit = initialLimit;
	const offset = (page - 1) * limit;

	const tracks = getTracks({ q, genre_id, artist_id, year, offset, limit });
	const artists = getArtists();
	const albums = getAlbums();

	const handlePrev = () => {
		if (page > 1) setPage(p => p - 1);
	};

	const handleNext = () => {
		if (tracks.length === limit) setPage(p => p + 1);
	};

	return (
		<>
			<ul className="list">
				{tracks.map(track => (
					<TrackCard
						key={track.id}
						track={track}
						album={albums.find(album => album.id === track.album_id)}
						artist={artists.find(artist => artist.id === track.artist_id)}
						onClick={() => onPlay && onPlay(track, tracks, { q, genre_id, artist_id, year })}
					/>
				))}
			</ul>
			<div className="pages">
				<button onClick={handlePrev} disabled={page === 1}>{'<'}</button>
				<span> {page} </span>
				<button onClick={handleNext} disabled={tracks.length < limit}>{'>'}</button>
			</div>
		</>
	);
}

export default TracksList;