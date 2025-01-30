import React, { useState } from 'react';
import { Stage, Layer, Text, Group } from 'react-konva';

const Slide = ({ slideData, onUpdateSlide }) => {
	// Función para agregar un nuevo bloque de texto
	const addTextBlock = () => {
		const newTextBlock = {
			id: Date.now(), // ID único
			x: 50,
			y: 50,
			text: 'Nuevo texto',
			fontSize: 20,
			draggable: true,
		};
		const updatedTextBlocks = [...slideData.textBlocks, newTextBlock];
		onUpdateSlide({ textBlocks: updatedTextBlocks });
	};

	// Función para actualizar el texto de un bloque
	const handleTextChange = (id, newText) => {
		const updatedTextBlocks = slideData.textBlocks.map((block) =>
			block.id === id ? { ...block, text: newText } : block
		);
		onUpdateSlide({ textBlocks: updatedTextBlocks });
	};

	return (
		<div className="p-4 rounded shadow-lg border-solid border-2 border-gray-500">
			<button onClick={addTextBlock}>Agregar Texto</button>
			<Stage
				width={window.innerWidth * 0.7}
				height={window.innerHeight * 0.7}
				className="bg-gray-200"
			>
				<Layer>
					{slideData.textBlocks.map((block) => (
						<Group key={block.id} x={block.x} y={block.y} draggable>
							<Text
								text={block.text}
								fontSize={block.fontSize}
								onDblClick={(e) => {
									// Habilitar edición al hacer doble clic
									const textNode = e.target;
									textNode.hide(); // Ocultar el texto para mostrar un input
									const textPosition = textNode.absolutePosition();
									const input = document.createElement('input');
									input.value = textNode.text();
									input.style.position = 'absolute';
									input.style.top = `${textPosition.y}px`;
									input.style.left = `${textPosition.x}px`;
									input.style.width = `${textNode.width()}px`;
									document.body.appendChild(input);

									input.focus();
									input.onblur = () => {
										handleTextChange(block.id, input.value);
										textNode.text(input.value);
										textNode.show();
										document.body.removeChild(input);
									};
								}}
							/>
						</Group>
					))}
				</Layer>
			</Stage>
		</div>
	);
};

export default Slide;
