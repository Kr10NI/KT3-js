const ws = new WebSocket('ws://localhost:8080');
const messagesDiv = document.getElementById('messages');
const input = document.getElementById('input');
const sendBtn = document.getElementById('send');

ws.onopen = () => {
    const username = prompt('Введите ваше имя:');
    const color = prompt('Введите цвет сообщений (например, red, blue):') || 'black';
    ws.send(`${username}:${color}`);
};

ws.onmessage = (event) => {
    const { message, color } = JSON.parse(event.data);
    const msgDiv = document.createElement('div');
    msgDiv.textContent = message;
    msgDiv.style.color = color;
    messagesDiv.appendChild(msgDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
};

sendBtn.addEventListener('click', () => {
    if (input.value.trim()) {
        ws.send(input.value.trim());
        input.value = '';
    }
});

input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendBtn.click();
    }
});
