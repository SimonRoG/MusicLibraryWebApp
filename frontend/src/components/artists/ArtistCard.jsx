import React from 'react';
import { useNavigate } from 'react-router-dom';
import SaveButton from '../SaveButton.jsx';

function ArtistCard({ artist }) {
	const navigate = useNavigate();

	return (
		<li onClick={() => artist && navigate(`/artists/${artist.id}`)}>
			<div className="info">
				<img src="" alt="" />
				<div className="details">
					<span className="title">{artist?.name}</span>
				</div>
			</div>
			{artist && (
				<div className="actions" onClick={(e) => e.stopPropagation()}>
					<SaveButton itemType="artist" itemId={artist.id} />
				</div>
			)}
		</li>
	);
}

export default ArtistCard;
