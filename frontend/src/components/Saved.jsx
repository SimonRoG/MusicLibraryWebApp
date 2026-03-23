import React, { useState } from 'react';
import { getSavedItems, getTracks, getPlaylists, getAlbums, getArtists, getUsers } from '../hooks/get.js';
import './styles/Lists.css';
import PlaylistCard from './PlaylistCard.jsx';
import TrackCard from './TrackCard.jsx';
import AlbumCard from './AlbumCard.jsx';
import ArtistCard from './ArtistCard.jsx';

function Saved({ onPlay }) {
	const savedItems = getSavedItems() || [];
	const albums = getAlbums();
	const artists = getArtists();
	const users = getUsers();
	const tracks = getTracks({ limit: 1000 }) || [];
	const playlists = getPlaylists() || [];

	const [filter, setFilter] = useState('all');

	const savedItemsArray = Array.isArray(savedItems) ? savedItems : [];
	const savedTracks = savedItemsArray.filter(item => item.track_id);
	const savedAlbums = savedItemsArray.filter(item => item.album_id);
	const savedArtists = savedItemsArray.filter(item => item.artist_id);
	const savedPlaylists = savedItemsArray.filter(item => item.playlist_id);

	const playableTracks = savedTracks.map(item => tracks.find(t => t.id === item.track_id)).filter(Boolean);

	return (
		<div style={{ padding: '20px' }}>
			<h2>Saved Library</h2>

			<div className="filters" style={{ marginBottom: '20px' }}>
				<select value={filter} onChange={(e) => setFilter(e.target.value)}>
					<option value="all">All</option>
					<option value="tracks">Tracks</option>
					<option value="albums">Albums</option>
					<option value="artists">Artists</option>
					<option value="playlists">Playlists</option>
				</select>
			</div>

			{(filter === 'all' || filter === 'tracks') && savedTracks.length > 0 && (
				<>
					<h3>Tracks</h3>
					<ul className="list">
						{savedTracks.map(item => {
							const track = tracks.find(t => t.id === item.track_id);
							if (!track) return null;

							const album = albums.find(a => a.id === track.album_id);

							return (
								<TrackCard
									key={item.id}
									track={track}
									album={album}
									artist={artists.find(artist => artist.id === track.artist_id)}
									onClick={() => onPlay && onPlay(track, playableTracks)}
								/>
							);
						})}
					</ul>
				</>
			)}

			{(filter === 'all' || filter === 'albums') && savedAlbums.length > 0 && (
				<>
					<h3>Albums</h3>
					<ul className="list">
						{savedAlbums.map(item => {
							const album = albums.find(a => a.id === item.album_id);
							if (!album) return null;

							return (
								<AlbumCard
									key={item.id}
									album={album}
									artist={artists.find(artist => artist.id === album.artist_id)}
								/>
							);
						})}
					</ul>
				</>
			)}

			{(filter === 'all' || filter === 'artists') && savedArtists.length > 0 && (
				<>
					<h3>Artists</h3>
					<ul className="list">
						{savedArtists.map(item => {
							const artist = artists.find(a => a.id === item.artist_id);
							if (!artist) return null;

							return (
								<ArtistCard key={item.id} artist={artist} />
							);
						})}
					</ul>
				</>
			)}

			{(filter === 'all' || filter === 'playlists') && savedPlaylists.length > 0 && (
				<>
					<h3>Playlists</h3>
					<ul className="list">
						{savedPlaylists.map(item => {
							const playlist = playlists.find(p => p.id === item.playlist_id);
							if (!playlist) return null;

							return <PlaylistCard key={playlist.id} playlist={playlist} albums={albums} users={users} />;
						})}
					</ul>
				</>
			)}

			{savedItems.length === 0 && <p>You haven't saved anything yet.</p>}
		</div>
	);
}

export default Saved;
