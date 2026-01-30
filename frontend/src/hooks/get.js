import { useState, useEffect } from 'react';

export function getUsers() {
	const [users, setUsers] = useState([]);
	useEffect(() => {
		const fetchUsers = async () => {
			const res = await fetch('/api/users');
			const data = await res.json();
			setUsers(data);
		};
		fetchUsers();
	}, []);
	return users;
}

export function getTracks({q, genre_id, artist_id, year, offset = 0, limit = 10} = {}) {
	const [tracks, setTracks] = useState([]);
	useEffect(() => {
		const params = new URLSearchParams();
		if (q) params.append('q', q);
		if (genre_id) params.append('genre_id', genre_id);
		if (artist_id) params.append('artist_id', artist_id);
		if (year) params.append('year', year);
		params.append('offset', offset);
		params.append('limit', limit);

		const fetchTracks = async () => {
			const res = await fetch(`/api/tracks?${params.toString()}`);
			const data = await res.json();
			setTracks(data);
		};
		fetchTracks();
	}, [q, genre_id, artist_id, year, offset, limit]);
	return tracks;
}

export function getTrackById(trackId) {
	const [track, setTrack] = useState(null);
	useEffect(() => {
		const fetchTrack = async () => {
			const res = await fetch(`/api/tracks/${trackId}`);
			const data = await res.json();
			setTrack(data);
		};
		fetchTrack();
	}, [trackId]);
	return track;
}

export function getPlaylists() {
	const [playlists, setPlaylists] = useState([]);
	useEffect(() => {
		const fetchPlaylists = async () => {
			const res = await fetch('/api/playlists');
			const data = await res.json();
			setPlaylists(data);
		};
		fetchPlaylists();
	}, []);
	return playlists;
}

export function getPlaylistById(playlistId) {
	const [playlist, setPlaylist] = useState(null);
	useEffect(() => {
		const fetchPlaylist = async () => {
			const res = await fetch(`/api/playlists/${playlistId}`);
			const data = await res.json();
			setPlaylist(data);
		};
		fetchPlaylist();
	}, [playlistId]);
	return playlist;
}

export function getPlaylistTracks(playlistId) {
	const [tracks, setTracks] = useState([]);
	useEffect(() => {
		const fetchPlaylistTracks = async () => {
			const res = await fetch(`/api/playlists/${playlistId}/tracks`);
			const data = await res.json();
			setTracks(data);
		};
		fetchPlaylistTracks();
	}, [playlistId]);
	return tracks;
}

export function getFirstPlaylistTrack(playlistId) {
	const [track, setTrack] = useState(null);
	useEffect(() => {
		const fetchFirstTrack = async () => {
			const res = await fetch(`/api/playlists/${playlistId}/tracks`);
			const data = await res.json();
			if (data.length > 0) {
				data.sort((a, b) => a.position - b.position);
				const firstTrackId = data[0].track_id;
				const trackRes = await fetch(`/api/tracks/${firstTrackId}`);
				const trackData = await trackRes.json();
				setTrack(trackData);
			} else {
				setTrack(null);
			}
		};
		fetchFirstTrack();
	}, [playlistId]);
	return track;
}

export function getArtists() {
	const [artists, setArtists] = useState([]);
	useEffect(() => {
		const fetchArtists = async () => {
			const res = await fetch('/api/artists');
			const data = await res.json();
			setArtists(data);
		};
		fetchArtists();
	}, []);
	return artists;
}

export function getGenres() {
	const [genres, setGenres] = useState([]);
	useEffect(() => {
		const fetchGenres = async () => {
			const res = await fetch('/api/genres');
			const data = await res.json();
			setGenres(data);
		};
		fetchGenres();
	}, []);
	return genres;
}

export function getAlbums() {
	const [albums, setAlbums] = useState([]);
	useEffect(() => {
		const fetchAlbums = async () => {
			const res = await fetch('/api/albums');
			const data = await res.json();
			setAlbums(data);
		};
		fetchAlbums();
	}, []);
	return albums;
}
