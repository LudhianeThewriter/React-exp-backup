import { useState, useEffect, useContext, createContext } from "react";
import { db, auth } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";

const FriendContext = createContext();

export const FriendProvider = ({ children }) => {
  const [friendData, setFriendData] = useState(null);

  useEffect(() => {
    let unsubscribeAuth = null;
    let unsubscribeDoc = null;
    unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        const docRef = doc(db, "friendDB", user.uid);
        unsubscribeDoc = onSnapshot(docRef, (snapshot) => {
          if (snapshot.exists()) {
            setFriendData(snapshot.data());
          }
        });
      }
    });

    return () => {
      if (unsubscribeAuth) unsubscribeAuth();
      if (unsubscribeDoc) unsubscribeDoc();
    };
  }, []);

  return (
    <FriendContext.Provider value={{ friendData }}>
      {children}
    </FriendContext.Provider>
  );
};

export const useFriend = () => useContext(FriendContext);
