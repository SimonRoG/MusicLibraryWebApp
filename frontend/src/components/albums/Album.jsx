import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom';
import { getTracks, getAlbumById, getArtists, getUser } from '../../hooks/get.js';
import { deleteTrackData } from '../../hooks/set.js';
import TrackCard from '../tracks/TrackCard.jsx';
import SaveButton from '../SaveButton.jsx';
import '../../styles/Lists.css';

function Album({ onPlay, token }) {
	const { id } = useParams();
	const tracks = getTracks({ album_id: id });
	const album = getAlbumById(id);
	const artists = getArtists();
	const user = getUser(token);
	const [displayedTracks, setDisplayedTracks] = useState([]);
	const [deletingTrackId, setDeletingTrackId] = useState(null);

	useEffect(() => {
		if (Array.isArray(tracks)) {
			setDisplayedTracks(tracks);
		}
	}, [tracks]);

	if (!album)
		return <div>Loading...</div>;

	const artist = artists.find(a => a.id === album.artist_id);
	const canDeleteTrack = (track) => Boolean(user) && (track.owner_id === user.id || user.id === 1);

	const handleDeleteTrack = async (trackId) => {
		setDeletingTrackId(trackId);
		const result = await deleteTrackData(trackId);

		if (result?.ok) {
			setDisplayedTracks((currentTracks) => currentTracks.filter((track) => track.id !== trackId));
		}

		setDeletingTrackId(null);
	};

	return (
		<>
			<div className="playlist-header" style={{ display: 'flex', gap: '20px', alignItems: 'center', padding: '20px' }}>
				<img
					src={`/${album.cover_image}`}
					alt={album.title}
					height={200}
					width={200}
				/>
				<div>
					<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
						<h2>{album.title}</h2>
						<SaveButton itemType="album" itemId={album.id} />
					</div>
					<p>
						{artist && (
							<Link to={`/artists/${artist.id}`}>{artist.name}</Link>
						)}
					</p>
					<p>{album.release_year}</p>
				</div>
			</div>
			<ul className="list">
				{displayedTracks.map(track => (
					<TrackCard
						key={track.id}
						track={track}
						album={album}
						artist={artist}
						token={token}
						onClick={() => onPlay && onPlay(track, displayedTracks)}
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
		</>
	);
}

export default Album;
