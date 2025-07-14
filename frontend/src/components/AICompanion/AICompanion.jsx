import React, { useState } from "react";
import axios from "axios";
import "./AICompanion.css";

export default function AICompanion() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    try {
      const res = await axios.post("http://localhost:3000/api/chat", {
        prompt: input,
      });
      const botMsg = { role: "assistant", content: res.data.response };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong." },
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="ai-chatbot-container">
      <div className="ai-chatbot-messages">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`ai-chatbot-message ${
              msg.role === "user" ? "user" : "assistant"
            }`}
          >
            <b>{msg.role === "user" ? "You" : "B-Well Astro"}:</b> {msg.content}
          </div>
        ))}
      </div>
      <div className="ai-chatbot-input-row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="ai-chatbot-input"
          placeholder="Type your message..."
        />
        <button onClick={sendMessage} className="ai-chatbot-send-btn">
          Send
        </button>
      </div>
    </div>
  );
}
