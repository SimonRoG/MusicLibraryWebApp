import React, { useState } from 'react';
import { getSavedItems } from '../hooks/get.js';
import { toggleSave } from '../hooks/set.js';
import '../styles/Lists.css';

function SaveButton({ itemType, itemId }) {
	const savedItems = getSavedItems();
	const token = localStorage.getItem('token');
	const key = `${itemType}_id`;

	const isSavedRemote = savedItems.some(item => item[key] === itemId);
	
	const [isSavedLocal, setIsSavedLocal] = useState(isSavedRemote);

	const [prevRemote, setPrevRemote] = useState(isSavedRemote);
	if (isSavedRemote !== prevRemote) {
		setPrevRemote(isSavedRemote);
		setIsSavedLocal(isSavedRemote);
	}

	if (!token) return null;

	const handleToggle = async (e) => {
		e.stopPropagation();
		e.preventDefault();

		const payload = {};
		payload[key] = itemId;
		
		setIsSavedLocal(!isSavedLocal);
		
		await toggleSave(payload, isSavedLocal);
	};

	return (
		<button
			onClick={handleToggle}
			className={`save-btn ${isSavedLocal ? 'saved' : ''}`}
			title={isSavedLocal ? "Unsave" : "Save"}
		>
			{isSavedLocal ? '♥' : '♡'}
		</button>
	);
}

export default SaveButton;
