import React, { useEffect, useState } from 'react'
import { getTracks, getArtists, getAlbums, getUser } from '../../hooks/get.js';
import { deleteTrackData } from '../../hooks/set.js';
import TrackCard from './TrackCard.jsx';
import '../../styles/Lists.css';

function TracksList({ q, genre_id, artist_id, year, initialLimit = 10, onPlay, token } = {}) {
	const [page, setPage] = useState(1);
	const [displayedTracks, setDisplayedTracks] = useState([]);
	const [deletingTrackId, setDeletingTrackId] = useState(null);
	const limit = initialLimit;
	const offset = (page - 1) * limit;

	const tracks = getTracks({ q, genre_id, artist_id, year, offset, limit });
	const allMatchingTracks = getTracks({ q, genre_id, artist_id, year, offset: 0, limit: 1000 });
	const artists = getArtists();
	const albums = getAlbums();
	const user = getUser(token);

	useEffect(() => {
		if (Array.isArray(tracks)) {
			setDisplayedTracks(tracks);
		}
	}, [tracks]);

	const canDeleteTrack = (track) => Boolean(user) && (track.owner_id === user.id || user.id === 1);

	const handleDeleteTrack = async (trackId) => {
		setDeletingTrackId(trackId);
		const result = await deleteTrackData(trackId);

		if (result?.ok) {
			setDisplayedTracks((currentTracks) => currentTracks.filter((track) => track.id !== trackId));
		}

		setDeletingTrackId(null);
	};

	const handlePrev = () => {
		if (page > 1) setPage(p => p - 1);
	};

	const handleNext = () => {
		if (displayedTracks.length === limit) setPage(p => p + 1);
	};

	return (
		<>
			<ul className="list">
				{displayedTracks.map(track => (
					<TrackCard
						key={track.id}
						track={track}
						album={albums.find(album => album.id === track.album_id)}
						artist={artists.find(artist => artist.id === track.artist_id)}
						token={token}
						onClick={() => onPlay && onPlay(track, allMatchingTracks, { q, genre_id, artist_id, year })}
						actions={canDeleteTrack(track) ? (
							<button
								type="button"
								className="track-delete-btn"
								onClick={() => handleDeleteTrack(track.id)}
								disabled={deletingTrackId === track.id}
							>
								{deletingTrackId === track.id ? 'Deleting...' : 'Delete'}
							</button>
						) : null}
					/>
				))}
			</ul>
			<div className="pages">
				<button onClick={handlePrev} disabled={page === 1}>{'<'}</button>
				<span> {page} </span>
				<button onClick={handleNext} disabled={displayedTracks.length < limit}>{'>'}</button>
			</div>
		</>
	);
}

export default TracksList;