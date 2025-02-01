const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Manejar las conexiones de los jugadores
let players = {};

let backgroundPosition = {posA: 0, posB: 0}

// Permitir conexiones desde el frontend con Vite
app.use(cors({ origin: "http://localhost:5173" }));

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('Nuevo jugador conectado: ' + socket.id);

    let playerId = socket.id;  // Socket.io asigna automáticamente un ID único a cada conexión

    // Enviar al nuevo jugador su ID
    socket.emit('setPlayerId', playerId);

    // Cuando un jugador se conecta, se le asigna una posición inicial
    players[socket.id] = { x: 100, y: 100, id: socket.id, directAnimated: 0, isFacingLeft: false };

    // Enviar la lista de jugadores conectados al nuevo jugador
    socket.emit('currentPlayers', players);

    // Notificar a otros jugadores sobre el nuevo jugador
    socket.broadcast.emit('newPlayer', { id: socket.id, x: 100, y: 100 });

    // Recibir movimiento de un jugador
    socket.on('playerMovement', (movementData) => {
        players[socket.id].x = movementData.x;
        players[socket.id].y = movementData.y;
        players[socket.id].directAnimated = movementData.directAnimated;
        players[socket.id].isFacingLeft = movementData.isFacingLeft;

        console.log(movementData.directAnimated)

        // Enviar la posición actualizada a todos los jugadores
        io.emit('playerMoved', { id: socket.id, x: players[socket.id].x, y: players[socket.id].y, directAnimated: players[socket.id].directAnimated, isFacingLeft: players[socket.id].isFacingLeft });
    });

    // Cuando un jugador se desconecta
    socket.on('disconnect', () => {
        console.log('Jugador desconectado: ' + socket.id);
        delete players[socket.id];
        io.emit('playerDisconnected', socket.id);
    });

    socket.on('mapsCords', (bP) => {
        backgroundPosition.posB = bP.backgroundBPosition;
        backgroundPosition.posA = bP.backgroundAPosition
    })

    socket.emit('mapCodsServer', backgroundPosition)
});

// Función para generar un color aleatorio para cada jugador


// Iniciar el servidor en el puerto 3000
server.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});