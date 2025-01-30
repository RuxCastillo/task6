import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AppContext } from './store/context';

export default function Username() {
	const [username, setUsername] = useState('');
	const navigate = useNavigate();
	const { dispatch } = useContext(AppContext);

	function handleUsername(e) {
		setUsername(e.target.value);
	}

	function handleContinue() {
		dispatch({ type: 'setUsername', payload: username });
		navigate('/start');
	}

	return (
		<main className="flex justify-center items-center h-screen">
			<section className="border-2 border-solid border-gray-500 p-4 rounded shadow-lg flex flex-col justify-center items-center">
				<h1 className="mb-2">Please insert your username:</h1>
				<input
					type="text"
					value={username}
					onChange={handleUsername}
					className="outline-none border-b-2 border-solid border-gray-500 mb-4"
				/>
				<button
					className="bg-gray-200 rounded border-solid border-2 w-fit px-2 py-1"
					onClick={handleContinue}
				>
					Continue
				</button>
			</section>
		</main>
	);
}
