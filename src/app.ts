import cors from 'cors';
import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';

const corsSettings = {
	origin: [
		'http://localhost:3000',
		'https://e9ceca6fc36e.ngrok.io'
	],
	credentials: true
};

async function startServer() {
	const app = express();

	app.use(cors(corsSettings));

	const server = http.createServer(app);
	const io = new Server(server, {
		cors: corsSettings
	});

	app.get('/', (req, res) => {
		res.json('ime_sobe').status(200);
	});

	io.on('connection', (socket: Socket) => {
		socket.on('join-room', (roomId, userId) => {
			socket.join(roomId);
			console.log({ roomId, userId });
			socket
				.broadcast
				.to(roomId)
				.emit('user-connected', userId);
		});
	});

	server.listen(5000, () => {
		console.log('server started 2');
	});
}

startServer();
