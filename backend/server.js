// server/server.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import env from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

env.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST'],
		allowedHeaders: ['Content-Type', 'Authorization'],
		credentials: true,
	},
});

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(express.static(path.join(__dirname, '../frontend/dist')));

/* const db = new pg.Pool({
	user: process.env.POSTGRES_USER,
	host: process.env.POSTGRES_HOST,
	database: process.env.POSTGRES_DATABASE,
	password: process.env.PGPASSWORD,
	port: process.env.POSTGRES_PORT,
	connectionTimeoutMillis: 20000,
	idleTimeoutMillis: 30000,
	max: 10,
	ssl: {
		rejectUnauthorized: false,
	},
});

db.connect().catch((err) =>
	console.error('Error de node a la base de datos', err)
); */
// Ruta para el backend
app.get('/api', (req, res) => {
	res.json({ message: 'Hello from Express!' });
});

// Ruta para manejar todas las peticiones y servir la SPA (single-page application)
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

io.on('connection', (socket) => {
	console.log('Usuario conectado');

	socket.on('message', (data) => {
		console.log(data);
		socket.broadcast.emit('message', data);
	});

	socket.on('disconnect', () => {
		console.log('Usuario desconectado');
	});
});

// Arrancar el servidor
server.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

export default app;
