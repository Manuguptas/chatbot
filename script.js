const chatBody = document.getElementById("chat-body");
const userInput = document.getElementById("user-input");

let chatHistory = JSON.parse(localStorage.getItem("chat")) || [];

// Predefined Welcome Message
if (chatHistory.length === 0) {
  const welcome = "Hey there 👋\nHow can I help you today?";
  addMessage(welcome, "bot");
  saveChat(welcome, "bot");
}

function addMessage(text, sender) {
  const msg = document.createElement("div");
  msg.className = `message ${sender}`;
  msg.innerText = text;
  chatBody.appendChild(msg);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function saveChat(message, sender) {
  chatHistory.push({ message, sender });
  localStorage.setItem("chat", JSON.stringify(chatHistory));
}

function showTyping() {
  const typing = document.createElement("div");
  typing.className = "message bot";
  typing.id = "typing";
  typing.innerHTML = '<div class="typing"><span></span><span></span><span></span></div>';
  chatBody.appendChild(typing);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function removeTyping() {
  const typing = document.getElementById("typing");
  if (typing) typing.remove();
}

async function sendMessage() {
  const input = userInput.value.trim();
  if (!input) return;

  addMessage(input, "user");
  saveChat(input, "user");
  userInput.value = "";

  showTyping();

  try {
    const res = await fetch("api/gemini.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: input })
    });

    const data = await res.json();
    removeTyping();

    if (data.success) {
      addMessage(data.response, "bot");
      saveChat(data.response, "bot");
    } else {
      addMessage("❌ Error: " + data.message, "bot");
    }

  } catch (err) {
    removeTyping();
    addMessage("❌ Failed to connect to server.", "bot");
  }
}

// Load previous messages
chatHistory.forEach(chat => addMessage(chat.message, chat.sender));

// Send on Enter
userInput.addEventListener("keydown", e => {
  if (e.key === "Enter") sendMessage();
});
