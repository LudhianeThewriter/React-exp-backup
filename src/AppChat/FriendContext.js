import { useState, useEffect, useContext, createContext } from "react";
import { db, auth } from "../firebase";
import { query, where, onSnapshot, collection } from "firebase/firestore";

const FriendContext = createContext();

export const FriendProvider = ({ children }) => {
  const [sentReq, setSentReq] = useState([]);
  const [rcdReq, setRcdReq] = useState([]);
  const [reqLoading, setReqLoading] = useState(true);
  useEffect(() => {
    let unsubscribeAuth = null;
    let unsubscribeSent = null;
    let unsubscribeReceived = null;

    unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        const collectionRef = collection(db, "friendRequests");
        const sentQuery = query(
          collectionRef,
          where("BASE_USER_UID", "==", user.uid)
        );
        const receivedQuery = query(
          collectionRef,
          where("TARGET_USER_UID", "==", user.uid)
        );

        let sentLoaded = false;
        let receivedLoaded = false;

        unsubscribeSent = onSnapshot(sentQuery, (snapshot) => {
          const sentRequests = snapshot.docs.map((req) => ({
            id: req.id,
            ...req.data(),
          }));
          setSentReq(sentRequests);
          sentLoaded = true;
          if (sentLoaded && receivedLoaded) setReqLoading(false);
        });

        unsubscribeReceived = onSnapshot(receivedQuery, (snapshot) => {
          const receivedRequests = snapshot.docs.map((req) => ({
            id: req.id,
            ...req.data(),
          }));
          setRcdReq(receivedRequests);
          receivedLoaded = true;
          if (sentLoaded && receivedLoaded) setReqLoading(false);
        });
      }
    });

    return () => {
      if (unsubscribeAuth) unsubscribeAuth();
      if (unsubscribeSent) unsubscribeSent();
      if (unsubscribeReceived) unsubscribeReceived();
    };
  }, []);

  return (
    <FriendContext.Provider value={{ sentReq, rcdReq, reqLoading }}>
      {children}
    </FriendContext.Provider>
  );
};

export const useFriend = () => useContext(FriendContext);
