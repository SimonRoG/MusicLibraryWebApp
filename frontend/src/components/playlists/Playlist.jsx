import React from 'react'
import { useParams, Link } from 'react-router-dom';
import { getUsers, getPlaylistById, getPlaylistTracks, getArtists, getAlbums } from '../../hooks/get.js';
import TrackCard from '../tracks/TrackCard.jsx';
import SaveButton from '../SaveButton.jsx';
import '../../styles/Lists.css';

function Playlist({ onPlay }) {
	const { id } = useParams();
	const users = getUsers();
	const tracks = getPlaylistTracks(id);
	const playlist = getPlaylistById(id);
	const artists = getArtists();
	const albums = getAlbums();

	if (!playlist)
		return <div>Loading...</div>;

	if (playlist.detail)
		return <div><h2>{playlist.detail}</h2></div>;

	const owner = playlist.user_id === 1 ? 'MusLi' : users.find(u => u.id === playlist.user_id)?.username || 'Unknown';

	return (
		<>
			<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
				<h2>{playlist.name}</h2>
				<SaveButton itemType="playlist" itemId={playlist.id} />
			</div>
			<p>Owner: {owner}</p>
			{tracks.detail && <div><h2>{tracks.detail}</h2></div>}
			<ul className="list">
				{Array.isArray(tracks) && tracks.map(track => {
					const album = albums.find(a => a.id === track.album_id);
					const artist = artists.find(a => a.id === track.artist_id);

					return (
						<TrackCard
							key={track.id}
							track={track}
							album={album}
							artist={artist}
							onClick={() => onPlay && onPlay(track, tracks)}
						/>
					)
				})}
			</ul>
		</>
	);
}

export default Playlist;
