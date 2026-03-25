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

export const createArtistData = async (name, description) => {
	const res = await fetchWithAuth('/api/artists', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ name, description })
	});
	const data = await res.json();
	if (data && data.id) await toggleSave({ artist_id: data.id }, false);
	return data;
};

export const updateArtistData = async (id, payload) => {
	const res = await fetchWithAuth(`/api/artists/${id}`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload)
	});
	return await res.json();
};

export const createAlbumData = async (title, artist_id, release_year = null, cover_image = null) => {
	const res = await fetchWithAuth('/api/albums', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ title, artist_id, release_year, cover_image })
	});
	const data = await res.json();
	if (data && data.id) await toggleSave({ album_id: data.id }, false);
	return data;
};

export const createTrackData = async (payload) => {
	const res = await fetchWithAuth('/api/tracks', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload)
	});
	const data = await res.json();
	if (data && data.id) await toggleSave({ track_id: data.id }, false);
	return data;
};

export const updateTrackData = async (id, payload) => {
	const res = await fetchWithAuth(`/api/tracks/${id}`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload)
	});
	return await res.json();
};

export const createPlaylistData = async (name, user_id) => {
	const res = await fetchWithAuth('/api/playlists', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ name, user_id })
	});
	return await res.json();
};

export const addTrackToPlaylistData = async (playlistId, trackId) => {
	const res = await fetchWithAuth(`/api/playlists/${playlistId}/tracks/${trackId}`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({})
	});
	return await res.json();
};

export const removeTrackFromPlaylistData = async (playlistId, trackId) => {
	const res = await fetchWithAuth(`/api/playlists/${playlistId}/tracks/${trackId}`, {
		method: 'DELETE'
	});
	return await res.json();
};

export const toggleSave = async (payload, isSaved) => {
	try {
		const url = '/api/saved';
		const method = isSaved ? 'DELETE' : 'POST';
		await fetchWithAuth(url, {
			method,
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload)
		});
	} catch (e) {
		console.error("Error toggling save:", e);
	}
};