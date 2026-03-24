import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SaveButton from './SaveButton.jsx';

function AlbumCard({ album, artist }) {
	const navigate = useNavigate();

	return (
		<li onClick={() => navigate(`/albums/${album.id}`)}>
			<div className="info">
				<img
					src={`/${album.cover_image}`}
					alt={album.title}
				/>
				<div className="details">
					<span className="title">{album.title}</span>
					<span className="artist">
						<Link to={`/artists/${album.artist_id}`} onClick={(e) => e.stopPropagation()}>
							{artist?.name}
						</Link>
					</span>
				</div>
			</div>
			<div className="actions" onClick={(e) => e.stopPropagation()}>
				<SaveButton itemType="album" itemId={album.id} />
			</div>
		</li>
	);
}

export default AlbumCard;
