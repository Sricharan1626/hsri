
function checkLogin() {
  const email = localStorage.getItem("email");
  if (!email) {
    window.location.href = "index.html";
  } else {
    document.getElementById("userEmail").textContent = email;
    loadOnlineUsers();
    loadMessages();
    setInterval(loadMessages, 2000);
  }
}

function logout() {
  localStorage.removeItem("email");
  window.location.href = "index.html";
}

function loadOnlineUsers() {
  const email = localStorage.getItem("email");
  document.getElementById("onlineUsers").innerHTML = `<li>${email}</li>`;
}

function sendMessage() {
  const msg = document.getElementById("messageInput").value;
  if (!msg.trim()) return;
  const email = localStorage.getItem("email");
  const data = { email, message: msg, time: new Date().toLocaleTimeString() };
  fetch("https://whatsappme.onrender.com/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }).then(() => {
    document.getElementById("messageInput").value = "";
    loadMessages();
  });
}

function loadMessages() {
  fetch("https://whatsappme.onrender.com/messages")
    .then(res => res.json())
    .then(data => {
      const chat = document.getElementById("chatMessages");
      chat.innerHTML = "";
      data.forEach(msg => {
        const el = document.createElement("div");
        el.innerHTML = `<strong>${msg.email}</strong>: ${msg.message} <small>${msg.time}</small>`;
        chat.appendChild(el);
      });
      chat.scrollTop = chat.scrollHeight;
    });
}
