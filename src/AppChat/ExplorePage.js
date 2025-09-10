import React, { useState, useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  arrayUnion,
  serverTimestamp,
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
  const { friendData } = useFriend();
  let alreadyRequested;

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

    console.log("Friend Data :", friendData);
  }, []);

  // Dummy user data

  // Handle Friend Request
  const handleSendRequest = async (target) => {
    console.log("Target user : ", target);
    if (friendData) {
      alreadyRequested = friendData.request?.some(
        (req) => req.TARGET_UID == target.id
      );

      if (alreadyRequested) {
        toast.info("Request already sent");
        return;
      }
    }
    try {
      const senderDocRef = doc(db, "friendDB", user.uid);

      const requestObject = {
        TARGET_UID: target.id,
        TARGET_USER_EMAIL: target.email,
        status: "pending",
        sentAt: new Date(),
      };

      await setDoc(
        senderDocRef,
        {
          BASE_USER_UID: user.uid,
          BASE_USER_EMAIL: user.email,
          request: arrayUnion(requestObject),
          friendList: [],
        },
        { merge: true }
      );
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
                      friendData?.request?.some(
                        (req) => req.TARGET_UID == user.id
                      )
                        ? "btn-success"
                        : "btn-outline-light"
                    }`}
                    disabled={
                      friendData?.request?.some(
                        (req) => req.TARGET_UID == user.id
                      )
                        ? true
                        : false
                    }
                    onClick={() => {
                      handleSendRequest(user);
                    }}
                  >
                    {friendData?.request?.some(
                      (req) => req.TARGET_UID == user.id
                    )
                      ? "Requested"
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
