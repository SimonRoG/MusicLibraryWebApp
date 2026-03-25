import React from 'react';
import { Link } from 'react-router-dom';
import SaveButton from '../SaveButton.jsx';

function TrackCard({ track, album, artist, onClick, actions }) {
	return (
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
				{actions}
			</div>
		</li>
	);
}

export default TrackCard;
