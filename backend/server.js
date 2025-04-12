const socket = io('https://whatsappme.onrender.com');
const email = localStorage.getItem('email');
let currentChat = null;

if (!email) {
  window.location.href = 'index.html';
}

socket.emit('login', email);

socket.on('onlineUsers', (users) => {
  const list = document.getElementById('onlineUsers');
  list.innerHTML = '';
  users.forEach(user => {
    if (user !== email) {
      const li = document.createElement('li');
      li.textContent = user;
      li.onclick = () => {
        currentChat = user;
        document.getElementById('chatWith').textContent = `Chatting with ${user}`;
        document.getElementById('chatArea').innerHTML = '';
      };
      list.appendChild(li);
    }
  });
});

socket.on('receive', ({ from, message }) => {
  if (from === currentChat) {
    appendMessage(from, message, 'received');
  }
});

function sendMessage() {
  const msg = document.getElementById('messageInput').value;
  if (msg && currentChat) {
    socket.emit('send', { to: currentChat, message: msg });
    appendMessage(email, msg, 'sent');
    document.getElementById('messageInput').value = '';
  }
}

function appendMessage(sender, message, type) {
  const div = document.createElement('div');
  div.className = `message ${type}`;
  div.textContent = message;
  document.getElementById('chatArea').appendChild(div);
}
