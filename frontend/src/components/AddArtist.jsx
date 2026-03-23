import { useState } from 'react';
import './styles/AddTrack.css'; // Using the same styling
import { createArtistData } from '../hooks/set';

export default function AddArtist({ token, style }) {
	const [isOpen, setIsOpen] = useState(false);
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');

	const [loading, setLoading] = useState(false);

	if (!token) return null;

	const toggleModal = () => {
		setIsOpen(!isOpen);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			await createArtistData(name.trim(), description.trim() || undefined);
			setIsOpen(false);
			setName('');
			setDescription('');
			window.location.reload();
		} catch (error) {
			console.error("Error creating artist", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="add" style={style}>
			<button className="add-btn" onClick={toggleModal}>
				+
			</button>

			{isOpen && (
				<div className="add-modal-overlay" onClick={toggleModal}>
					<div className="add-modal" onClick={(e) => e.stopPropagation()}>
						<h2>Add Artist</h2>

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
