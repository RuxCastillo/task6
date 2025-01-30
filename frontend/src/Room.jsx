import Slide from './Slide';
import { useState } from 'react';

export default function Room() {
	const [slides, setSlides] = useState([
		{ title: 'slide1', textBlocks: [] },
		{ title: 'slide2', textBlocks: [] },
	]);

	const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

	function handleUpdateSlide(updateData) {
		const updatedSlides = slides.map((slide, index) =>
			index === currentSlideIndex ? { ...slide, ...updateData } : slide
		);
		setSlides(updatedSlides);
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

	return (
		<main className="flex items-center h-screen justify-around">
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
				<Slide
					slideData={slides[currentSlideIndex]}
					onUpdateSlide={handleUpdateSlide}
				/>
			</section>
			<section>users</section>
		</main>
	);
}
