// Obtener el canvas y su contexto para dibujar
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Configuración del tamaño del canvas
canvas.width = 224 *3;
canvas.height = 224 *3;

// Variables de movimiento del jugador
let playerSpeed = 5; // Velocidad de movimiento
let movingLeft = false;
let movingRight = false;
let movingUp = false;
let movingDown = false;
let isFacingLeft = true; // Dirección en la que mira el jugador

// Restricción para el movimiento vertical
let maxY = 220;

// Control de la animación del sprite
let controlAnimated = 0; // 0 = idle, 1 = caminando

// Cargar sprites (imágenes de animación)
const spriteIdle = new Image();
spriteIdle.src = "axe_idle_walk.png"; // Sprite de idle

const spriteWalk = new Image();
spriteWalk.src = "axe_walk.png"; // Sprite de caminar

// Array que almacena los sprites (idle y caminando)
const Sprites = [spriteIdle, spriteWalk];

// Cargar las imágenes del fondo para hacer un efecto de scroll infinito
const backgroundA = new Image();
backgroundA.src = "maps.jpg";
const backgroundB = new Image();
backgroundB.src = "maps.jpg";

// Ajustar el tamaño del fondo dinámicamente
let backgroundHeightOriginal = backgroundA.height;
let backgroundWidthOriginal = backgroundA.width;
let backgroundHeight = canvas.height;
let backgroundWidth = Math.trunc((backgroundHeight / backgroundHeightOriginal) * backgroundWidthOriginal);

// Posición inicial del jugador
let positionPlayerX = 100;
let positionPlayerY = 280;
const playerWidth = 48;
const playerHeight = 81;

// Configuración de la animación del sprite
let frameIndex = 4; // Índice del frame actual
const totalFrames = 4; // Total de frames en la animación
const frameSpeed = 6; // Velocidad de cambio de frames
let frameCounter = 0;

// Posiciones del fondo para el desplazamiento infinito
let backgroundAPosition = 0;
let backgroundBPosition = backgroundWidth;

// EVENTOS DEL TECLADO PARA MOVER AL JUGADOR
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

// FUNCIÓN PRINCIPAL DE ACTUALIZACIÓN
function update() {
    // Controlar la velocidad de la animación del personaje
    frameCounter++;
    if (frameCounter >= frameSpeed) {
        frameIndex = (frameIndex + 1) % totalFrames; // Cambia al siguiente frame
        frameCounter = 0; // Reiniciar contador
    }

    // Movimiento horizontal del jugador con límites
    if (movingRight && positionPlayerX + playerWidth < canvas.width * 0.75) {
        positionPlayerX += playerSpeed;
        isFacingLeft = true;
    }
    if (movingLeft && positionPlayerX > 0) {
        positionPlayerX -= playerSpeed;
        isFacingLeft = false;
    }

    // Movimiento vertical con límites
    if (movingUp && positionPlayerY > maxY) {
        positionPlayerY -= playerSpeed;
    }
    if (movingDown && positionPlayerY + playerHeight < canvas.height) {
        positionPlayerY += playerSpeed;
    }

    // Mover el fondo cuando el jugador llega al 75% del canvas
    if (positionPlayerX + playerWidth >= canvas.width * 0.75 && movingRight) {
        backgroundAPosition -= playerSpeed;
        backgroundBPosition -= playerSpeed;
    }

    // Resetear la posición del fondo para crear un efecto de bucle infinito
    if (backgroundAPosition <= -backgroundWidth) {
        backgroundAPosition = backgroundWidth;
    }
    if (backgroundBPosition <= -backgroundWidth) {
        backgroundBPosition = backgroundWidth;
    }

    // Controlar la animación según el movimiento
    if (movingRight || movingLeft || movingUp || movingDown) {
        controlAnimated = 1; // Animación de caminar
    } else {
        controlAnimated = 0; // Animación de idle
    }

    // Llamar a la función de dibujo
    draw();
}

// FUNCIÓN PARA DIBUJAR TODOS LOS ELEMENTOS EN PANTALLA
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas

    // Desactivar el suavizado para mantener los píxeles nítidos
    ctx.imageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;  // Firefox
    ctx.webkitImageSmoothingEnabled = false; // Safari / Chrome
    ctx.msImageSmoothingEnabled = false; // Edge

    // Suavizar la calidad de las imágenes al escalarlas
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Dibujar las imágenes de fondo para el efecto de desplazamiento infinito
    ctx.drawImage(backgroundA, backgroundAPosition, 0, backgroundWidthOriginal *3 , backgroundHeightOriginal * 3);
    ctx.drawImage(backgroundB, backgroundBPosition, 0, backgroundWidth, backgroundHeight);

    // Dibujar el personaje con inversión si está mirando a la izquierda
    if (isFacingLeft) {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(
            Sprites[controlAnimated],
            frameIndex * playerWidth, 0, playerWidth, playerHeight,
            -positionPlayerX - playerWidth, positionPlayerY, playerWidth, playerHeight
        );
        ctx.restore();
    } else {
        // Dibujar el personaje normalmente si mira a la derecha
        ctx.drawImage(
            Sprites[controlAnimated],
            frameIndex * playerWidth, 0, playerWidth, playerHeight,
            positionPlayerX, positionPlayerY, playerWidth, playerHeight
        );
    }
}

// FUNCIÓN PRINCIPAL DEL JUEGO
function gameLoop() {
    update(); // Actualizar la lógica del juego
    requestAnimationFrame(gameLoop); // Llamar nuevamente a gameLoop para repetir el ciclo
}

// Iniciar el bucle del juego
gameLoop();
