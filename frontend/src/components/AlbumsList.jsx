import React from 'react'
import { Link } from 'react-router-dom';
import { getArtists, getAlbums } from '../hooks/get.js';
import './styles/Lists.css';

function AlbumsList() {
	const artists = getArtists();
	const albums = getAlbums();

	return (
		<>
			<ul className="list">
				{albums.map(album => (
					<Link to={`/albums/${album.id}`} key={album.id}>
						<li>
							<div className="info">
								<img
									src={`/${album.cover_image}`}
									alt={album.title}
								/>
								<div className="details">
									<span className="title">{album.title}</span>
									<span className="artist">
										<Link to={`/artists/${album.artist_id}`}>
											{artists.find(artist => artist.id === album.artist_id)?.name}
										</Link>
									</span>
								</div>
							</div>
						</li>
					</Link>
				))}
			</ul>
		</>
	);
}

export default AlbumsList;