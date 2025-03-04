import { createContext, useReducer } from 'react';

const initialState = {
	username: '',
	rooms: {},
	currentRoom: null,
};

function reducer(state, action) {
	switch (action.type) {
		case 'setUsername':
			return { ...state, username: action.payload };
		case 'setRoom':
			return {
				...state,
				rooms: { ...state.rooms, ...action.payload },
			};
		case 'setCurrentRoom':
			console.log('setCurrentRoom', action.payload);
			return { ...state, currentRoom: action.payload };
		case 'updateSlide':
			console.log('desde el useREducer', state.currentRoom, action.payload);
			return {
				...state,
				rooms: { ...state.rooms, [state.currentRoom]: action.payload },
			};
		case 'reciboMessage':
			return {
				...state,
				rooms: {
					...state.rooms,
					...action.payload,
				},
			};
		default:
			return state;
	}
}

const AppContext = createContext();

function AppProvider({ children }) {
	const [state, dispatch] = useReducer(reducer, initialState);

	return (
		<AppContext.Provider value={{ state, dispatch }}>
			{children}
		</AppContext.Provider>
	);
}

export { AppContext, AppProvider };
