import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { getArtists, getAlbums } from '../hooks/get.js';
import './styles/Lists.css';

function AlbumsList() {
	const artists = getArtists();
	const albums = getAlbums();
	const navigate = useNavigate();

	return (
		<>
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
								<span className="artist">
									<Link to={`/artists/${album.artist_id}`} onClick={(e) => e.stopPropagation()}>
										{artists.find(artist => artist.id === album.artist_id)?.name}
									</Link>
								</span>
							</div>
						</div>
					</li>
				))}
			</ul>
		</>
	);
}

export default AlbumsList;