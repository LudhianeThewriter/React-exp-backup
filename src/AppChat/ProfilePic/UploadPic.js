import { useState, useContext, useRef, useEffect } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { AuthContext } from "../../AuthContext";
import { toast } from "react-toastify";

export function UploadPhoto() {
  const { user } = useContext(AuthContext);
  // const videoRef = useRef(null);
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const ext = file.name.split(".").pop();

    const imgUrl = URL.createObjectURL(file);

    if (preview?.imgUrl) {
      URL.revokeObjectURL(preview.imgUrl);
    }

    fileRef.current = file;
    setPreview({ imgUrl, ext });
  };

  const handleUpload = async (file) => {
    if (!fileRef.current || !preview) return;

    try {
      if (!user) {
        alert("Login First");
        navigate("/user");
        return;
      }

      // create storage reference

      const storageRef = ref(
        storage,
        `users/${user.uid}/profile.${preview.ext}`
      );

      //upload file

      await uploadBytes(storageRef, fileRef.current);

      // get download url

      const url = await getDownloadURL(storageRef);

      // SAve Url to firestore

      await setDoc(
        doc(db, "users", user.uid),
        {
          photoURL: url,
          photoPath: `users/${user.uid}/profile.${preview.ext}`,
        },
        { merge: true }
      );
      toast.success("Photo Uploaded");
    } catch (err) {
      toast.error("Failed To Upload " + err.message);
    }
  };

  // Handle Camera Access
  /*
  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        console.log("Full MediaStream:", stream);
        console.log("Tracks:", stream.getTracks());
        console.log("Video Tracks:", stream.getVideoTracks());
        console.log("Audio Tracks:", stream.getAudioTracks());
      }
    } catch (err) {
      toast.error("Failed to upload " + err.message);
      console.log("Err :", err.message);
    }
  }*/

  useEffect(() => {
    return () => {
      if (preview?.imgUrl) {
        URL.revokeObjectURL(preview.imgUrl);
      }

      /*   if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }*/
    };
  }, [preview]);
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
            📷 Take Photo
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e)}
            style={{ display: "none" }}
            id="galleryinput"
          />
          <label htmlFor="galleryinput" className="btn btn-primary mt-2">
            Upload from Gallery
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
