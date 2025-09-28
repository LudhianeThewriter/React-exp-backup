import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUserCircle } from "react-icons/fa";
import { db } from "../firebase";
import {
  serverTimestamp,
  collection,
  query,
  getDocs,
  addDoc,
  where,
  updateDoc,
  onSnapshot,
  orderBy,
} from "firebase/firestore";

export default function ChatPage() {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState("");
  const [friendList, setFriendList] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user?.uid) return;
    const query1 = query(
      collection(db, "friendRequests"),
      where("BASE_USER_UID", "==", user.uid),
      where("status", "==", "accept")
    );

    const query2 = query(
      collection(db, "friendRequests"),
      where("TARGET_USER_UID", "==", user.uid),
      where("status", "==", "accept")
    );

    const unsubscribe1 = onSnapshot(query1, (snapshot) => {
      const baseFriends = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        role: "base",
      }));

      console.log("Base friends ", baseFriends);
      setFriendList((prev) => {
        const targetFriends = prev.filter((f) => f.role == "target");
        return [...baseFriends, ...targetFriends];
      });
    });

    const unsubscribe2 = onSnapshot(query2, (snapshot) => {
      const targetFriends = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        role: "target",
      }));
      console.log("Target friends ", targetFriends);
      setFriendList((prev) => {
        const baseFriends = prev.filter((f) => f.role == "base");
        return [...baseFriends, ...targetFriends];
      });
    });

    return () => {
      unsubscribe1();
      unsubscribe2();
    };
  }, [user?.uid]);

  const friends = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" },
  ];
  // LOAD MESSAGES FOR selectedFriend
  useEffect(() => {
    if (!selectedFriend) return;
    const messageRef = collection(
      db,
      "friendRequests",
      selectedFriend.id,
      "messages"
    );

    const queryMsg = query(messageRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(queryMsg, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMessages((prev) => ({ ...prev, [selectedFriend.id]: msgs }));
    });

    return () => unsubscribe();
  }, [selectedFriend]);

  const handleSend = async () => {
    if (!newMessage.trim() || !selectedFriend) return;
    const messageRef = collection(
      db,
      "friendRequests",
      selectedFriend.id,
      "messages"
    );

    await addDoc(messageRef, {
      text: newMessage,
      senderUid: user.uid,
      timestamp: serverTimestamp(),
      localTimestamp: new Date(),
    });

    setNewMessage("");
  };
  return (
    <div className="d-flex vh-100 bg-dark text-light">
      {/* Friends List */}
      <div className="bg-secondary p-3" style={{ width: "250px" }}>
        <h5 className="mb-3">Chats</h5>
        {friendList.map((friend) => {
          // Determine who is the friend (the other user)
          const isBase = friend.BASE_USER_UID === user.uid;
          const friendPhoto = isBase
            ? friend.TARGET_USER_PHOTO
            : friend.BASE_USER_PHOTO;
          const friendName = isBase
            ? friend.TARGET_USER_NAME
            : friend.BASE_USER_NAME;

          return (
            <div
              key={friend.id}
              className={`d-flex align-items-center p-2 rounded mb-2 ${
                selectedFriend?.id === friend.id ? "bg-dark" : "bg-secondary"
              }`}
              style={{ cursor: "pointer" }}
              onClick={() => setSelectedFriend(friend)}
            >
              <img
                src={friendPhoto}
                alt={friendName}
                className="rounded-circle me-2"
                style={{ width: "40px", height: "40px", objectFit: "cover" }}
              />
              <span>{friendName}</span>
            </div>
          );
        })}
      </div>

      {/* Chat Panel */}
      <div className="flex-grow-1 d-flex flex-column bg-dark p-3">
        {selectedFriend ? (
          <>
            <h5 className="border-bottom pb-2">
              {selectedFriend.BASE_USER_UID === user.uid
                ? selectedFriend.TARGET_USER_NAME
                : selectedFriend.BASE_USER_NAME}
            </h5>
            <div className="flex-grow-1 overflow-auto mb-3">
              {(messages[selectedFriend.id] || []).map((msg) => {
                const isMe = msg.senderUid == user.uid;

                return (
                  <div
                    key={msg.id}
                    className={`d-flex flex-column my-1 ${
                      isMe ? "align-items-end" : "align-items-start"
                    }`}
                  >
                    <div
                      className={`p-2 rounded ${
                        isMe
                          ? "bg-primary text-white"
                          : "bg-secondary text-white"
                      }`}
                      style={{ maxWidth: "70%" }}
                    >
                      {msg.text}
                    </div>
                    <small
                      className="text-muted mt-1"
                      style={{ fontSize: "0.7rem" }}
                    >
                      hy
                      {formatTime}
                    </small>
                  </div>
                );
              })}
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
