import { useState } from 'react';
import './styles/AddTrack.css';
import { getUser, getArtists, getAlbums, getGenres } from '../hooks/get';
import { uploadFileData, createArtistData, createAlbumData, createTrackData } from '../hooks/post';

export default function AddTrack({ token, style }) {
	const [isOpen, setIsOpen] = useState(false);
	const [title, setTitle] = useState('');
	const [artistName, setArtistName] = useState('');
	const [albumTitle, setAlbumTitle] = useState('');
	const [genreId, setGenreId] = useState('');
	const [year, setYear] = useState('');
	const [description, setDescription] = useState('');
	const [file, setFile] = useState(null);

	const [loading, setLoading] = useState(false);

	if (!token) return null;

	const user = getUser(token);
	const artists = getArtists();
	const albums = getAlbums();
	const genres = getGenres();

	const toggleModal = () => {
		setIsOpen(!isOpen);
	};

	const handleFileChange = (e) => {
		if (e.target.files && e.target.files.length > 0) {
			setFile(e.target.files[0]);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		const uploadData = await uploadFileData(file);
		const audio_file = uploadData.filename;

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
			audio_file,
			owner_id: user.id,
			artist_id: finalArtistId,
			album_id: finalAlbumId,
			genre_id: genreId ? parseInt(genreId) : null,
			release_year: year ? parseInt(year) : null,
			description: description || null
		};

		await createTrackData(trackPayload);

		setIsOpen(false);
		setTitle('');
		setArtistName('');
		setAlbumTitle('');
		setGenreId('');
		setYear('');
		setDescription('');
		setFile(null);

		window.location.reload();

		setLoading(false);

	};

	return (
		<div className="add" style={style}>
			<button className="add-btn" onClick={toggleModal}>
				+
			</button>

			{isOpen && (
				<div className="add-modal-overlay" onClick={toggleModal}>
					<div className="add-modal" onClick={(e) => e.stopPropagation()}>
						<h2>Add Track</h2>

						<form onSubmit={handleSubmit}>
							<input
								type="text"
								placeholder="Title *"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								required
							/>

							<input
								list="artists-list"
								type="text"
								placeholder="Artist *"
								value={artistName}
								onChange={(e) => setArtistName(e.target.value)}
								required
							/>
							<datalist id="artists-list">
								{Array.from(new Set(artists.map(a => a.name))).map((name, idx) => (
									<option key={idx} value={name} />
								))}
							</datalist>

							<input
								list="albums-list"
								type="text"
								placeholder="Album *"
								value={albumTitle}
								onChange={(e) => setAlbumTitle(e.target.value)}
								required
							/>
							<datalist id="albums-list">
								{Array.from(new Set(albums.map(a => a.title))).map((title, idx) => (
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
								placeholder="Release Year *"
								min={1900}
								max={2100}
								value={year}
								onChange={(e) => setYear(e.target.value)}
								required
							/>

							<textarea
								placeholder="Description"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
							/>

							<input
								type="file"
								accept="audio/*"
								onChange={handleFileChange}
								required
							/>

							<div className="actions">
								<button type="button" className="cancel-btn" onClick={toggleModal} disabled={loading}>
									Cancel
								</button>
								<button type="submit" className="submit-btn" disabled={loading}>
									{loading ? 'Adding...' : 'Add'}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}
