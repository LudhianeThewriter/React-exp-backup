import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function CommunityPage() {
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [friends, setFriends] = useState({});
  const [chatUser, setChatUser] = useState(null);
  const [messages, setMessages] = useState({});
  const [chatInput, setChatInput] = useState("");

  const users = [
    { username: "JohnDoe", bio: "Loves coding and coffee." },
    { username: "JaneSmith", bio: "Frontend enthusiast and designer." },
    { username: "KaranDev", bio: "Learning fullstack development." },
  ];

  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  const handleFriendRequest = (username) => {
    setFriends((prev) => ({ ...prev, [username]: true }));
  };

  const openProfile = (user) => {
    setSelectedUser(user);
  };

  const openChat = (user) => {
    setChatUser(user.username);
    if (!messages[user.username]) {
      setMessages((prev) => ({ ...prev, [user.username]: [] }));
    }
  };

  const sendMessage = () => {
    if (chatInput.trim() === "") return;
    setMessages((prev) => ({
      ...prev,
      [chatUser]: [...prev[chatUser], { sender: "You", text: chatInput }],
    }));
    setChatInput("");
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4">Community</h2>

      {/* Search Bar */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* User List */}
      <div className="row">
        {filteredUsers.map((user) => (
          <div className="col-md-4 mb-3" key={user.username}>
            <div className="card p-3 text-center">
              <div
                className="mx-auto d-flex align-items-center justify-content-center"
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: "#e0e0e0",
                  fontSize: 24,
                  color: "#999",
                }}
              >
                👤
              </div>
              <h5 className="mt-2">{user.username}</h5>
              <button
                className="btn btn-sm btn-primary mt-2"
                onClick={() => openProfile(user)}
              >
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Profile Modal */}
      {selectedUser && (
        <div
          className="modal show fade d-block"
          tabIndex="-1"
          role="dialog"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content text-center">
              <div className="modal-header">
                <h5 className="modal-title">User Profile</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedUser(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div
                  className="mx-auto d-flex align-items-center justify-content-center"
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    background: "#e0e0e0",
                    fontSize: 24,
                    color: "#999",
                  }}
                >
                  👤
                </div>
                <h4 className="mt-2">{selectedUser.username}</h4>
                <p>{selectedUser.bio}</p>
                {!friends[selectedUser.username] ? (
                  <button
                    className="btn btn-success"
                    onClick={() => handleFriendRequest(selectedUser.username)}
                  >
                    Send Friend Request
                  </button>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={() => openChat(selectedUser)}
                  >
                    Message
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {chatUser && (
        <div
          className="modal show fade d-block"
          tabIndex="-1"
          role="dialog"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-scrollable" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Chat with {chatUser}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setChatUser(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div
                  style={{
                    height: 300,
                    overflowY: "auto",
                    border: "1px solid #ddd",
                    borderRadius: 5,
                    padding: 10,
                    background: "#f8f9fa",
                  }}
                >
                  {messages[chatUser]?.map((msg, i) => (
                    <div key={i}>
                      <strong>{msg.sender}:</strong> {msg.text}
                    </div>
                  ))}
                </div>
                <div className="input-group mt-2">
                  <input
                    type="text"
                    className="form-control"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type a message..."
                  />
                  <button className="btn btn-primary" onClick={sendMessage}>
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
