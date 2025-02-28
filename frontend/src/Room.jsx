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
	console.log('room: ', room);

	const [slides, setSlides] = useState([
		{
			slide: 'slide2',
			textBlocks: [],
		},
	]);
	const navigate = useNavigate();

	if (state.username === '') {
		navigate('/');
	}

	const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

	useEffect(() => {
		socket.on('connect', () => {
			console.log('Connected to server');
		});
		socket.on('message', (data) => {
			console.log(data);
			setSlides(data);
		});

		return () => {
			socket.off('connect');
			socket.off('message');
		};
	}, []);

	function handleUpdateSlide(updateData) {
		const updatedSlides = state.rooms[room].map((slide, index) =>
			index === currentSlideIndex ? { ...slide, ...updateData } : slide
		);
		console.log(updatedSlides);
		dispatch({ type: 'updateSlide', payload: updatedSlides });
		setSlides(updatedSlides);
		setTimeout(() => {
			console.log(state.rooms[room]);
		}, 2000);
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
		setSlides([...slides, newSlide]);
	}

	function deleteSlide(index) {
		console.log(index, 'index');
		const updatedSlides = state.rooms[room].filter((_, i) => i !== index);
		dispatch({ type: 'updateSlide', payload: updatedSlides });
		setSlides(updatedSlides);
		if (currentSlideIndex >= updatedSlides.length) {
			setCurrentSlideIndex(updatedSlides.length - 1);
		}
	}

	function selectSlide(index) {
		setCurrentSlideIndex(index);
		console.log(slides);
	}

	function handleClickInicio() {
		navigate('/start');
	}

	console.log(state.rooms[room]);

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
			<section>users</section>
		</main>
	);
}
