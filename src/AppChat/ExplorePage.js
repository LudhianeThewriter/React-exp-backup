import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [friendRequests, setFriendRequests] = useState({});

  // Dummy user data
  const users = [
    { id: 1, username: "JohnDoe", image: "https://via.placeholder.com/150" },
    { id: 2, username: "JaneSmith", image: "https://via.placeholder.com/150" },
    { id: 3, username: "AlexKing", image: "https://via.placeholder.com/150" },
    { id: 4, username: "SophiaLee", image: "https://via.placeholder.com/150" },
    { id: 5, username: "MikeRoss", image: "https://via.placeholder.com/150" },
  ];

  // Handle Friend Request
  const handleSendRequest = (id) => {
    setFriendRequests((prev) => ({
      ...prev,
      [id]: !prev[id], // toggle request sent/cancel
    }));
  };

  // Filter users based on search
  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="container-fluid min-vh-100 d-flex flex-column"
      style={{ backgroundColor: "#121212", color: "white" }}
    >
      {/* Search Bar */}
      <div className="p-3">
        <input
          type="text"
          className="form-control bg-dark text-white"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Explore Grid */}
      <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4 p-3">
        {filteredUsers.map((user) => (
          <div className="col" key={user.id}>
            <div className="card h-100 bg-dark text-white border-light">
              <img
                src={user.image}
                className="card-img-top rounded-circle mx-auto mt-3"
                alt={user.username}
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
              <div className="card-body text-center">
                <h5 className="card-title">{user.username}</h5>
                <button
                  className={`btn ${
                    friendRequests[user.id]
                      ? "btn-success"
                      : "btn-outline-light"
                  }`}
                  onClick={() => handleSendRequest(user.id)}
                >
                  {friendRequests[user.id] ? "Request Sent" : "Send Request"}
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-muted mt-4">No users found</div>
        )}
      </div>
    </div>
  );
}
