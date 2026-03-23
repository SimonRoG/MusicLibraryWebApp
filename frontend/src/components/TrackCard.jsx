import React from 'react';
import { Link } from 'react-router-dom';

function TrackCard({ track, album, artist, onClick }) {
    return (
        <li onClick={onClick} style={{ cursor: 'pointer' }}>
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
        </li>
    );
}

export default TrackCard;
