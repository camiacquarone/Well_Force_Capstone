import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./AICompanion.css";

export default function AICompanionModal({ onClose, user }) {
  // messages will store all *completed* messages (user and assistant)
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "👋 Hi! I'm B-Well Astro. Ready to buzz into some healthy habits?🐝",
    },
  ]);
  const [input, setInput] = useState("");
  // isLoading indicates if the API call is in progress (show bee.gif)
  const [isLoading, setIsLoading] = useState(false);
  // currentTypingMessage holds the full message the bot is about to "type"
  const [currentTypingMessage, setCurrentTypingMessage] = useState("");
  // displayedTypingContent holds the portion of the message currently displayed during typing
  const [displayedTypingContent, setDisplayedTypingContent] = useState("");
  // isTyping indicates if the typing animation is actively running
  const [isTyping, setIsTyping] = useState(false);

  // Ref to scroll to the bottom of the chat messages
  const messagesEndRef = useRef(null);

  // ✅ Use Vite env variable correctly (fallback to localhost)
  const baseUrl =
    import.meta.env.VITE_PUBLIC_API_BASE_URL || "http://localhost:3000";

  // Function to send a message to the AI
  const sendMessage = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    // Add user's message to the chat history
    const userMsg = { role: "user", content: trimmedInput };
    setMessages((prev) => [...prev, userMsg]);
    setInput(""); // Clear input field
    setIsLoading(true); // Start loading (show bee.gif)
    setCurrentTypingMessage(""); // Clear any previous typing message
    setDisplayedTypingContent(""); // Clear displayed typing content
    setIsTyping(false); // Ensure typing animation is off initially

    try {
      // Make API call to your backend
      const res = await axios.post(`${baseUrl}/api/chat`, {
        prompt: trimmedInput,
      });

      // Once response is received:
      setIsLoading(false); // Stop loading (hide bee.gif)
      const fullBotResponse = res.data.response;
      setCurrentTypingMessage(fullBotResponse); // Set the full message to be typed
      setIsTyping(true); // Start typing animation
    } catch (err) {
      console.error("Chat request failed:", err);
      setIsLoading(false); // Stop loading on error
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "❌ Sorry, something went wrong. Please try again later.",
        },
      ]);
    }
  };

  // Effect to handle the typing animation
  useEffect(() => {
    if (isTyping && currentTypingMessage.length > 0) {
      let charIndex = 0;
      const typingInterval = setInterval(() => {
        setDisplayedTypingContent((prev) => {
          const nextChar = currentTypingMessage[charIndex];
          if (nextChar) {
            charIndex++;
            return prev + nextChar;
          } else {
            // Animation complete: add full message to history, reset typing states
            clearInterval(typingInterval);
            setMessages((prevMsgs) => [
              ...prevMsgs,
              { role: "assistant", content: currentTypingMessage },
            ]);
            setCurrentTypingMessage("");
            setDisplayedTypingContent("");
            setIsTyping(false);
            return prev; // Return previous state as no more chars to add
          }
        });
      }, 30); // Adjust typing speed here (milliseconds per character)

      // Cleanup interval on component unmount or if typing is stopped/message changes
      return () => clearInterval(typingInterval);
    }
  }, [isTyping, currentTypingMessage]);

  // Effect to scroll to the bottom of the chat whenever messages or typing content changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, displayedTypingContent, isLoading]);

  const handleKeyDown = (e) => {
    // Only send message if Enter is pressed, Shift is not held, and not currently loading/typing
    if (e.key === "Enter" && !e.shiftKey && !isLoading && !isTyping) {
      e.preventDefault(); // prevent newline in input
      sendMessage();
    }
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
              }`}
            >
              <div className="ai-message-header">
                <img
                  src={
                    msg.role === "user"
                      ? user?.image_url || "/default-profile.png"
                      : "/BWell-Astro.png"
                  }
                  alt={msg.role === "user" ? "You" : "B-Well Astro"}
                  className="ai-avatar"
                />
                <b>{msg.role === "user" ? "You" : "B-Well Astro"}:</b>
              </div>
              <div className="ai-message-content">{msg.content}</div>
            </div>
          ))}

          {/* Display bee.gif while API call is loading */}
          {isLoading && (
            <div className="ai-chatbot-message assistant">
              <div className="ai-message-header">
                <img
                  src="/BWell-Astro.png"
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

          {/* Display typing animation content */}
          {isTyping && (
            <div className="ai-chatbot-message assistant">
              <div className="ai-message-header">
                <img
                  src="/BWell-Astro.png"
                  alt="B-Well Astro"
                  className="ai-avatar"
                />
                <b>B-Well Astro:</b>
              </div>
              <div className="ai-message-content">{displayedTypingContent}</div>
            </div>
          )}

          {/* This empty div helps with scrolling to the bottom */}
          <div ref={messagesEndRef} />
        </div>

        <div className="ai-chatbot-input-row">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="ai-chatbot-input"
            placeholder="Type your message..."
            disabled={isLoading || isTyping} // Disable input while loading or typing
          />
          <button
            onClick={sendMessage}
            className="ai-chatbot-send-btn"
            disabled={isLoading || isTyping || !input.trim()} // Disable send button if loading, typing, or input is empty
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
