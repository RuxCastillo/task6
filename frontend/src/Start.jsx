import { useNavigate } from 'react-router-dom';
import { AppContext } from './store/context';
import { useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

export default function Start() {
	const navigate = useNavigate();
	const { state, dispatch } = useContext(AppContext);
	const [slides, setSlides] = useState({});

	function handleCreateRoom() {
		dispatch({ type: 'setCurrentRoom', payload: state.username });
		dispatch({
			type: 'setRoom',
			payload: { [state.username]: [{ title: 'slide1', textBlocks: [] }] },
		});
		navigate(`/room/${state.username}`);
	}

	function joinRoom(username) {
		console.log('antes del dispatch');
		dispatch({ type: 'setCurrentRoom', payload: username });
		navigate(`/room/${username}`);
	}

	if (state.username === '') {
		navigate('/');
	}

	useEffect(() => {
		socket.on('connect', (data) => {
			console.log('Connected to server fron start.jsx');
			dispatch({ type: 'reciboMessage', payload: data });
		});
		socket.on('message', (data) => {
			console.log('esta es la data del message', data);
			dispatch({ type: 'reciboMessage', payload: data });
			setSlides(data);
		});
		socket.on('participants', (data) => {
			console.log('esta es la data del participants', data);
			dispatch({ type: 'reciboMessage', payload: data });
		});
		socket.emit('participants');

		return () => {
			socket.off('connect');
		};
	}, []);

	function refresh() {
		socket.emit('participants');
	}

	console.log(state);

	const arrayRooms = Object.keys(state.rooms);

	return (
		<main>
			<div>
				<h1 className="text-center p-2 text-xl bold mb-10">
					Collaborative presentation Software
				</h1>
				<p className="ml-5">Welcome: {state.username}</p>
			</div>
			<div className="flex">
				<button
					className="px-2 py-1 border-2 border-solid border-black rounded ml-auto mr-5"
					onClick={handleCreateRoom}
				>
					Create room
				</button>
				<button
					className="px-2 py-1 border-2 border-solid border-black rounded mr-10"
					onClick={refresh}
				>
					Refresh
				</button>
			</div>
			<div>
				<ul className="ml-10">
					Active Rooms
					{arrayRooms.map((room) => (
						<li key={room} onClick={() => joinRoom(room)}>
							{room}
						</li>
					))}
					<li>1 la primera</li>
					<li>2 la segunda</li>
				</ul>
			</div>
		</main>
	);
}
