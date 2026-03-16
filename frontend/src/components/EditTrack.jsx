import { useState, useEffect } from 'react';
import './styles/AddTrack.css';
import { getUser, getArtists, getAlbums, getGenres } from '../hooks/get';
import { createArtistData, createAlbumData, updateTrackData } from '../hooks/post';

export default function EditTrack({ token, track, onClose }) {
	const [title, setTitle] = useState(track.title || '');
	const [artistName, setArtistName] = useState('');
	const [albumTitle, setAlbumTitle] = useState('');
	const [genreId, setGenreId] = useState(track.genre_id || '');
	const [year, setYear] = useState(track.release_year || '');
	const [description, setDescription] = useState(track.description || '');

	const [loading, setLoading] = useState(false);

	const artists = getArtists();
	const albums = getAlbums();
	const genres = getGenres();

	useEffect(() => {
		if (track.artist_id && artists.length > 0) {
			const a = artists.find(ar => ar.id === track.artist_id);
			if (a)
				// eslint-disable-next-line react-hooks/set-state-in-effect
				setArtistName(a.name);
		}
	}, [track.artist_id, artists]);

	useEffect(() => {
		if (track.album_id && albums.length > 0) {
			const al = albums.find(al => al.id === track.album_id);
			if (al)
				// eslint-disable-next-line react-hooks/set-state-in-effect
				setAlbumTitle(al.title);
		}
	}, [track.album_id, albums]);

	if (!token) return null;

	const user = getUser(token);

	if (!user || user.id !== track.owner_id) {
		return null;
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		let finalArtistId = null;
		if (artistName.trim()) {
			const existingArtist = artists.find(a => a.name.toLowerCase() === artistName.trim().toLowerCase());
			if (existingArtist) {
				finalArtistId = existingArtist.id;
			} else {
				const artistData = await createArtistData(artistName.trim());
				finalArtistId = artistData.id;
			}
		}

		let finalAlbumId = null;
		if (albumTitle.trim()) {
			const existingAlbum = albums.find(a => a.title.toLowerCase() === albumTitle.trim().toLowerCase());
			if (existingAlbum) {
				finalAlbumId = existingAlbum.id;
			} else {
				const albumData = await createAlbumData(albumTitle.trim(), finalArtistId);
				finalAlbumId = albumData.id;
			}
		}

		const trackPayload = {
			title,
			artist_id: finalArtistId,
			album_id: finalAlbumId,
			genre_id: genreId ? parseInt(genreId) : null,
			release_year: year ? parseInt(year) : null,
			description: description || null
		};

		await updateTrackData(track.id, trackPayload);

		onClose();
		window.location.reload();
		setLoading(false);
	};

	return (
		<div className="add" style={{ zIndex: 10000 }}>
			<div className="add-modal-overlay" onClick={onClose}>
				<div className="add-modal" onClick={(e) => e.stopPropagation()}>
					<h2>Edit Track</h2>
					<form onSubmit={handleSubmit}>
						<input
							type="text"
							placeholder="Title *"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							required
						/>

						<input
							list="edit-artists-list"
							type="text"
							placeholder="Artist *"
							value={artistName}
							onChange={(e) => setArtistName(e.target.value)}
							required
						/>
						<datalist id="edit-artists-list">
							{Array.from(new Set(artists.map(a => a.name))).map((name, idx) => (
								<option key={idx} value={name} />
							))}
						</datalist>

						<input
							list="edit-albums-list"
							type="text"
							placeholder="Album *"
							value={albumTitle}
							onChange={(e) => setAlbumTitle(e.target.value)}
							required
						/>
						<datalist id="edit-albums-list">
							{Array.from(new Set(albums.filter(a => {
								if (!artistName) return true;
								const artist = artists.find(ar => ar.name.toLowerCase() === artistName.toLowerCase());
								return artist ? a.artist_id === artist.id : true;
							}).map(a => a.title))).map((title, idx) => (
								<option key={idx} value={title} />
							))}
						</datalist>

						<select value={genreId} onChange={(e) => setGenreId(e.target.value)} required>
							<option value="">Genre *</option>
							{genres.map(g => (
								<option key={g.id} value={g.id}>{g.name}</option>
							))}
						</select>

						<input
							type="number"
							placeholder="Year"
							value={year}
							onChange={(e) => setYear(e.target.value)}
						/>

						<textarea
							placeholder="Description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						></textarea>

						<div className="actions">
							<button type="button" onClick={onClose} className="cancel-btn" disabled={loading}>
								Cancel
							</button>
							<button type="submit" className="submit-btn" disabled={loading}>
								{loading ? 'Saving...' : 'Save'}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}