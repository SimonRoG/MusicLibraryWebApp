import React from 'react';
import { useNavigate } from 'react-router-dom';

function ArtistCard({ artist }) {
	const navigate = useNavigate();

	return (
		<li onClick={() => artist && navigate(`/artists/${artist.id}`)} style={{ cursor: 'pointer' }}>
			<div className="info">
				<img src="" alt="" />
				<div className="details">
					<span className="title">{artist?.name}</span>
				</div>
			</div>
		</li>
	);
}

export default ArtistCard;
