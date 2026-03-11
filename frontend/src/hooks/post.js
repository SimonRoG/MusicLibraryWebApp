/* eslint-disable react-hooks/rules-of-hooks */

const fetchWithAuth = (url, options = {}) => {
	const token = localStorage.getItem('token');
	const headers = { ...options.headers };
	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}
	const f = window.fetch;
	return f(url, { ...options, headers });
};

export const uploadFileData = async (file) => {
	const formData = new FormData();
	formData.append('file', file);
	const res = await fetchWithAuth('/api/upload', {
		method: 'POST',
		body: formData,
	});
	return await res.json();
};

export const createArtistData = async (name) => {
	const res = await fetchWithAuth('/api/artists', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ name })
	});
	return await res.json();
};

export const createAlbumData = async (title, artist_id) => {
	const res = await fetchWithAuth('/api/albums', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ title, artist_id })
	});
	return await res.json();
};

export const createTrackData = async (payload) => {
	const res = await fetchWithAuth('/api/tracks', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload)
	});
	return await res.json();
};