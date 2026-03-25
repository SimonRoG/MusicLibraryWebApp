import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { getUsers, getPlaylistById, getPlaylistTracks, getArtists, getAlbums, getUser } from '../../hooks/get.js';
import { deleteTrackData, removeTrackFromPlaylistData } from '../../hooks/set.js';
import TrackCard from '../tracks/TrackCard.jsx';
import SaveButton from '../SaveButton.jsx';
import '../../styles/Lists.css';

function Playlist({ onPlay, token }) {
	const { id } = useParams();
	const users = getUsers();
	const tracks = getPlaylistTracks(id);
	const playlist = getPlaylistById(id);
	const artists = getArtists();
	const albums = getAlbums();
	const user = getUser(token);
	const [displayedTracks, setDisplayedTracks] = useState([]);
	const [removingTrackId, setRemovingTrackId] = useState(null);
	const [deletingTrackId, setDeletingTrackId] = useState(null);

	useEffect(() => {
		if (Array.isArray(tracks)) {
			// eslint-disable-next-line react-hooks/set-state-in-effect
			setDisplayedTracks(tracks);
		}
	}, [tracks]);

	if (!playlist)
		return <div>Loading...</div>;

	if (playlist.detail)
		return <div><h2>{playlist.detail}</h2></div>;

	const owner = playlist.user_id === 1 ? 'MusLi' : users.find(u => u.id === playlist.user_id)?.username || 'Unknown';
	const canEditPlaylist = Boolean(user) && (playlist.user_id === user.id || user.id === 1);
	const canDeleteTrack = (track) => Boolean(user) && (track.owner_id === user.id || user.id === 1);

	const handleRemoveTrack = async (trackId) => {
		setRemovingTrackId(trackId);
		const result = await removeTrackFromPlaylistData(id, trackId);

		if (result?.ok) {
			setDisplayedTracks((currentTracks) => currentTracks.filter((track) => track.id !== trackId));
		}

		setRemovingTrackId(null);
	};

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
			<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
				<h2>{playlist.name}</h2>
				<SaveButton itemType="playlist" itemId={playlist.id} />
			</div>
			<p>Owner: {owner}</p>
			{tracks.detail && <div><h2>{tracks.detail}</h2></div>}
			<ul className="list">
				{Array.isArray(displayedTracks) && displayedTracks.map(track => {
					const album = albums.find(a => a.id === track.album_id);
					const artist = artists.find(a => a.id === track.artist_id);

					return (
						<TrackCard
							key={track.id}
							track={track}
							album={album}
							artist={artist}
							token={token}
							onClick={() => onPlay && onPlay(track, displayedTracks)}
							actionsBeforeEdit={canEditPlaylist ? (
								<button
									type="button"
									className="playlist-remove-btn"
									onClick={() => handleRemoveTrack(track.id)}
									disabled={removingTrackId === track.id}
								>
									{removingTrackId === track.id ? 'Removing...' : 'Remove'}
								</button>
							) : null}
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
					)
				})}
			</ul>
		</>
	);
}

export default Playlist;
