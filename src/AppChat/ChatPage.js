import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUserCircle } from "react-icons/fa";

export default function ChatPage() {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState("");

  const friends = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" },
  ];

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setMessages((prev) => ({
      ...prev,
      [selectedFriend.id]: [
        ...(prev[selectedFriend.id] || []),
        { text: newMessage, sender: "me" },
      ],
    }));
    setNewMessage("");
  };

  return (
    <div className="d-flex vh-100 bg-dark text-light">
      {/* Friends List */}
      <div className="bg-secondary p-3" style={{ width: "250px" }}>
        <h5 className="mb-3">Chats</h5>
        {friends.map((friend) => (
          <div
            key={friend.id}
            className={`d-flex align-items-center p-2 rounded mb-2 ${
              selectedFriend?.id === friend.id ? "bg-dark" : "bg-secondary"
            }`}
            style={{ cursor: "pointer" }}
            onClick={() => setSelectedFriend(friend)}
          >
            <FaUserCircle size={30} className="me-2" />
            <span>{friend.name}</span>
          </div>
        ))}
      </div>

      {/* Chat Panel */}
      <div className="flex-grow-1 d-flex flex-column bg-dark p-3">
        {selectedFriend ? (
          <>
            <h5 className="border-bottom pb-2">{selectedFriend.name}</h5>
            <div className="flex-grow-1 overflow-auto mb-3">
              {(messages[selectedFriend.id] || []).map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-2 my-1 rounded ${
                    msg.sender === "me" ? "bg-primary text-white ms-auto" : "bg-secondary text-white me-auto"
                  }`}
                  style={{ maxWidth: "70%" }}
                >
                  {msg.text}
                </div>
              ))}
            </div>
            <div className="d-flex">
              <input
                type="text"
                className="form-control bg-secondary text-white"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
              />
              <button className="btn btn-primary ms-2" onClick={handleSend}>
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="text-center text-muted my-auto">
            Select a friend to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
