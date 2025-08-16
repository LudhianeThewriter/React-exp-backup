import React, { useState, useContext, useEffect } from "react";
import SideBar from "./UserSideBar";

import { toast } from "react-toastify";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
//import "react-toastify/dist/ReactToastify.css";

export default function ReportBug() {
  const [message, setMessage] = useState("");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      navigate("/user");
    }
  }, [user, navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim() === "") {
      toast.error("⚠️ Please describe the bug before submitting.");
      return;
    }

    try {
      await addDoc(collection(db, "bugLogs"), {
        userId: user?.uid || "unknown",
        email: user?.email || "not",
        message: message.trim(),
        status: "open",
        date: new Date().toISOString(),
      });

      setMessage(""); // clear input
      toast.success("🐞 Bug report submitted successfully!");
    } catch (error) {
      toast.error("❌ Failed to submit bug. Try again." + error.message);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Left Sidebar */}
        <div className="col-md-3 col-lg-2 bg-light border-end p-0">
          <SideBar />
        </div>

        {/* Main Content */}
        <div className="col-md-9 col-lg-10 p-4">
          <h2 className="mb-4 d-flex align-items-center gap-2">
            <i className="bi bi-bug-fill text-danger"></i> Report a Bug
          </h2>

          {/* Form Card */}
          <div className="card shadow-sm rounded-3">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Describe the bug</label>
                  <textarea
                    className="form-control"
                    rows="5"
                    placeholder="Explain what went wrong..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-danger px-4">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
