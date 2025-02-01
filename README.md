# Multiplayer Game con Node.js y Socket.io

Este es un servidor backend para un juego multijugador en tiempo real utilizando **Node.js**, **Express** y **Socket.io**. Permite que múltiples jugadores se conecten, se muevan en el mapa y vean los movimientos de los demás en tiempo real.

## Tecnologías utilizadas

- **Node.js**
- **Express**
- **Socket.io**
- **CORS** (para permitir la conexión con el frontend en Vite)

## Instalación y ejecución

1. Clonar este repositorio:
   ```sh
   git clone https://github.com/tu_usuario/tu_repositorio.git
   cd tu_repositorio
   ```
2. Instalar las dependencias:
   ```sh
   npm install
   ```
3. Ejecutar el servidor:
   ```sh
   node server.js
   ```

El servidor se ejecutará en `http://localhost:3000`.

## Funcionamiento

- Cada jugador que se conecta recibe un ID único.
- Se les asigna una posición inicial en el mapa.
- Los movimientos de los jugadores se transmiten en tiempo real a los demás jugadores conectados.
- Cuando un jugador se desconecta, se notifica a los demás y se elimina de la lista de jugadores activos.

## Eventos de Socket.io

| Evento               | Descripción |
|----------------------|-------------|
| `setPlayerId`       | Envía el ID único al jugador que se conecta. |
| `currentPlayers`    | Envía la lista de jugadores actuales a un nuevo jugador. |
| `newPlayer`        | Notifica a los jugadores sobre un nuevo jugador. |
| `playerMovement`    | Recibe y retransmite la posición y animación de un jugador. |
| `playerMoved`       | Informa a todos sobre el movimiento de un jugador. |
| `playerDisconnected`| Notifica cuando un jugador se desconecta. |

## Notas

- Este backend está diseñado para funcionar con un frontend desarrollado en **Vite**, por lo que la configuración CORS permite conexiones desde `http://localhost:5173`.
- El frontend debe implementar la lógica para recibir los eventos y actualizar la vista en tiempo real.

## Contribución

Si deseas contribuir a este proyecto:
1. Haz un fork del repositorio.
2. Crea una nueva rama (`git checkout -b nueva-funcionalidad`).
3. Realiza tus cambios y haz commit (`git commit -m "Descripción de cambios"`).
4. Sube la rama (`git push origin nueva-funcionalidad`).
5. Abre un Pull Request.

## Licencia

Este proyecto está bajo la licencia MIT. Puedes usarlo y modificarlo libremente.

