import React from 'react'
import { useParams, Link } from 'react-router-dom';
import { getTracks, getAlbumById, getArtists } from '../../hooks/get.js';
import TrackCard from '../tracks/TrackCard.jsx';
import SaveButton from '../SaveButton.jsx';
import '../../styles/Lists.css';

function Album({ onPlay }) {
	const { id } = useParams();
	const tracks = getTracks({ album_id: id });
	const album = getAlbumById(id);
	const artists = getArtists();

	if (!album)
		return <div>Loading...</div>;

	const artist = artists.find(a => a.id === album.artist_id);

	return (
		<>
			<div className="playlist-header" style={{ display: 'flex', gap: '20px', alignItems: 'center', padding: '20px' }}>
				<img
					src={`/${album.cover_image}`}
					alt={album.title}
					height={200}
					width={200}
				/>
				<div>
					<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
						<h2>{album.title}</h2>
						<SaveButton itemType="album" itemId={album.id} />
					</div>
					<p>
						{artist && (
							<Link to={`/artists/${artist.id}`}>{artist.name}</Link>
						)}
					</p>
					<p>{album.release_year}</p>
				</div>
			</div>
			<ul className="list">
				{tracks.map(track => (
					<TrackCard
						key={track.id}
						track={track}
						album={album}
						artist={artist}
						onClick={() => onPlay && onPlay(track, tracks)}
					/>
				))}
			</ul>
		</>
	);
}

export default Album;
