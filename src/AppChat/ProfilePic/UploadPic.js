import { useState, useContext } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, db, auth } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { AuthContext } from "../../AuthContext";
import { toast } from "react-toastify";

export default function UploadPhoto() {
  const [file, setFile] = useState(null);
  const { user } = useContext(AuthContext);
  const handleUpload = async () => {
    if (!file) return;

    try {
      if (!user) {
        alert("Login First");
        navigate("/user");
        return;
      }

      // create storage reference
      const storageRef = ref(storage, `users/${user.uid}/profile.jpg`);

      //upload file

      await uploadBytes(storageRef, file);

      // get download url

      const url = await getDownloadURL(storageRef);

      // SAve Url to firestore

      await setDoc(
        doc(db, "users", user.uid),
        { photoURL: url },
        { merge: true }
      );
      toast.success("Photo Uploaded");
    } catch (err) {
      toast.error("Failed To Upload " + err.message);
    }
  };

  return (
    <>
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button onClick={handleUpload}>Upload</button>
      </div>
    </>
  );
}
