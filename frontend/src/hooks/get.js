/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from 'react';

const fetchWithAuth = (url, options = {}) => {
	const token = localStorage.getItem('token');
	const headers = { ...options.headers };
	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}
	const f = window.fetch;
	return f(url, { ...options, headers });
};

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

export function getUser(token) {
	const [user, setUser] = useState(null);

	useEffect(() => {
		if (!token) return;

		const fetchUser = async () => {
			const res = await fetchWithAuth('/api/users/me');
			const data = await res.json();
			setUser(data);
		};
		fetchUser();
	}, [token]);

	return user;
}

export const fetchTracksData = async ({ q, genre_id, artist_id, album_id, year, offset = 0, limit = 10 } = {}) => {
	const params = new URLSearchParams();
	if (q) params.append('q', q);
	if (genre_id) params.append('genre_id', genre_id);
	if (artist_id) params.append('artist_id', artist_id);
	if (album_id) params.append('album_id', album_id);
	if (year) params.append('year', year);
	params.append('offset', offset);
	params.append('limit', limit);

	const res = await fetch(`/api/tracks?${params.toString()}`);
	return await res.json();
};

export function getTracks({ q, genre_id, artist_id, album_id, year, offset = 0, limit = 10 } = {}) {
	const [tracks, setTracks] = useState([]);
	useEffect(() => {
		const fetchTracks = async () => {
			const data = await fetchTracksData({ q, genre_id, artist_id, album_id, year, offset, limit });
			setTracks(data);
		};
		fetchTracks();
	}, [q, genre_id, artist_id, album_id, year, offset, limit]);
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
			const res = await fetchWithAuth('/api/playlists');
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
			const res = await fetchWithAuth(`/api/playlists/${playlistId}`);
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
			const res = await fetchWithAuth(`/api/playlists/${playlistId}/tracks`);
			const data = await res.json();
			if (!Array.isArray(data)) {
				setTracks(data);
				return;
			}
			const trackPromises = data.map(pt => fetchWithAuth(`/api/tracks/${pt.track_id}`).then(r => r.json()));
			const detailedTracks = await Promise.all(trackPromises);
			setTracks(detailedTracks);
		};
		fetchPlaylistTracks();
	}, [playlistId]);
	return tracks;
}

export function getFirstPlaylistTrack(playlistId) {
	const [track, setTrack] = useState(null);
	useEffect(() => {
		const fetchFirstTrack = async () => {
			const res = await fetchWithAuth(`/api/playlists/${playlistId}/tracks`);
			const data = await res.json();
			if (data.length > 0) {
				data.sort((a, b) => a.position - b.position);
				const firstTrackId = data[0].track_id;
				const trackRes = await fetchWithAuth(`/api/tracks/${firstTrackId}`);
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

export function getArtistById(artistId) {
	const [artist, setArtist] = useState(null);
	useEffect(() => {
		const fetchArtist = async () => {
			if (!artistId) return;
			const res = await fetch(`/api/artists/${artistId}`);
			if (res.ok) {
				const data = await res.json();
				setArtist(data);
			}
		};
		fetchArtist();
	}, [artistId]);
	return artist;
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

export function getAlbumById(albumId) {
	const [album, setAlbum] = useState(null);
	useEffect(() => {
		const fetchAlbum = async () => {
			if (!albumId) return;
			const res = await fetch(`/api/albums/${albumId}`);
			if (res.ok) {
				const data = await res.json();
				setAlbum(data);
			}
		};
		fetchAlbum();
	}, [albumId]);
	return album;
}

export function getAlbums({ artist_id } = {}) {
	const [albums, setAlbums] = useState([]);
	useEffect(() => {
		const fetchAlbums = async () => {
			const params = new URLSearchParams();
			if (artist_id) params.append('artist_id', artist_id);
			const res = await fetch(`/api/albums?${params.toString()}`);
			const data = await res.json();
			setAlbums(data);
		};
		fetchAlbums();
	}, [artist_id]);
	return albums;
}

export function getSavedItems() {
	const [savedItems, setSavedItems] = useState([]);
	useEffect(() => {
		const fetchSavedItems = async () => {
			const res = await fetchWithAuth('/api/saved');
			const data = await res.json();
			setSavedItems(Array.isArray(data) ? data : []);
		};
		fetchSavedItems();
	}, []);
	return savedItems;
}