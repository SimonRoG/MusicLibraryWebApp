import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getUser } from '../../hooks/get.js';
import SaveButton from '../SaveButton.jsx';
import EditTrack from './EditTrack.jsx';

function TrackCard({ track, album, artist, onClick, actionsBeforeEdit, actions, token }) {
	const [showEdit, setShowEdit] = useState(false);
	const user = getUser(token);
	const canEditTrack = Boolean(user) && user.id === track.owner_id;

	return (
		<>
			<li onClick={onClick}>
				<div className="info">
					<img
						src={`/${album?.cover_image}`}
						alt={`/${album?.title}`}
					/>
					<div className="details">
						<span className="title">{track.title}</span>
						<span className="artist" onClick={(e) => e.stopPropagation()}>
							<Link to={`/artists/${track.artist_id}`}>
								{artist?.name}
							</Link>
						</span>
					</div>
				</div>
				<div className="actions" onClick={(e) => e.stopPropagation()}>
					<SaveButton itemType="track" itemId={track.id} />
					{actionsBeforeEdit}
					{canEditTrack ? (
						<button
							type="button"
							className="track-edit-btn"
							onClick={() => setShowEdit(true)}
						>
							Edit
						</button>
					) : null}
					{actions}
				</div>
			</li>
			{showEdit && (
				<EditTrack
					token={token}
					track={track}
					onClose={() => setShowEdit(false)}
				/>
			)}
		</>
	);
}

export default TrackCard;
