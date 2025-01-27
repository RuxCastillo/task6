import Start from './Start';
import Username from './Username';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Username />} />
				<Route path="/start" element={<Start />} />
				<Route path="/room/:username" element={<Room />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
