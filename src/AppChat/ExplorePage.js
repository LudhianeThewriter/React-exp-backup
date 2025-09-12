import React, { useState, useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  arrayUnion,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import { AuthContext } from "../AuthContext";
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
import { useFriend } from "./FriendContext";
export default function ExplorePage() {
  const [search, setSearch] = useState("");
  const [friendRequests, setFriendRequests] = useState({});
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { sentReq, reqLoading } = useFriend();

  useEffect(() => {
    if (!user) return;
    const coll = collection(db, "users");
    const unsubscribe = onSnapshot(
      coll,
      (snapshot) => {
        const userList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const filtered = userList.filter((doc) => doc.id !== user.uid);
        setUsers(filtered);
        setLoading(false);
      },
      (err) => {
        toast.error("Failed to Load " + err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Dummy user data

  // Handle Friend Request
  const handleSendRequest = async (target) => {
    try {
      const existingReq = sentReq.find(
        (req) => req.TARGET_USER_UID == target.id && req.status == "pending"
      );

      if (existingReq) {
        await deleteDoc(doc(db, "friendRequests", existingReq.id));
        return;
      }

      await addDoc(collection(db, "friendRequests"), {
        BASE_USER_UID: user.uid,
        BASE_USER_EMAIL: user.email,
        TARGET_USER_UID: target.id,
        TARGET_USER_EMAIL: target.email,
        status: "pending",
        sentAt: new Date(),
      });
      toast.success("Friend Requent Sent");
    } catch (err) {
      toast.error("Request not Sent");
      console.log("Request Error ", err);
    }
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
          <div className="d-flex justify-content-center align-items-center w-100 mt-5">
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
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
                      sentReq.some((req) => req.TARGET_USER_UID == user.id)
                        ? "btn-warning"
                        : "btn-outline"
                    }`}
                    onClick={() => {
                      handleSendRequest(user);
                    }}
                  >
                    {sentReq.some((req) => req.TARGET_USER_UID == user.id)
                      ? "Unsent Request"
                      : "Send Request"}
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
