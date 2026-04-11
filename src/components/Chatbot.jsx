import React, { useState, useRef, useEffect } from "react";

const Chatbot = () => {
  const [input, setInput] = useState("");        // stores current user input
  const [messages, setMessages] = useState([]);  // chat history
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message to API
  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message to chat
    setMessages((prev) => [...prev, { sender: "user", text: input }]);

    try {
      const res = await fetch("http://localhost:5000/chatbot", {  // replace with your API URL
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      // Add API reply to chat
      setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { sender: "bot", text: "Server error. Try again!" }]);
    }

    setInput(""); // clear input box
  };

  // Send on Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">AI Travel Chatbot</h2>

      <div className="card p-4 shadow" style={{ minHeight: "300px" }}>
        <div style={{ maxHeight: "250px", overflowY: "auto" }}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`mb-2 ${msg.sender === "user" ? "text-end" : "text-start"}`}>
              <span className={`badge ${msg.sender === "user" ? "bg-warning text-dark" : "bg-secondary"}`}>
                {msg.text}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef}></div>
        </div>

        <div className="d-flex mt-3">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Ask me about Indian destinations..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="btn btn-primary" onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;