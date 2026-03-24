import { useState } from 'react';
import '../../styles/AddTrack.css';
import { getArtists } from '../../hooks/get';
import { uploadFileData, createArtistData, createAlbumData } from '../../hooks/set';

export default function AddAlbum({ token, style }) {
	const [isOpen, setIsOpen] = useState(false);
	const [title, setTitle] = useState('');
	const [artistName, setArtistName] = useState('');
	const [year, setYear] = useState('');
	const [file, setFile] = useState(null);

	const [loading, setLoading] = useState(false);

	const artists = getArtists();

	if (!token) return null;

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

		let cover_image = null;
		if (file) {
			const uploadData = await uploadFileData(file);
			cover_image = uploadData.filename;
		}

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

		const releaseYearInt = year ? parseInt(year) : null;

		await createAlbumData(title, finalArtistId, releaseYearInt, cover_image);

		setIsOpen(false);
		setTitle('');
		setArtistName('');
		setYear('');
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
						<h2>Add Album</h2>

						<form onSubmit={handleSubmit}>
							<input
								type="text"
								placeholder="Title *"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								required
							/>

							<input
								list="artists-list-album"
								type="text"
								placeholder="Artist *"
								value={artistName}
								onChange={(e) => setArtistName(e.target.value)}
								required
							/>
							<datalist id="artists-list-album">
								{Array.from(new Set(artists.map(a => a.name))).map((name, idx) => (
									<option key={idx} value={name} />
								))}
							</datalist>

							<input
								type="number"
								placeholder="Release Year"
								min={1900}
								max={2100}
								value={year}
								onChange={(e) => setYear(e.target.value)}
							/>

							<input
								type="file"
								accept="image/*"
								onChange={handleFileChange}
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
