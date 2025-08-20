import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUserFriends, FaCompass, FaComments, FaUser } from "react-icons/fa";
import { Outlet, Link } from "react-router-dom";

export default function CommunityPage() {
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [friends, setFriends] = useState({});
  const [chatUser, setChatUser] = useState(null);
  const [messages, setMessages] = useState({});
  const [chatInput, setChatInput] = useState("");
  const [activeTab, setActiveTab] = useState("posts"); // default tab

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
    <div
      className="container-fluid p-0"
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <div className="flex-grow-1">
        <h2 className="p-3">Expencer's Community</h2>
        <Link to="post">Welcome To Our Community , Get Started</Link>
        {/* Tabs Content */}
        {activeTab === "posts" && <Outlet />}

        {activeTab === "explore" && (
          <div className="p-3">
            <Outlet />
          </div>
        )}

        {activeTab === "chat" && <Outlet />}

        {activeTab == "profile" && <Outlet />}
      </div>

      {/* Bottom Bar */}
      <div className="d-flex justify-content-around align-items-center border-top bg-light py-2 position-sticky bottom-0">
        <button className="btn" onClick={() => setActiveTab("posts")}>
          <FaUserFriends size={24} />
          <Link to="post" style={{ fontSize: 12 }}>
            Posts
          </Link>
        </button>
        <button className="btn" onClick={() => setActiveTab("explore")}>
          <FaCompass size={24} />
          <Link to="explore" style={{ fontSize: 12 }}>
            Explore
          </Link>
        </button>
        <button className="btn" onClick={() => setActiveTab("chat")}>
          <FaComments size={24} />
          <Link to="chat" style={{ fontSize: 12 }}>
            Chat
          </Link>
        </button>
        <button className="btn" onClick={() => setActiveTab("profile")}>
          <FaUser size={24} />
          <Link to="profile" style={{ fontSize: 12 }}>
            Profile
          </Link>
        </button>
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
