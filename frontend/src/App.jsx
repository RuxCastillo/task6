import Start from './Start';
import Username from './Username';
import Room from './Room';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppProvider } from './store/context';

function App() {
	return (
		<AppProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Username />} />
					<Route path="/start" element={<Start />} />
					<Route path="/room/" element={<Room />} />
				</Routes>
			</BrowserRouter>
		</AppProvider>
	);
}

export default App;
