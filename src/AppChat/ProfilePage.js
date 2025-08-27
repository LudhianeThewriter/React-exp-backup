import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
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

export default function ProfilePage() {
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
                <div className="position-relative d-inline-block">
                  <img
                    src="https://share.google/images/6I6L5fKZb6ML7RVxt"
                    alt="profile"
                    className="rounded-circle mb-3 shadow"
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                      border: "3px solid #fff",
                    }}
                  />

                  {/*Three dots Option*/}
                  <Dropdown
                    className="position-absolute"
                    style={{ top: "5px", right: "5px" }}
                  >
                    <Dropdown.Toggle
                      as="div"
                      style={{
                        cursor: "pointer",
                        fontSize: "20px",
                        color: "#000",
                        userSelect: "none",
                        padding: "4px 8px",
                        border: "0px",

                        borderRadius: "50%",
                        boxShadow: "0 0 3px rgba(0,0,0,0.3)",
                      }}
                    ></Dropdown.Toggle>

                    <Dropdown.Menu align="end" className="p-0 bg-dark">
                      <Dropdown.Item
                        onClick={handleChange}
                        className="d-flex align-items-center gap-2 text-white fw-bold"
                      >
                        <FaEdit /> Change
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={handleView}
                        className="d-flex align-items-center gap-2 text-white fw-bold"
                      >
                        <FaEye /> View
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={handleAdd}
                        className="d-flex align-items-center gap-2 text-white fw-bold"
                      >
                        <FaPlus /> Add
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={handleRemove}
                        className="d-flex align-items-center gap-2 text-white fw-bold"
                      >
                        <FaTrash /> Remove
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <h3 className="fw-bold">John Doe</h3>
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
