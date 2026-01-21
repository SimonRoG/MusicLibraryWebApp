import React from 'react'
import './App.css'

function App() {
	const [message, setMessage] = React.useState('')

	React.useEffect(() => {
		fetch('/api/message')
			.then(res => res.json())
			.then(message => setMessage(message.message))
			.catch(err => console.error(err))
	}, [])

	return (
		<>
			<p>{message}</p>
		</>
	)
}

export default App
