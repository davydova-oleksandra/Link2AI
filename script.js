const historyDiv = document.getElementById('history');
const messageInput = document.getElementById('message');
const sendBtn = document.getElementById('sendBtn');

const messageHistory = [];

const API_URL = "https://cors-anywhere.herokuapp.com/https://in.elastic.io/hook/6825b675d63ff200122247c2";

function addMessage(content, sender) {
  const msg = document.createElement('div');
  msg.className = sender === 'user' ? 'user-msg' : 'bot-msg';
  msg.textContent = (sender === 'user' ? "You: " : "AI agent: ") + content;
  historyDiv.appendChild(msg);
  historyDiv.scrollTop = historyDiv.scrollHeight;
}

sendBtn.addEventListener('click', async () => {
  const text = messageInput.value.trim();
  if (!text) return;

    messageHistory.push({
        role: 'user',
        content: [
            { type: 'text', text: text }
        ]
    });

  addMessage(text, 'user');
  messageInput.value = '';

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ messages: messageHistory })
    });

    const result = await response.json();

    messageHistory.push({
    role: 'assistant',
    content: [
        { type: 'text', text: result.reply }
    ]
    });

    addMessage(result.reply || 'No reply received', 'bot');
  } catch (err) {
    addMessage('Error: ' + err.message, 'bot');
  }
});
