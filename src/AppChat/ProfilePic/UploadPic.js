import { useState, useContext, useRef } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, db, auth } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { AuthContext } from "../../AuthContext";
import { toast } from "react-toastify";

export function UploadPhoto() {
  const { user } = useContext(AuthContext);
  const videoRef = useRef(null);
  const [preview, setPreview] = useState({});

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const ext = file.name.split(".").pop();
    if (file) {
      const imgUrl = URL.createObjectURL(file);
      setPreview({ file, imgUrl, ext });
    }
  };

  const handleUpload = async (file) => {
    if (!preview?.file) return;

    try {
      if (!user) {
        alert("Login First");
        navigate("/user");
        return;
      }

      // create storage reference
      console.log();
      const storageRef = ref(
        storage,
        `users/${user.uid}/profile.${preview.ext}`
      );

      //upload file

      await uploadBytes(storageRef, preview.file);

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
        <hr />
        <div className="container mt-4 text-center">
          <h4>Upload Profile Photo</h4>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => handleFileChange(e)}
            style={{ display: "none" }}
            id="camerainput"
          />
          <label htmlFor="camerainput" className="btn btn-primary mt-2">
            📷 Open Camera / Gallery
          </label>
          {preview && (
            <>
              <div className="mt-3">
                <h6>Preview :</h6>
                <img
                  src={preview.imgUrl}
                  alt="preview"
                  className="img-thumbnail"
                  width="200"
                />
              </div>
              <button className="btn btn-success" onClick={handleUpload}>
                Upload
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
