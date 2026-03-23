import { useState } from 'react';
import './styles/AddTrack.css';
import { getUser } from '../hooks/get';
import { createPlaylistData } from '../hooks/set';

export default function AddPlaylist({ token, style }) {
	const [isOpen, setIsOpen] = useState(false);
	const [name, setName] = useState('');
	const [loading, setLoading] = useState(false);

	const user = getUser(token);

	if (!token) return null;

	const toggleModal = () => {
		setIsOpen(!isOpen);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		await createPlaylistData(name, user.id);

		setIsOpen(false);
		setName('');

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
						<h2>Create Playlist</h2>

						<form onSubmit={handleSubmit}>
							<input
								type="text"
								placeholder="Playlist Name *"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>

							<div className="actions">
								<button type="button" className="cancel-btn" onClick={toggleModal} disabled={loading}>
									Cancel
								</button>
								<button type="submit" className="submit-btn" disabled={loading}>
									{loading ? 'Creating...' : 'Create'}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}