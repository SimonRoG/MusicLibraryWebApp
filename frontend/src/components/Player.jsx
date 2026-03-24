import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAlbums, getArtists, getGenres, getUser } from '../hooks/get.js';
import '../styles/Player.css';
import EditTrack from './tracks/EditTrack.jsx';

function Player({ track, token, onNext, onPrev, hasNext, hasPrev, mixEnabled, onToggleMix }) {
	const audioRef = useRef(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [showInfo, setShowInfo] = useState(false);
	const [showEdit, setShowEdit] = useState(false);
	const albums = getAlbums();
	const artists = getArtists();
	const genres = getGenres();

	const user = getUser(token);

	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		const onPlay = () => setIsPlaying(true);
		const onPause = () => setIsPlaying(false);
		const onTimeUpdate = () => setCurrentTime(audio.currentTime);
		const onLoadedMetadata = () => setDuration(audio.duration || 0);
		const onDurationChange = () => setDuration(audio.duration || 0);

		audio.addEventListener('play', onPlay);
		audio.addEventListener('pause', onPause);
		audio.addEventListener('timeupdate', onTimeUpdate);
		audio.addEventListener('loadedmetadata', onLoadedMetadata);
		audio.addEventListener('durationchange', onDurationChange);

		return () => {
			audio.removeEventListener('play', onPlay);
			audio.removeEventListener('pause', onPause);
			audio.removeEventListener('timeupdate', onTimeUpdate);
			audio.removeEventListener('loadedmetadata', onLoadedMetadata);
			audio.removeEventListener('durationchange', onDurationChange);
		};
	}, []);

	useEffect(() => {
		if (!track || !audioRef.current) return;

		audioRef.current.load();
		const playPromise = audioRef.current.play();
		if (playPromise !== undefined) {
			playPromise.catch(error => {
				if (error.name !== 'AbortError') {
					console.error('Error playing audio:', error);
				}
			});
		}
	}, [track]);

	const handleSeek = (e) => {
		if (!audioRef.current) return;
		const newTime = Number(e.target.value);
		audioRef.current.currentTime = newTime;
		setCurrentTime(newTime);
	};

	const handleLoadStart = () => {
		setCurrentTime(0);
		setDuration(0);
	};

	const togglePlayback = async () => {
		const audio = audioRef.current;
		if (!audio) return;

		if (isPlaying) {
			audio.pause();
			return;
		}

		try {
			await audio.play();
		} catch (error) {
			if (error.name !== 'AbortError') {
				console.error('Error playing audio:', error);
			}
		}
	};

	const handlePrevClick = () => {
		const audio = audioRef.current;
		if (!audio) return;

		if (audio.currentTime > 3) {
			audio.currentTime = 0;
			setCurrentTime(0);
			return;
		}

		onPrev();
	};

	const formatTime = (seconds) => {
		if (!seconds || Number.isNaN(seconds)) return '0:00';
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
					<button className="close-btn" onClick={() => setShowInfo(false)}>✕</button>
					{album?.cover_image && (
						<img src={`/${album.cover_image}`} alt={track.title} className="large-cover" />
					)}
					<div className="dropdown-details">
						<h2>{track.title}</h2>
						<p><Link to={`/artists/${artist?.id}`}>{artist?.name || 'Unknown Artist'}</Link></p>
						<p><Link to={`/albums/${album?.id}`}>{album?.title || 'Unknown Album'}</Link></p>
						{genre && <p>{genre.name}</p>}
						{user && user.id === track.owner_id && (
							<button onClick={() => setShowEdit(true)}>Edit</button>
						)}
					</div>
				</div>
			)}
			{showEdit && (
				<EditTrack
					token={token}
					track={track}
					onClose={() => setShowEdit(false)}
				/>
			)}
			<div className="player">
				<button className="info" onClick={() => setShowInfo(open => !open)}>
					<div className="cover-frame">
						{album?.cover_image && (
							<img src={`/${album.cover_image}`} alt={track.title} />
						)}
					</div>
					<div className="details">
						<span className="title">{track.title}</span>
						<span className="artist">{artist?.name}</span>
					</div>
				</button>
				<div className="controls">
					<div className="transport-row">
						<button
							type="button"
							className={`ctrl-btn toggle-btn ${mixEnabled ? 'is-active' : ''}`}
							onClick={onToggleMix}
						>
							{'🔀'}
						</button>
						<button className="ctrl-btn" onClick={handlePrevClick} disabled={!hasPrev && currentTime <= 3}>
							{'⏮️'}
						</button>
						<button className="ctrl-btn play-btn" onClick={togglePlayback}>
							{isPlaying ? '⏸️' : '▶️'}
						</button>
						<button className="ctrl-btn" onClick={onNext} disabled={!hasNext}>
							{'⏭️'}
						</button>
					</div>
					<div className="progress-row">
						<span className="time">{formatTime(currentTime)}</span>
						<input
							className="seek-slider"
							type="range"
							min={0}
							max={duration || 0}
							step={1}
							value={Math.min(currentTime, duration || 0)}
							onChange={handleSeek}
						/>
						<span className="time">{formatTime(duration)}</span>
					</div>
				</div>
				<audio ref={audioRef} autoPlay onLoadStart={handleLoadStart} onEnded={hasNext ? onNext : undefined}>
					<source src={`/${track.audio_file}`} type="audio/mpeg" />
				</audio>
			</div>
		</div>
	);
}

export default Player;
