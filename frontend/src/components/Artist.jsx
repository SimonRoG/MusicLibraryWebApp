import React from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getArtistById, getAlbums } from '../hooks/get.js';
import './styles/Lists.css';

function Artist() {
	const { id } = useParams();
	const albums = getAlbums({ artist_id: id });
	const artist = getArtistById(id);
	const navigate = useNavigate();

	if (!artist) return <div>Loading...</div>;

	return (
		<>
			<div>
				<h2>{artist.name}</h2>
				{artist.description && <p>{artist.description}</p>}
			</div>
			<ul className="list">
				{albums.map(album => (
					<li key={album.id} onClick={() => navigate(`/albums/${album.id}`)} style={{ cursor: 'pointer' }}>
						<div className="info">
							<img
								src={`/${album.cover_image}`}
								alt={album.title}
							/>
							<div className="details">
								<span className="title">{album.title}</span>
								<span className="artist">{album.release_year}</span>
							</div>
						</div>
					</li>
				))}
			</ul>
		</>
	);
}

export default Artist;
