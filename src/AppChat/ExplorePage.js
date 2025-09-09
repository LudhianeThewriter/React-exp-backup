import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { toast } from "react-toastify";
import {
  FaUser,
  FaUsers,
  FaImage,
  FaEdit,
  FaEye,
  FaPlus,
  FaTrash,
  FaThumbsUp,
  FaThumbsDown,
} from "react-icons/fa";
export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [friendRequests, setFriendRequests] = useState({});
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userCollection = collection(db, "users");
        const snapShot = await getDocs(userCollection);
        const userList = snapShot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("User list : ", userList);

        setUsers(userList);
      } catch (err) {
        toast.error("Failed to load : " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Dummy user data

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
        {loading ? (
          <div className="text-center text-muted mt-4">Loading users...</div>
        ) : (
          filteredUsers.map((user) => (
            <div className="col" key={user.id}>
              <div
                className="card h-100  border-light"
                style={{
                  backgroundColor: "rgb(123, 175, 212)",
                  color: "#0A2540",
                }}
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    className="card-img-top rounded-circle mx-auto mt-3"
                    alt={user.username}
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      cursor: "pointer",
                    }}
                  />
                ) : (
                  <FaUser
                    className="card-img-top rounded-circle mx-auto mt-3"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      cursor: "pointer",
                    }}
                  />
                )}
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
          ))
        )}

        {filteredUsers.length === 0 && (
          <div className="text-center text-muted mt-4">No users found</div>
        )}
      </div>
    </div>
  );
}
