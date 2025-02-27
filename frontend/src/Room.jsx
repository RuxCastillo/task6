import Slide from './Slide';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

export default function Room() {
	const [slides, setSlides] = useState([
		{ title: 'slide1', textBlocks: [] },
		{ title: 'slide2', textBlocks: [] },
	]);
	const navigate = useNavigate();

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
		const updatedSlides = slides.map((slide, index) =>
			index === currentSlideIndex ? { ...slide, ...updateData } : slide
		);
		setSlides(updatedSlides);
		socket.emit('message', updatedSlides);
		console.log(slides);
	}

	function addSlide() {
		const newSlide = { title: `Slide ${slides.length + 1}`, textBlocks: [] };
		setSlides([...slides, newSlide]);
		setCurrentSlideIndex(slides.length);
	}

	function deleteSlide(index) {
		const updatedSlides = slides.filter((_, i) => i !== index);
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

	return (
		<main className="flex items-center h-screen justify-around">
			<h1 className="absolute top-4 left-4" onClick={handleClickInicio}>
				Ir al inicio
			</h1>
			<section>
				<ul>
					{slides.map((slide, index) => (
						<li key={index}>
							<button onClick={() => selectSlide(index)}>{slide.title}</button>
							<button onClick={() => deleteSlide(index)}>🗑️</button>
						</li>
					))}
				</ul>
				<button onClick={addSlide}>+ Add Slide</button>
			</section>
			<section>
				{slides.map((slide, index) => {
					if (index !== currentSlideIndex) return null;
					return (
						<Slide
							key={index}
							slideData={slide}
							onUpdateSlide={handleUpdateSlide}
						/>
					);
				})}
			</section>
			<section>users</section>
		</main>
	);
}
