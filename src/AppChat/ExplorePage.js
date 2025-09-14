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
  updateDoc,
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
  const { sentReq, rcdReq } = useFriend();

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
      //1) you already sent request
      const existingReq = sentReq.find(
        (req) => req.TARGET_USER_UID == target.id
      );

      if (existingReq) {
        if (existingReq.status == "pending") {
          toast.error("Request already sent");
          return;
        }

        if (existingReq.status == "decline") {
          await deleteDoc(doc(db, "friendRequests", existingReq.id));
        }
      }

      //2) They already sent you request

      const existingRecd = rcdReq.find((req) => req.BASE_USER_UID == target.id);
      if (existingRecd) {
        if (existingRecd.status == "pending") {
          await updateDoc(doc(db, "friendRequests", existingRecd.id), {
            status: "accept",
          });
          toast.success("Friend Request Accepted");
          return;
        }

        if (existingRecd.status == "decline") {
          await deleteDoc(doc(db, "friendRequests", existingReceived.id));
        }
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
          filteredUsers.map((person) => (
            <div className="col" key={person.id}>
              <div
                className="card h-100  border-light"
                style={{
                  backgroundColor: "rgb(123, 175, 212)",
                  color: "#0A2540",
                }}
              >
                {person.photoURL ? (
                  <img
                    src={person.photoURL}
                    className="card-img-top rounded-circle mx-auto mt-3"
                    alt={person.username}
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
                  <h5 className="card-title">{person.username}</h5>
                  <button
                    className={`btn ${(() => {
                      const request = sentReq.find(
                        (req) => req.TARGET_USER_UID == person.id
                      );

                      const requestRcd = rcdReq.find(
                        (req) => req.BASE_USER_UID == person.id
                      );

                      if (!request && !requestRcd) return "btn-outline-light";
                      if (
                        request?.status == "accept" ||
                        requestRcd?.status == "accept"
                      )
                        return "btn-success";
                      if (
                        request?.status == "decline" ||
                        requestRcd?.status == "decline"
                      )
                        return "btn-danger";

                      if (request?.status === "pending") return "btn-warning";
                      if (requestRcd?.status === "pending") return "btn-info";

                      return "Send Request ";
                    })()}`}
                    onClick={() => {
                      handleSendRequest(person);
                    }}
                  >
                    {(() => {
                      const request = sentReq.find(
                        (req) => req.TARGET_USER_UID == person.id
                      );

                      const requestRcd = rcdReq.find(
                        (req) => req.BASE_USER_UID == person.id
                      );

                      if (!request && !requestRcd) return "Send Request ";
                      if (
                        request?.status == "accept" ||
                        requestRcd?.status == "accept"
                      )
                        return "Friend";
                      if (
                        request?.status == "decline" ||
                        requestRcd?.status == "decline"
                      )
                        return "Send Request Again";

                      if (request?.status === "pending") return "Requested";
                      if (requestRcd?.status === "pending")
                        return "Friend Request";

                      return "Send Request ";
                    })()}
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
