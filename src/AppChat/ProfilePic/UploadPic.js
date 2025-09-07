import { useState, useContext, useRef, useEffect } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage, db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { AuthContext } from "../../AuthContext";
import { toast } from "react-toastify";
import { useProfile } from "../ProfileContext";

export function UploadPhoto({ onLoading, onSuccess, onError }) {
  const { user } = useContext(AuthContext);
  const { updateProfilePic } = useProfile();
  const [uploading, setUploading] = useState(false);
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
      onLoading(true);
      setUploading(true);
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
      const path = `users/${user.uid}/profile.${preview.ext}`;

      // SAve Url to firestore

      await updateProfilePic(url, path);
      onSuccess();
    } catch (err) {
      onError(err);
    } finally {
      setUploading(false);
      onLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (preview?.imgUrl) {
        URL.revokeObjectURL(preview.imgUrl);
      }
    };
  }, [preview]);
  return (
    <>
      <div>
        <hr />
        <div className="container mt-4 text-center">
          <h4>Upload Profile Photo</h4>
          <div className="d-flex justify-content-center gap-3 mt-3">
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
          </div>
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

              {uploading ? (
                <div className="d-flex justify-content-center align-items-center my-3">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <button className="btn btn-success" onClick={handleUpload}>
                  Upload
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
