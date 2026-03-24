import { useState, useEffect } from 'react';
import '../../styles/AddTrack.css';
import { fetchTracksData, getUser, getPlaylistById } from '../../hooks/get';
import { addTrackToPlaylistData } from '../../hooks/set';

export default function AddTrackToPlaylist({ playlistId, token, style }) {
	const [isOpen, setIsOpen] = useState(false);
	const [trackQuery, setTrackQuery] = useState('');
	const [tracks, setTracks] = useState([]);
	const [selectedTrack, setSelectedTrack] = useState('');
	const [loading, setLoading] = useState(false);

	const user = getUser(token);
	const playlist = getPlaylistById(playlistId);

	useEffect(() => {
		if (isOpen) {
			const search = async () => {
				const results = await fetchTracksData({ q: trackQuery, limit: 100 });
				setTracks(Array.isArray(results) ? results : []);
			};
			search();
		}
	}, [isOpen, trackQuery]);

	if (!token || !user || !playlist || (playlist.user_id !== user.id && user.id !== 1)) return null;

	const toggleModal = () => {
		setIsOpen(!isOpen);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!selectedTrack) return;
		
		setLoading(true);

		await addTrackToPlaylistData(playlistId, selectedTrack);

		setIsOpen(false);
		setSelectedTrack('');

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
						<h2>Add Track to Playlist</h2>

						<form onSubmit={handleSubmit}>
							<input
								list="tracks-list"
								type="text"
								placeholder="Search tracks..."
								value={trackQuery}
								onChange={(e) => {
									setTrackQuery(e.target.value);
									const selected = tracks.find(t => t.title === e.target.value);
									if (selected) {
										setSelectedTrack(selected.id);
									} else {
										setSelectedTrack('');
									}
								}}
								required
							/>
							<datalist id="tracks-list">
								{tracks.map(t => (
									<option key={t.id} value={t.title} />
								))}
							</datalist>

							<div className="actions" style={{ marginTop: '20px' }}>
								<button type="button" className="cancel-btn" onClick={toggleModal} disabled={loading}>
									Cancel
								</button>
								<button type="submit" className="submit-btn" disabled={loading || !selectedTrack}>
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