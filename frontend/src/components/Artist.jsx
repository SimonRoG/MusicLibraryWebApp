import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import { getArtistById, getAlbums, getUser } from '../hooks/get.js';
import EditArtist from './EditArtist.jsx';
import AlbumCard from './AlbumCard.jsx';
import './styles/Lists.css';

function Artist({ token }) {
	const { id } = useParams();
	const albums = getAlbums({ artist_id: id });
	const artist = getArtistById(id);
	const user = getUser(token);

	const [showEdit, setShowEdit] = useState(false);

	if (!artist) return <div>Loading...</div>;

	return (
		<>
			<div>
				<h2>{artist.name}</h2>
				{user && user.username === 'admin' && (
					<button style={{ marginBottom: "10px", padding: '5px 10px', borderRadius: '5px', border: '1px solid #ccc', backgroundColor: '#333', color: '#fff', cursor: 'pointer' }} onClick={() => setShowEdit(true)}>Edit</button>
				)}
				{artist.description && <p>{artist.description}</p>}
			</div>
			<ul className="list">
				{albums.map(album => (
					<AlbumCard
						key={album.id}
						album={album}
						artist={artist}
					/>
				))}
			</ul>
			{showEdit && (
				<EditArtist
					token={token}
					artist={artist}
					onClose={() => setShowEdit(false)}
				/>
			)}
		</>
	);
}

export default Artist;
