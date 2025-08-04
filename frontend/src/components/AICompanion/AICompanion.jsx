// import React, { useState } from "react"; // ← no useEffect needed anymore
// import axios from "axios";
// import CONFIG from "../../config.js";
// import "./AICompanion.css";

// export default function AICompanionModal({ onClose, user }) {
//   const [messages, setMessages] = useState([
//     { sender: "assistant", content: "👋 Hi! I'm B-Well Astro. Ready to buzz into some healthy habits?🐝" },
//   ]);
//   const [input, setInput] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const baseUrl = import.meta.env.VITE_PUBLIC_API_BASE_URL;

//   console.log("user.image_url", user?.image_url);

//   const sendMessage = async () => {
//     if (!input.trim()) return;
//     const userMsg = { role: "user", content: input };
//     setMessages((prev) => [...prev, userMsg]);
//     setInput("");
//     setIsLoading(true);

//     try {
//       const res = await axios.post(`${baseUrl}/api/chat`, {
//         prompt: input,
//       });
//       const botMsg = { role: "assistant", content: res.data.response };
//       setMessages((prev) => [...prev, botMsg]);
//     } catch (err) {
//       setMessages((prev) => [
//         ...prev,
//         { role: "assistant", content: "Sorry, something went wrong." },
//       ]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleKeyDown = (e) => {
//     if (e.key === "Enter") sendMessage();
//   };

//   return (
//     <div className="ai-modal-overlay">
//       <div className="ai-modal">
//         <button className="close-ai-modal-btn" onClick={onClose}>
//           ✕
//         </button>

//         <div className="ai-chatbot-messages">
//           {messages.map((msg, i) => (
//             <div
//               key={i}
//               className={`ai-chatbot-message ${
//                 msg.role === "user" ? "user" : "assistant"
//               } ${msg.role === "assistant" ? "chatbot-message" : ""}`}
//             >
//               <div className="ai-message-header">
//                 <img
//                   src={
//                     msg.role === "user"
//                       ? user?.image_url || "/default-profile.png"
//                       : "/BWell-Astro.png"
//                   }
//                   alt={msg.role === "user" ? "You" : "B-Well Astro"}
//                   className="ai-avatar"
//                 />
//                 <b>{msg.role === "user" ? "You" : "B-Well Astro"}:</b>
//               </div>
//               {msg.content}
//             </div>
//           ))}

//           {isLoading && (
//             <div className="ai-chatbot-message assistant">
//               <div className="ai-message-header">
//                 <img
//                   src="/BWell-Astro.png"
//                   alt="B-Well Astro"
//                   className="ai-avatar"
//                 />
//                 <b>B-Well Astro:</b>
//               </div>
//               <img
//                 src="/bee.gif"
//                 alt="Thinking..."
//                 className="bee-gif"
//                 style={{ width: "80px", height: "80px" }}
//               />
//             </div>
//           )}
//         </div>
//         <div className="ai-chatbot-input-row">
//           <input
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={handleKeyDown}
//             className="ai-chatbot-input"
//             placeholder="Type your message..."
//           />
//           <button onClick={sendMessage} className="ai-chatbot-send-btn">
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useState } from "react";
import axios from "axios";
import "./AICompanion.css";

export default function AICompanionModal({ onClose, user }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "👋 Hi! I'm B-Well Astro. Ready to buzz into some healthy habits?🐝",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Use Vite env variable correctly (fallback to localhost)
  const baseUrl = import.meta.env.VITE_PUBLIC_API_BASE_URL || "http://localhost:3000";

  const sendMessage = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    const userMsg = { role: "user", content: trimmedInput };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await axios.post(`${baseUrl}/api/chat`, {
        prompt: trimmedInput,
      });

      const botMsg = { role: "assistant", content: res.data.response };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Chat request failed:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "❌ Sorry, something went wrong. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // prevent newline
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
              className={`ai-chatbot-message ${msg.role === "user" ? "user" : "assistant"} ${
                msg.role === "assistant" ? "chatbot-message" : ""
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

          {isLoading && (
            <div className="ai-chatbot-message assistant">
              <div className="ai-message-header">
                <img src="/BWell-Astro.png" alt="B-Well Astro" className="ai-avatar" />
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
          <button onClick={sendMessage} className="ai-chatbot-send-btn" disabled={isLoading}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
