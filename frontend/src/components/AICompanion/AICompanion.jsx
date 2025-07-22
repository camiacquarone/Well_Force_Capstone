import React, { useState } from "react";
import axios from "axios";
import CONFIG from "../../config.js";
import "./AICompanion.css";

export default function AICompanionModal({ onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await axios.post(`${CONFIG.API_BASE_URL}/api/chat`, {
        prompt: input,
      });
      const botMsg = { role: "assistant", content: res.data.response };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="ai-modal-overlay">
      <div className="ai-modal">
        <button className="close-ai-modal-btn" onClick={onClose}>
          ✕
        </button>
        <div className="ai-chatbot-messages">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`ai-chatbot-message ${
                msg.role === "user" ? "user" : "assistant"
              } ${msg.role === "assistant" ? "chatbot-message" : ""}`}
            >
              <div className="ai-message-header">
                <img
                  src={
                    msg.role === "user"
                      ? "/ruth-profile-selected.png"
                      : "/astro-profile-selected.png"
                  }
                  alt={msg.role === "user" ? "You" : "B-Well Astro"}
                  className="ai-avatar"
                />
                <b>{msg.role === "user" ? "You" : "B-Well Astro"}:</b>
              </div>

              {msg.content}
            </div>
          ))}
          {isLoading && (
            <div className="ai-chatbot-message assistant">
              <div className="ai-message-header">
                <img
                  src="/astro-profile-selected.png"
                  alt="B-Well Astro"
                  className="ai-avatar"
                />
                <b>B-Well Astro:</b>
              </div>
              <img
                src="/bee.gif"
                alt="Thinking..."
                className="bee-gif"
                style={{ width: "80px", height: "80px" }}
              />
            </div>
          )}
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
    </div>
  );
}
