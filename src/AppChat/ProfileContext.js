import { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [profilePath, setProfilePath] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentuser) => {
      setUser(currentuser);
      if (currentuser) {
        const userRef = doc(db, "users", currentuser.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          setProfilePic(snap.data().photoURL || null);
          setProfilePath(snap.data().photoPath || null);
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  });

  const updateProfilePic = async (url, path) => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, { photoURL: url, photoPath: path });
    setProfilePic(url);
    setProfilePath(path);
  };

  const clearProfilePic = async () => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, { photoURL: null, photoPath: null });
    setProfilePic(null);
    setProfilePath(null);
  };

  return (
    <ProfileContext.Provider
      value={{
        user,
        loading,
        profilePic,
        profilePath,
        updateProfilePic,
        clearProfilePic,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
