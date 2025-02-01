import { io } from "https://cdn.socket.io/4.7.2/socket.io.esm.min.js";

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const socket = io("http://localhost:3000"); // Conectar al backend

// VARIABLES
canvas.width = 224 * 3;
canvas.height = 224 * 3;

let playerSpeed = 5;
let movingLeft = false;
let movingRight = false;
let movingUp = false;
let movingDown = false;
let isFacingLeft = true;

let maxY = 220;
let controlAnimated = 0;


const spriteIdle = new Image();
spriteIdle.src = "./src/assets/images/axe_idle_walk.png";

const spriteWalk = new Image();
spriteWalk.src = "./src/assets/images/axe_walk.png";

const sprites = [spriteIdle, spriteWalk];

const backgroundA = new Image();
backgroundA.src = "./src/assets/images/maps.jpg";
const backgroundB = new Image();
backgroundB.src = "./src/assets/images/maps.jpg";

let backgroundHeightOriginal = backgroundA.height;
let backgroundWidthOriginal = backgroundA.width;
let backgroundHeight = canvas.height;
let backgroundWidth = Math.trunc((backgroundHeight / backgroundHeightOriginal) * backgroundWidthOriginal);

let positionPlayerX = 100;
let positionPlayerY = 280;
const playerWidth = 48;
const playerHeight = 81;

let frameIndex = 4;
const totalFrames = 4;
const frameSpeed = 6;
let frameCounter = 0;

let backgroundAPosition = 0;
let backgroundBPosition = backgroundWidth;

// ----------------SOCKETS---------------------------------
// Variables del jugador
let player = {
    id: null,
    x: positionPlayerX,
    y: positionPlayerY,
    speed: playerSpeed,
};

let bP = {posA: 0, posB: 0}

// Variables de los demás jugadores
let players = {};

// Al recibir el ID del jugador
socket.on('setPlayerId', (id) => {
    player.id = id;  // Guarda el ID del jugador en una variable local
});

// Escuchar eventos del servidor
socket.on('currentPlayers', (serverPlayers) => {
    players = serverPlayers;
});

socket.on('newPlayer', (newPlayer) => {
    players[newPlayer.id] = newPlayer;
});

socket.on('playerMoved', (playerData) => {
    if (players[playerData.id]) {
        players[playerData.id].x = playerData.x;
        players[playerData.id].y = playerData.y;
        players[playerData.id].directAnimated = playerData.directAnimated
        players[playerData.id].isFacingLeft = playerData.isFacingLeft

    }
});

socket.on('playerDisconnected', (playerId) => {
    delete players[playerId];
});


socket.on('mapCodsServer', (bpS) => {
    bP.posA = bpS.posA
    bP.posB = bpS.posB
});

// Enviar movimiento del jugador al servidor
function sendPlayerMovement() {
    socket.emit('mapsCords', {backgroundAPosition: backgroundAPosition, backgroundBPosition: backgroundBPosition})
    socket.emit('playerMovement', { x: positionPlayerX, y: positionPlayerY, directAnimated: controlAnimated, isFacingLeft: isFacingLeft });
}

// Detectar cuando una tecla es presionada
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
        movingRight = true;
    }
    else if (e.key === "ArrowLeft") {
        movingLeft = true;
    }
    else if (e.key === "ArrowUp") {
        movingUp = true;
    }
    else if (e.key === "ArrowDown") {
        movingDown = true;
    }
});

// Detectar cuando una tecla es liberada
document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowRight") {
        movingRight = false;
    }
    if (e.key === "ArrowLeft") {
        movingLeft = false;
    }
    if (e.key === "ArrowUp") {
        movingUp = false;
    }
    if (e.key === "ArrowDown") {
        movingDown = false;
    }
});

// Actualización principal del juego
function update() {
    frameCounter++;
    if (frameCounter >= frameSpeed) {
        frameIndex = (frameIndex + 1) % totalFrames;
        frameCounter = 0;
    }

    if (movingRight && positionPlayerX + playerWidth < canvas.width * 0.75) {
        positionPlayerX += playerSpeed;
        isFacingLeft = true;
    }
    if (movingLeft && positionPlayerX > 0) {
        positionPlayerX -= playerSpeed;
        isFacingLeft = false;
    }

    if (movingUp && positionPlayerY > maxY) {
        positionPlayerY -= playerSpeed;
    }
    if (movingDown && positionPlayerY + playerHeight < canvas.height) {
        positionPlayerY += playerSpeed;
    }

    if (positionPlayerX + playerWidth >= canvas.width * 0.75 && movingRight) {
        backgroundAPosition -= playerSpeed;
        backgroundBPosition -= playerSpeed;
    }


    if (backgroundAPosition <= -backgroundWidth) {
        backgroundAPosition = backgroundWidth;
    }
    if (backgroundBPosition <= -backgroundWidth) {
        backgroundBPosition = backgroundWidth;
    }

    if (movingRight || movingLeft || movingUp || movingDown) {
        controlAnimated = 1;
    } else {
        controlAnimated = 0;
    }

    sendPlayerMovement();
    draw();
}

// Función para dibujar todo en el canvas
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.imageSmoothingEnabled = false;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    console.log(bP)

    ctx.drawImage(backgroundA, bP.posA, 0, backgroundWidthOriginal * 3, backgroundHeightOriginal * 3);
    ctx.drawImage(backgroundB, bP.posB, 0, backgroundWidth, backgroundHeight);

    if (isFacingLeft) {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(
            sprites[controlAnimated],
            frameIndex * playerWidth, 0, playerWidth, playerHeight,
            -positionPlayerX - playerWidth, positionPlayerY, playerWidth, playerHeight
        );
        ctx.restore();
    } else {
        ctx.drawImage(
            sprites[controlAnimated],
            frameIndex * playerWidth, 0, playerWidth, playerHeight,
            positionPlayerX, positionPlayerY, playerWidth, playerHeight
        );
    }
    // Dibujar los demás jugadores  
    for (let playerId in players) {
        let otherPlayer = players[playerId];

        // console.log(`otherPlayer: ${JSON.stringify(otherPlayer.directAnimated)}, player.id: ${player.id}`);


        if (otherPlayer.id !== player.id) {
            console.log(otherPlayer.isFacingLeft);

            if (otherPlayer.isFacingLeft) {
                ctx.save();
                // Invertir el sprite horizontalmente
                ctx.scale(-1, 1);
                // Ajustar la posición en x después de la inversión
                ctx.drawImage(
                    sprites[otherPlayer.directAnimated],
                    frameIndex * playerWidth, 0, playerWidth, playerHeight,
                    -otherPlayer.x - playerWidth, otherPlayer.y, playerWidth, playerHeight // Ajuste de la posición X
                );
                ctx.restore();
            } else {
                // Cuando no se invierte, la posición se mantiene normal
                ctx.drawImage(
                    sprites[otherPlayer.directAnimated],
                    frameIndex * playerWidth, 0, playerWidth, playerHeight,
                    otherPlayer.x, otherPlayer.y, playerWidth, playerHeight
                );
            }
        }
    }

}

// Función principal del juego
function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
}

// Iniciar el bucle del juego
gameLoop();
