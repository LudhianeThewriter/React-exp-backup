import React, { useState, useEffect, useContext, useRef } from "react";

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
import { Accordion, Dropdown } from "react-bootstrap";
import { ref, getDownloadURL, deleteObject } from "firebase/storage";
import { storage, db } from "../firebase";
import { AuthContext } from "../AuthContext";

import { UploadPhoto } from "./ProfilePic/UploadPic";

import { toast } from "react-toastify";
import { useProfile } from "./ProfileContext";

export default function ProfilePage() {
  const { user, userInfo, loading } = useContext(AuthContext);
  const { profilePath, clearProfilePic, uploadProfilePic } = useProfile();

  const [actionLoading, setActionLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const [profileModal, setProfileModal] = useState({
    open: false,
    type: "",
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleRemovePic = async () => {
    try {
      setActionLoading(true);

      if (!userInfo.photoPath) {
        toast.error("No photo to remove!");
        return;
      }

      const storageRef = ref(storage, profilePath);
      await deleteObject(storageRef);
      await clearProfilePic();
      setImageUrl("");
      toast.success("Photo Removed !");
      setActionLoading(false);
    } catch (err) {
      setActionLoading(false);
      toast.error("Failed to Remove " + err.message);
    }
  };
  function handleShowHideDropdown() {
    setShowDropdown(!showDropdown);
  }

  useEffect(() => {
    const handleClickOutSide = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutSide);

    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  }, []);

  const friends = ["Alice", "Bob", "Charlie", "Diana"];
  const posts = [
    "https://via.placeholder.com/400x250",
    "https://via.placeholder.com/400x250",
    "https://via.placeholder.com/400x250",
    "https://via.placeholder.com/400x250",
  ];

  useEffect(() => {
    if (!loading) {
      if (userInfo?.photoURL) {
        setImageUrl(userInfo?.photoURL);
      }
    }
  }, [userInfo?.photoURL]);

  return (
    <div className="bg-dark text-light min-vh-100 py-5">
      <div className="container">
        <div className="row g-4">
          {/* Left Column */}
          <div className="col-md-4">
            <div
              className="card  shadow rounded-4"
              style={{
                backgroundColor: "rgb(123, 175, 212)",
                color: "#0A2540",
              }}
            >
              <div className="card-body text-center position-relative">
                <div
                  className="position-relative d-inline-block"
                  ref={dropdownRef}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="profile"
                      className="rounded-circle mb-3 shadow"
                      style={{
                        width: "120px",
                        height: "120px",
                        objectFit: "cover",
                        border: "3px solid #fff",
                        cursor: "pointer",
                      }}
                      onClick={handleShowHideDropdown}
                    />
                  ) : (
                    <FaUser
                      className="rounded-circle mb-3 shadow"
                      style={{
                        width: "120px",
                        height: "120px",
                        objectFit: "cover",
                        border: "3px solid #fff",
                        cursor: "pointer",
                      }}
                      onClick={handleShowHideDropdown}
                    />
                  )}

                  {/*Three dots Option*/}
                  <Dropdown
                    show={showDropdown}
                    className="position-absolute"
                    style={{
                      top: "50px",
                      left: "5px",
                    }}
                  >
                    <Dropdown.Toggle as="div" style={{}}></Dropdown.Toggle>

                    <Dropdown.Menu
                      align="end"
                      className="p-0 border  rounded-border "
                      style={{
                        backgroundColor: "lightblue",
                        color: "white",
                      }}
                    >
                      <Dropdown.Item
                        onClick={() => {
                          setShowDropdown(false);
                          setProfileModal({ open: true, type: "change" });
                        }}
                        className="d-flex align-items-center gap-2  fw-bold dropdown-item-custom rounded-border"
                      >
                        <FaEdit /> Change
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setShowDropdown(false);
                          setProfileModal({ open: true, type: "view" });
                        }}
                        className="d-flex align-items-center gap-2  fw-bold dropdown-item-custom rounded-border"
                      >
                        <FaEye /> View
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setShowDropdown(false);
                          setProfileModal({ open: true, type: "take" });
                        }}
                        className="d-flex align-items-center gap-2  fw-bold dropdown-item-custom rounded-border "
                      >
                        <FaPlus /> Take
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          setShowDropdown(false);
                          setProfileModal({ open: true, type: "remove" });
                        }}
                        className="d-flex align-items-center gap-2  fw-bold dropdown-item-custom rounded-border"
                      >
                        <FaTrash /> Remove
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>

                <h3 className="fw-bold ">
                  {userInfo?.username || "Loading..."}
                </h3>
                <p className="text-muted">
                  This is a short bio about John Doe.
                </p>

                <div className="d-flex justify-content-center gap-3 mt-3">
                  {/* Friends */}
                  <div
                    className="d-flex align-items-center gap-2 px-3 py-1 rounded-pill shadow-sm"
                    style={{ backgroundColor: "#FFECB3", color: "#6B4226" }} // warm amber bg + dark text
                  >
                    <FaUsers />{" "}
                    <span className="fw-bold">{friends.length}</span>
                  </div>

                  {/* Posts */}
                  <div
                    className="d-flex align-items-center gap-2 px-3 py-1 rounded-pill shadow-sm"
                    style={{ backgroundColor: "#B3E5FC", color: "#01579B" }} // light blue bg + dark blue text
                  >
                    <FaImage /> <span className="fw-bold">{posts.length}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card text-light shadow rounded-border mt-4">
              <Accordion defaultActiveKey="0" flush>
                <Accordion.Item eventKey="0" className="">
                  <Accordion.Header>
                    <FaUsers className="me-2" /> Friends
                  </Accordion.Header>
                  <Accordion.Body className="p-0">
                    <ul className="list-group list-group-flush">
                      {friends.map((friend, index) => (
                        <li
                          key={index}
                          className="list-group-item friend-item  "
                        >
                          <img
                            src={`https://i.pravatar.cc/40?u=${index}`} // placeholder avatar
                            alt={friend}
                            className="rounded-circle"
                            style={{
                              width: "35px",
                              height: "35px",
                              objectFit: "cover",
                            }}
                          />
                          <span>{" " + friend}</span>
                        </li>
                      ))}
                    </ul>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </div>
          </div>
          {profileModal.open && (
            <div
              className="profile-modal-overlay"
              onClick={() => setProfileModal({ open: false, type: "" })}
            >
              <div
                className="profile-modal-content"
                onClick={(e) => e.stopPropagation()}
              >
                {profileModal.type == "view" && (
                  <>
                    <h3 className="mb-3">View Profile Photo</h3>
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt="profile"
                        className="img-fluid rounded"
                        style={{
                          width: "200px",
                          height: "200px",
                          objectFit: "cover",
                          border: "3px solid #fff",
                          cursor: "pointer",
                        }}
                      />
                    ) : (
                      <FaUser
                        className="rounded-circle mb-3 shadow"
                        style={{
                          width: "120px",
                          height: "120px",
                          objectFit: "cover",
                          border: "3px solid #fff",
                          cursor: "pointer",
                        }}
                      />
                    )}
                  </>
                )}

                {profileModal.type == "change" && (
                  <>
                    <h3 className="mb-3">Change Profile Photo</h3>
                    <UploadPhoto
                      onSuccess={(url) => {
                        toast.success("Photo Uploaded");
                        setActionLoading(false);
                        setImageUrl(url);
                        setProfileModal({ open: false, type: "" });
                      }}
                      onError={(err) => {
                        toast.error("Failed to Upload " + err.message);
                        setActionLoading(false);
                      }}
                      onLoading={(val) => {
                        setActionLoading(val);
                      }}
                    />
                  </>
                )}

                {profileModal.type == "remove" && (
                  <>
                    <h3 className="mb-3">Remove Profile Photo</h3>
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        handleRemovePic();
                        setProfileModal({ open: false, type: "" });
                      }}
                    >
                      <FaTrash />
                      Confirm Remove
                    </button>
                    {actionLoading && (
                      <div className="d-flex justify-content-center align-items-center my-3">
                        <div
                          className="spinner-border text-primary"
                          role="status"
                        >
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
          {/* Right Column */}

          <div className="col-md-7">
            <div className="card bg-dark text-light shadow rounded-4">
              <div className="card-header d-flex align-items-center">
                <FaImage className="me-2" /> Posts
              </div>
              <div className="card-body">
                <div className="row g-3">
                  {posts.map((post, index) => (
                    <div key={index} className="col-md-6">
                      <div
                        className="card h-100 shadow-sm rounded-3"
                        style={{
                          backgroundColor: "#1c1c1c",
                          cursor: "pointer",
                        }}
                      >
                        {/* Post Image */}
                        <img
                          src={`https://i.pravatar.cc/300?u=${index}`} // Placeholder large image
                          alt={`Post ${index}`}
                          className="img-fluid rounded-top"
                          style={{ height: "200px", objectFit: "cover" }}
                        />

                        {/* Caption */}
                        <div className="card-body">
                          <p className="card-text text-light">
                            This is a caption for post {index + 1}.
                          </p>

                          {/* Like/Dislike Buttons */}
                          <div className="d-flex align-items-center gap-3">
                            <button
                              className="btn btn-sm "
                              style={{
                                color: "#4A90E2",
                                backgroundColor: "#E5F0FF",
                              }}
                            >
                              <FaThumbsUp />
                            </button>
                            <button
                              className="btn btn-sm "
                              style={{
                                color: "#FF4D4F",
                                backgroundColor: "#FFE5E5",
                              }}
                            >
                              <FaThumbsDown />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Right column ends */}
        </div>
      </div>
    </div>
  );
}
