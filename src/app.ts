import cors from 'cors';
import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { FRONTEND_URL } from './constants/global.constants';

const PORT_NUMBER = 5000;

const corsSettings = {
	origin: [ FRONTEND_URL ],
	credentials: true
};

async function startServer() {
	const app = express();

	app.use(
		cors(
			corsSettings
		)
	);

	const server = http.createServer(app);
	const io = new Server(server, {
		cors: corsSettings
	});

	app.get('/', (_req, res) => {
		res.json('ime_sobe').status(200);
	});

	io.on('connection', (socket: Socket) => {
		console.log('someone connected');

		socket.on('join-room', (roomId, userId) => {
			socket.join(roomId);
			socket
				.broadcast
				.to(roomId)
				.emit('user-connected', userId);
		});
	});

	server.listen(PORT_NUMBER, () => {
		console.log(`Server started on port ${PORT_NUMBER}.`);
	});
}

startServer();
