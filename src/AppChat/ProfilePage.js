import React, { useState, useEffect, useContext, useRef } from "react";

import {
  FaUser,
  FaUsers,
  FaImage,
  FaEdit,
  FaEye,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import { Dropdown } from "react-bootstrap";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
import { AuthContext } from "../AuthContext";
import { image } from "framer-motion/client";

export default function ProfilePage() {
  const [imageUrl, setImageUrl] = useState("");
  const { user, userInfo } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  function handleShowHideDropdown() {
    setShowDropdown(!showDropdown);
  }

  useEffect(() => {
    const imageRef = ref(storage, `users/${user.uid}/profile.jpg`);
    getDownloadURL(imageRef)
      .then((url) => {
        setImageUrl(url);
        console.log("imageRef : ", imageRef, " url : ", url);
      })
      .catch((error) => alert(error.message));
  }, []);

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

  // handle profile pic
  const handleChange = () => {};
  const handleView = () => {};
  const handleAdd = () => {};
  const handleRemove = () => {};
  //-------

  return (
    <div className="bg-dark text-light min-vh-100 py-5">
      <div className="container">
        <div className="row g-4">
          {/* Left Column */}
          <div className="col-md-4">
            <div className="card bg-secondary text-light shadow rounded-4">
              <div className="card-body text-center position-relative">
                <div
                  className="position-relative d-inline-block"
                  ref={dropdownRef}
                >
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

                  {/*Three dots Option*/}
                  <Dropdown
                    show={showDropdown}
                    className="position-absolute"
                    style={{ top: "5px", right: "5px" }}
                  >
                    <Dropdown.Toggle as="div" style={{}}></Dropdown.Toggle>

                    <Dropdown.Menu
                      align="end"
                      className="p-0 border border-primary rounded-border dropdown-item-custom"
                    >
                      <Dropdown.Item
                        onClick={() => {
                          handleChange();
                          setShowDropdown(false);
                        }}
                        className="d-flex align-items-center gap-2  fw-bold dropdown-item-custom rounded-border"
                        style={{ borderBottom: "1px solid #0d6efd" }}
                      >
                        <FaEdit /> Change
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          handleView();
                          setShowDropdown(false);
                        }}
                        className="d-flex align-items-center gap-2  fw-bold dropdown-item-custom rounded-border"
                        style={{ borderBottom: "1px solid #0d6efd" }}
                      >
                        <FaEye /> View
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          handleAdd();
                          setShowDropdown(false);
                        }}
                        className="d-flex align-items-center gap-2  fw-bold dropdown-item-custom rounded-border "
                        style={{ borderBottom: "1px solid #0d6efd" }}
                      >
                        <FaPlus /> Add
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          handleRemove();
                          setShowDropdown(false);
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
              </div>
            </div>

            <div className="card bg-secondary text-light shadow rounded-4 mt-4">
              <div className="card-header d-flex align-items-center">
                <FaUsers className="me-2" /> Friends
              </div>
              <ul className="list-group list-group-flush">
                {friends.map((friend, index) => (
                  <li
                    key={index}
                    className="list-group-item bg-secondary text-light border-light"
                  >
                    {friend}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column */}
          <div className="col-md-8">
            <div className="card bg-secondary text-light shadow rounded-4">
              <div className="card-header d-flex align-items-center">
                <FaImage className="me-2" /> Posts
              </div>
              <div className="card-body">
                <div className="row g-3">
                  {posts.map((post, index) => (
                    <div key={index} className="col-md-6">
                      <img
                        src={post}
                        alt={`Post ${index}`}
                        className="img-fluid rounded-3 shadow-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
