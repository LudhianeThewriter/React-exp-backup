import React, { useState, useContext, useEffect } from "react";
import { FaUserFriends, FaCompass, FaComments, FaUser } from "react-icons/fa";
import { Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
export default function CommunityPage() {
  const navigate = useNavigate();
  const { user, userInfo, loading } = useContext(AuthContext);

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

  // Authenticate the user access
  useEffect(() => {
    if (!loading) {
      if (!user || userInfo?.role != "admin") {
        navigate("/user");
       
        alert("Only Admins are allowed 345");
      }
    }
  }, [user, userInfo, loading]);

  // Auth ends

  return (
    <div
      className="container-fluid p-0 bg-dark text-white"
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <div className="flex-grow-1">
        <h2 className="p-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
          Expencer's Community
        </h2>
        <Outlet />
      </div>

      {/* Bottom Bar */}
      <div className="d-flex justify-content-around align-items-center border-top bg-light py-2 position-sticky bottom-0">
        <button
          className={`nav-btn flex-fill p-2 ${
            activeTab === "post" ? "active" : ""
          }`}
          onClick={() => {
            setActiveTab("post");
            navigate("post");
          }}
        >
          <FaUserFriends size={24} />
          Post
        </button>
        <button
          className={`nav-btn flex-fill p-2 ${
            activeTab === "explore" ? "active" : ""
          }`}
          onClick={() => {
            setActiveTab("explore");
            navigate("explore");
          }}
        >
          <FaCompass size={24} />
          Explore
        </button>
        <button
          className={`nav-btn flex-fill p-2 ${
            activeTab === "chat" ? "active" : ""
          }`}
          onClick={() => {
            setActiveTab("chat");
            navigate("chat");
          }}
        >
          <FaComments size={24} />
          Chat
        </button>
        <button
          className={`nav-btn flex-fill p-2 ${
            activeTab === "profile" ? "active" : ""
          }`}
          onClick={() => {
            setActiveTab("profile");
            navigate("profile");
          }}
        >
          <FaUser size={24} />
          Profile
        </button>
      </div>
    </div>
  );
}
