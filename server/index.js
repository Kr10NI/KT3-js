const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });
const clients = new Set();
const users = new Map();
const usersColors = new Map(); 

server.on('connection', (socket) => {
    clients.add(socket);

    socket.on('message', (message) => {
        if (!users.has(socket)) {
            const [username, color] = message.split(':');
            users.set(socket, username);
            usersColors.set(socket, color);
            const welcomeMessage = Array.from(users.values()).length === 1
                ? 'Добро пожаловать. Вы первый в чате.'
                : `Добро пожаловать. В чате уже присутствуют: ${Array.from(users.values()).join(', ')}.`;
            socket.send(welcomeMessage);
            broadcast(`${username} присоединился к чату.`, socket);
        } else {
            const username = users.get(socket);
            const color = usersColors.get(socket);
            broadcast(`${username}: ${message}`, null, color);
        }
    });

    socket.on('close', () => {
        const username = users.get(socket);
        users.delete(socket);
        usersColors.delete(socket);
        clients.delete(socket);
        broadcast(`${username} покинул чат.`);
    });
});

function broadcast(message, excludeSocket = null, color = 'black') {
    clients.forEach(client => {
        if (client !== excludeSocket && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ message, color }));
        }
    });
}

console.log('WebSocket server running on ws://localhost:8080');
