import React, { useState } from 'react'
import { getUsers, getTracks, getTrackById, getPlaylists, getPlaylistById, getPlaylistTracks, getArtists, getGenres, getAlbums } from '../hooks/get.js';
import './styles/Lists.css';

function TracksList({q, genre_id, artist_id, year, initialLimit = 10, onPlay} = {}) {
    const [page, setPage] = useState(1);
    const limit = initialLimit;
    const offset = (page - 1) * limit;

    const users = getUsers();
    const tracks = getTracks({ q, genre_id, artist_id, year, offset, limit });
    const playlists = getPlaylists();
    const artists = getArtists();
    const genres = getGenres();
    const albums = getAlbums();

    const handlePrev = () => {
        if (page > 1) setPage(p => p - 1);
    };

    const handleNext = () => {
        if (tracks.length === limit) setPage(p => p + 1);
    };

    return (
        <>
            <ul className="list">
                {tracks.map(track => (
                    <li key={track.id} onClick={() => onPlay && onPlay(track, tracks, { q, genre_id, artist_id, year })} style={{cursor: 'pointer'}}>
                         <img
                            src={`/${albums.find(album => album.id === track.album_id)?.cover_image}`}
                            alt={`/${albums.find(album => album.id === track.album_id)?.title}`}
                            height="20px"
                            width="20px" />
                        {track.title}
                        <span className="dash"> - </span>
                        <span onClick={(e) => e.stopPropagation()}>
                            <a href={`/artists/${track.artist_id}`}>
                                {artists.find(artist => artist.id === track.artist_id)?.name}
                            </a>
                        </span>
                    </li>
                ))}
            </ul>
            <div className="pages">
                <button onClick={handlePrev} disabled={page === 1}>{'<'}</button>
                <span> {page} </span>
                <button onClick={handleNext} disabled={tracks.length < limit}>{'>'}</button>
            </div>
        </>
    );
}

export default TracksList;