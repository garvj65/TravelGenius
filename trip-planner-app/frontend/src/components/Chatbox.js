import React, { useState } from "react";
import axios from "axios";

const Chatbox = () => {
  const [userMessage, setUserMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const sendMessage = async () => {
    if (!userMessage.trim()) return;

    const newMessage = { role: "user", content: userMessage };
    setChatHistory([...chatHistory, newMessage]);

    try {
      const response = await axios.post("http://localhost:3000/create-trip/chat", {
        userMessage,
      });

      const botMessage = {
        role: "assistant",
        content: response.data.reply,
      };
      setChatHistory([...chatHistory, newMessage, botMessage]);
    } catch (error) {
      console.error("Error:", error);
    }

    setUserMessage("");
  };

  return (
    <div className="chatbox">
      <div className="chat-history">
        {chatHistory.map((msg, index) => (
          <div key={index} className={msg.role}>
            <strong>{msg.role === "user" ? "You: " : "Assistant: "}</strong>
            {msg.content}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Ask your travel assistant..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chatbox;
