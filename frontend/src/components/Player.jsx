import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAlbums, getArtists, getGenres } from '../hooks/get.js';
import './styles/Player.css';

function Player({ track, onNext, onPrev, hasNext, hasPrev }) {
	const audioRef = useRef(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [showInfo, setShowInfo] = useState(false);
	const albums = getAlbums();
	const artists = getArtists();
	const genres = getGenres();

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		const onPlay = () => setIsPlaying(true);
		const onPause = () => setIsPlaying(false);
		const onTimeUpdate = () => setCurrentTime(audio.currentTime);
		const onLoadedMetadata = () => setDuration(audio.duration);

		audio.addEventListener('play', onPlay);
		audio.addEventListener('pause', onPause);
		audio.addEventListener('timeupdate', onTimeUpdate);
		audio.addEventListener('loadedmetadata', onLoadedMetadata);

		return () => {
			audio.removeEventListener('play', onPlay);
			audio.removeEventListener('pause', onPause);
			audio.removeEventListener('timeupdate', onTimeUpdate);
			audio.removeEventListener('loadedmetadata', onLoadedMetadata);
		};
	}, []);

	useEffect(() => {
		if (track && audioRef.current) {
			audioRef.current.load();
			audioRef.current.play().catch(error => {
				console.error("Autoplay prevents automatic playback without interaction.", error);
			});
		}
	}, [track]);

	const handleSeek = (e) => {
		const newTime = Number(e.target.value);
		audioRef.current.currentTime = newTime;
		setCurrentTime(newTime);
	};

	const formatTime = (seconds) => {
		if (!seconds) return "0:00";
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
	};

	if (!track) return null;

	const album = albums.find(a => a.id === track.album_id);
	const artist = artists.find(a => a.id === track.artist_id);
	const genre = genres.find(g => g.id === track.genre_id);

	return (
		<div className="player-wrapper">
			{showInfo && (
				<div className="info-dropdown">
					{album?.cover_image && (
						<img src={`/${album.cover_image}`} alt={track.title} className="large-cover" />
					)}
					<div className="dropdown-details">
						<h2>{track.title}</h2>
						<p><Link to={`/artists/${artist?.id}`}>{artist?.name || 'Unknown Artist'}</Link></p>
						<p><Link to={`/albums/${album?.id}`}>{album?.title || 'Unknown Album'}</Link></p>
						{genre && <p>{genre.name}</p>}
					</div>
				</div>
			)}
			<div className="player">
				<div className="info" onClick={() => setShowInfo(!showInfo)}>
					{album?.cover_image && (
						<img
							src={`/${album.cover_image}`}
							alt={track.title}
						/>
					)}
					<div className="details">
						<span className="title">{track.title}</span>
						<span className="artist">{artist?.name}</span>
					</div>
				</div>
				<div className="controls">
					<button className="ctrl-btn" onClick={onPrev} disabled={!hasPrev}>{'⏮️'}</button>
					<button className="ctrl-btn" onClick={() => isPlaying ? audioRef.current.pause() : audioRef.current.play()}>
						{isPlaying ? '⏸️' : '▶️'}
					</button>
					<button className="ctrl-btn" onClick={onNext} disabled={!hasNext}>{'⏭️'}</button>
					<input
						className="seek-slider"
						type="range"
						min={0}
						max={duration || 0}
						value={currentTime}
						onChange={handleSeek}
					/>
					<span className="time">{formatTime(currentTime)}</span>
					<span>/</span>
					<span className="time">{formatTime(duration)}</span>
					<audio ref={audioRef} autoPlay onEnded={hasNext ? onNext : undefined}>
						<source src={`/${track.audio_file}`} type="audio/mpeg" />
					</audio>
				</div>
				<div className="spacer"></div>
			</div>
		</div>
	);
}

export default Player;
