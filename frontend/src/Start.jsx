import { useNavigate } from 'react-router-dom';
import { AppContext } from './store/context';
import { useContext } from 'react';

export default function Start() {
	const navigate = useNavigate();
	const { state, dispatch } = useContext(AppContext);

	function handleCreateRoom() {
		dispatch({ type: 'setRoom', payload: state.username });
		navigate('/room');
	}

	console.log(state);

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
				<button className="px-2 py-1 border-2 border-solid border-black rounded mr-10">
					Refresh
				</button>
			</div>
			<div>
				<ul className="ml-10">
					Active Rooms
					{state.rooms.map((room) => (
						<li key={room}>{room}</li>
					))}
					<li>1 la primera</li>
					<li>2 la segunda</li>
				</ul>
			</div>
		</main>
	);
}
