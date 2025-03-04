import Slide from './Slide';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { AppContext } from './store/context';
import { useContext } from 'react';

const socket = io('http://localhost:3000');

export default function Room() {
	const { state, dispatch } = useContext(AppContext);
	const { room } = useParams();
	const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
	const navigate = useNavigate();
	const [flag, setFlag] = useState(true);

	if (state.username === '') {
		navigate('/');
	}

	useEffect(() => {
		socket.on('connect', () => {
			console.log('Connected to server from room.jsx');
		});
		socket.on('message', (data) => {
			console.log('mensaje recibido socket on message', data);
			dispatch({ type: 'reciboMessage', payload: data });
		});

		return () => {
			socket.off('connect');
			socket.off('message');
		};
	}, []);

	useEffect(() => {
		if (flag) {
			socket.emit('message', state.rooms);
			setFlag(false);
		}
	}, [state.rooms]);

	function handleUpdateSlide(updateData) {
		const updatedSlides = state.rooms[room].map((slide, index) =>
			index === currentSlideIndex ? { ...slide, ...updateData } : slide
		);
		console.log(updatedSlides);
		dispatch({ type: 'updateSlide', payload: updatedSlides });
		setFlag(true);
	}

	function addSlide() {
		const newSlide = {
			title: `Slide ${state.rooms[room].length + 1}`,
			textBlocks: [],
		};
		dispatch({
			type: 'updateSlide',
			payload: [...state.rooms[room], newSlide],
		});
	}

	function deleteSlide(index) {
		console.log(index, 'index');
		const updatedSlides = state.rooms[room].filter((_, i) => i !== index);
		dispatch({ type: 'updateSlide', payload: updatedSlides });
		if (currentSlideIndex >= updatedSlides.length) {
			setCurrentSlideIndex(updatedSlides.length - 1);
		}
	}

	function selectSlide(index) {
		setCurrentSlideIndex(index);
	}

	function handleClickInicio() {
		navigate('/start');
	}

	return (
		<main className="flex items-center h-screen justify-around">
			<h1 className="absolute top-4 left-4" onClick={handleClickInicio}>
				Ir al inicio
			</h1>
			<section>
				<ul>
					{state.rooms[room] &&
						state.rooms[room].map((slide, index) => (
							<li key={index}>
								<button onClick={() => selectSlide(index)}>
									{slide.title}
								</button>
								<button onClick={() => deleteSlide(index)}>🗑️</button>
							</li>
						))}
				</ul>
				<button onClick={addSlide}>+ Add Slide</button>
			</section>
			<section>
				{state.rooms[room] &&
					state.rooms[room].map((slide, index) => {
						if (index !== currentSlideIndex) return null;
						return (
							<Slide
								key={index}
								slideData={state.rooms[room][index]}
								onUpdateSlide={handleUpdateSlide}
							/>
						);
					})}
			</section>
			<section>
				users
				{room === state.username && <button>eliminar room</button>}
			</section>
		</main>
	);
}
