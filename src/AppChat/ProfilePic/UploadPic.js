import { useState, useContext, useRef } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, db, auth } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { AuthContext } from "../../AuthContext";
import { toast } from "react-toastify";

export function UploadPhoto() {
  const [file, setFile] = useState(null);
  const { user } = useContext(AuthContext);
  const videoRef = useRef(null);

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

  // Handle Camera Access
  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      toast.error("Failed to upload " + err.message);
      console.log("Err :", err.message);
    }
  }
  return (
    <>
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button onClick={handleUpload}>Upload</button>
        <hr />

        <div className="card shadow-lg p-3 my-3 text-center">
          <h4 className="mb-3">📷 Camera Access</h4>
          <video
            ref={videoRef}
            className="rounded-border"
            style={{
              width: "100%",
              maxWidth: "400px",
              height: "auto",
            }}
          ></video>
          <div className="mt-3">
            <button className="btn btn-primary" onClick={startCamera}>
              📷 Enable Camera
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
