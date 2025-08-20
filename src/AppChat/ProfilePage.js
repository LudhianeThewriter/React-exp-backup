import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUser, FaUsers, FaImage } from "react-icons/fa";

export default function ProfilePage() {
  const friends = ["Alice", "Bob", "Charlie", "Diana"];
  const posts = [
    "https://via.placeholder.com/400x250",
    "https://via.placeholder.com/400x250",
    "https://via.placeholder.com/400x250",
    "https://via.placeholder.com/400x250",
  ];

  return (
    <div className="bg-dark text-light min-vh-100 py-5">
      <div className="container">
        <div className="row g-4">
          {/* Left Column */}
          <div className="col-md-4">
            <div className="card bg-secondary text-light shadow rounded-4">
              <div className="card-body text-center">
                <FaUser size={100} className="mb-3" />
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
