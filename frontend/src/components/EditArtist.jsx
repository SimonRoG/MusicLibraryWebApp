import { useState } from 'react';
import './styles/AddTrack.css';
import { updateArtistData } from '../hooks/set';

export default function EditArtist({ token, artist, onClose }) {
	const [name, setName] = useState(artist.name || '');
	const [description, setDescription] = useState(artist.description || '');

	const [loading, setLoading] = useState(false);

	if (!token) return null;

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			await updateArtistData(artist.id, {
				name: name.trim(),
				description: description.trim() || null
			});

			onClose();
			window.location.reload();
		} catch (error) {
			console.error("Error updating artist", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="add" style={{ zIndex: 1000 }}>
			<div className="add-modal-overlay" onClick={onClose}>
				<div className="add-modal" onClick={(e) => e.stopPropagation()}>
					<h2>Edit Artist</h2>
					<form onSubmit={handleSubmit}>
						<input
							type="text"
							placeholder="Artist Name *"
							value={name}
							onChange={(e) => setName(e.target.value)}
							required
						/>
						<textarea
							placeholder="Description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
						<div className="actions">
							<button type="button" className="cancel-btn" onClick={onClose} disabled={loading}>
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
