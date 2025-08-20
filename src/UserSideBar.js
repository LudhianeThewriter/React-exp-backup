import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
import { signOut } from "firebase/auth";
import { AuthContext } from "./AuthContext";
import { FaRocket } from "react-icons/fa";

export default function SideBar() {
  const { userInfo } = useContext(AuthContext);
  console.log("User Info ", userInfo);
  const [formToggle, setFormToggle] = useState(false);
  const navigate = useNavigate();
  const quickActions = [
    { icon: "➕", title: "Add Expense" },
    { icon: "🗓️", title: "Today's Summary" },
    { icon: "🧾", title: "Monthly Report" },
    { icon: "💰", title: "Set Budget" },
    { icon: "🐞", title: "Report a Bug" },
    { icon: "👥", title: "Join Community" },
  ];

  const analysisTools = [
    { icon: "📂", title: "Category-wise Analysis" },
    { icon: "📅", title: "Month-wise Analysis" },
    { icon: "🔍", title: "Single Expense Analysis" },
    { icon: "📊", title: "Compare with Budget" },
    { icon: "🔥", title: "Top 5 Expenses" },
    { icon: "🔁", title: "Recurring Expenses" },
    { icon: "⚖️", title: "Needs vs Wants" },
    { icon: "↔️", title: "Previous vs Current Comparison" },
  ];

  const settings = [
    { icon: "👤", title: "Edit Profile" },
    { icon: "🔒", title: "Change Password" },
    { icon: "🚪", title: "Logout" },
  ];

  const help = [
    { icon: "📘", title: "User Guide" },
    { icon: "📞", title: "Contact Support" },
    { icon: "💡", title: "FAQs" },
  ];

  async function handleSignOut() {
    try {
      await signOut(auth);
      navigate("/user");
    } catch (error) {
      alert(`${error.message}`);
    }
  }

  return (
    <div
      className="text-white d-flex flex-column align-items-center py-4 px-2"
      style={{
        minHeight: "100vh",
        position: "sticky",
        top: 0,
        backgroundColor: "#1e1e2f",
      }}
    >
      {/* Profile Info */}

      <h5 style={{ cursor: "pointer" }} onClick={() => navigate("/dashboard")}>
        {userInfo?.username}
      </h5>
      <p className="text-break small mb-1">📧 {userInfo?.email}</p>
      <p className="text-break small mb-3">🚻 {userInfo?.gender}</p>
      <button className="btn btn-danger" onClick={handleSignOut}>
        Log Out
      </button>
      <hr className="text-white w-100 my-2" />
      {/* 🛠️ Admin Control Panel (Visible only to admin) */}
      {userInfo?.role === "admin" && (
        <div className="accordion w-100 mb-3" id="adminAccordion">
          <div
            className="accordion-item"
            style={{ backgroundColor: "#1e1e2f", border: "none" }}
          >
            <h2 className="accordion-header" id="adminHeading">
              <button
                className="accordion-button collapsed text-white"
                style={{ backgroundColor: "#2e2e3e" }}
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#adminCollapse"
                aria-expanded="false"
                aria-controls="adminCollapse"
              >
                🛠️ Admin Control Panel
              </button>
            </h2>
            <div
              id="adminCollapse"
              className="accordion-collapse collapse"
              aria-labelledby="adminHeading"
              data-bs-parent="#adminAccordion"
            >
              <div className="accordion-body px-2">
                <ul className="list-unstyled text-white">
                  <li
                    className="sidebar-item"
                    onClick={() => navigate("/adminpanel")}
                  >
                    📁 Manage Users
                  </li>
                  <li
                    className="sidebar-item"
                    onClick={() => navigate("/adminpanel")}
                  >
                    🧾 View All Expenses
                  </li>
                  <li
                    className="sidebar-item"
                    onClick={() => navigate("/adminpanel")}
                  >
                    📊 Admin Reports
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ⚡ Quick Actions */}
      <div className="w-100 px-2 mb-3">
        <h6 className="text-uppercase text-white-50">⚡ Quick Actions</h6>
        <ul className="list-unstyled text-white">
          {quickActions.map((item, index) => (
            <li
              className="sidebar-item"
              key={index}
              onClick={() => {
                if (item.title == "Add Expense") {
                  navigate("/addExp");
                } else if (item.title == "Set Budget") {
                  navigate("/budget");
                } else if (item.title == "Monthly Report") {
                  navigate("/report");
                } else if (item.title == "Report a Bug") {
                  navigate("/reportbug");
                } else if (item.title == "Join Community") {
                  navigate("/public");
                }
              }}
            >
              {item.icon} {item.title}
            </li>
          ))}
        </ul>
      </div>

      {/* Accordion */}
      <div className="accordion w-100" id="sidebarAccordion">
        {/* Analysis Tools */}
        <div
          className="accordion-item"
          style={{ backgroundColor: "#1e1e2f", border: "none" }}
        >
          <h2 className="accordion-header" id="headingOne">
            <button
              className="accordion-button collapsed text-white"
              style={{ backgroundColor: "#2e2e3e" }}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseOne"
              aria-expanded="false"
              aria-controls="collapseOne"
              onClick={() => navigate("/analysis")}
            >
              🔍 Analysis Tools
            </button>
          </h2>
          <div
            id="collapseOne"
            className="accordion-collapse collapse"
            aria-labelledby="headingOne"
            data-bs-parent="#sidebarAccordion"
          >
            <div className="accordion-body px-2">
              <ul className="list-unstyled text-white">
                {analysisTools.map((item, index) => (
                  <li
                    className="sidebar-item"
                    key={index}
                    onClick={() =>
                      navigate("/analysis", { state: { type: item.title } })
                    }
                  >
                    {item.icon} {item.title}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div
          className="accordion-item"
          style={{ backgroundColor: "#1e1e2f", border: "none" }}
        >
          <h2 className="accordion-header" id="headingTwo">
            <button
              className="accordion-button collapsed text-white"
              style={{ backgroundColor: "#2e2e3e" }}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseTwo"
              aria-expanded="false"
              aria-controls="collapseTwo"
            >
              ⚙️ Settings
            </button>
          </h2>
          <div
            id="collapseTwo"
            className="accordion-collapse collapse"
            aria-labelledby="headingTwo"
            data-bs-parent="#sidebarAccordion"
          >
            <div className="accordion-body px-2">
              <ul className="list-unstyled text-white">
                {settings.map((item, index) => (
                  <li className="sidebar-item" key={index}>
                    {item.icon} {item.title}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Help */}
        <div
          className="accordion-item"
          style={{ backgroundColor: "#1e1e2f", border: "none" }}
        >
          <h2 className="accordion-header" id="headingThree">
            <button
              className="accordion-button collapsed text-white"
              style={{ backgroundColor: "#2e2e3e" }}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseThree"
              aria-expanded="false"
              aria-controls="collapseThree"
            >
              ❓ Help
            </button>
          </h2>
          <div
            id="collapseThree"
            className="accordion-collapse collapse"
            aria-labelledby="headingThree"
            data-bs-parent="#sidebarAccordion"
          >
            <div className="accordion-body px-2">
              <ul className="list-unstyled text-white">
                {help.map((item, index) => (
                  <li className="sidebar-item" key={index}>
                    {item.icon} {item.title}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <button
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={() => navigate("/pricing")}
        >
          <FaRocket />
          Upgrade
        </button>
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        .sidebar-item {
          padding: 6px 0;
          cursor: pointer;
        }
        .sidebar-item:hover {
          background-color: #3e3e5e;
          border-radius: 5px;
          padding-left: 8px;
        }
      `}</style>
    </div>
  );
}
