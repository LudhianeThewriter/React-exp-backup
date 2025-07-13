import React, { useState, useEffect } from "react";
import SideBar from "./UserSideBar";
import { auth } from "./firebase";
import { getFunctions, httpsCallable } from "firebase/functions";

export default function AdminDashboardPage() {
  const [users, setUsers] = useState([]);
  const functions = getFunctions();

  //Check whether admin access or Suspicious access
  useEffect(() => {
    const checkAdmin = async () => {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdTokenResult();
        if (!token.claims.admin) {
          alert("access-denined");
          navigate("/");
        } else {
          navigate("/");
        }
      }
    };
  });

  // Fetch List of users using website
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const list = httpsCallable(functions, "listUsers");
        const res = await list();
        setUsers(res.data);
      } catch (error) {
        alert("Not authorise : " + error.message);
      }
    };

    fetchUsers();
  }, []);
  console.log("List of Users ", users);

  const adminSections = [
    {
      title: "👥 Manage Users",
      stats: [
        { label: "Total Users", value: "1,245", color: "#28a745" },
        { label: "Blocked Accounts", value: "15", color: "#dc3545" },
      ],
      extra: (
        <div className="table-responsive mt-4">
          <table className="table table-dark table-striped table-hover">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Gender</th>
                <th>Date Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>John Doe</td>
                <td>john@example.com</td>
                <td>Male</td>
                <td>2024-12-01</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2">Block</button>
                  <button className="btn btn-danger btn-sm">Delete</button>
                </td>
              </tr>
              <tr>
                <td>Jane Smith</td>
                <td>jane@example.com</td>
                <td>Female</td>
                <td>2025-01-15</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2">Block</button>
                  <button className="btn btn-danger btn-sm">Delete</button>
                </td>
              </tr>
              <tr>
                <td>Alex Johnson</td>
                <td>alex@example.com</td>
                <td>Other</td>
                <td>2025-03-03</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2">Block</button>
                  <button className="btn btn-danger btn-sm">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ),
    },
    {
      title: "📊 Reports Overview",
      stats: [
        { label: "User Growth", value: "+12%", color: "#17a2b8" },
        { label: "Reports Generated", value: "780", color: "#fd7e14" },
      ],
      extra: (
        <ul className="list-group mt-4">
          <li className="list-group-item bg-dark text-white">
            New Registrations Report
          </li>
          <li className="list-group-item bg-dark text-white">
            User Activity Summary
          </li>
          <li className="list-group-item bg-dark text-white">
            Suspicious Activity Logs
          </li>
        </ul>
      ),
    },
    {
      title: "💾 Storage Utilization",
      stats: [
        {
          label: "Total Storage Used",
          value: "4.2 GB / 10 GB",
          color: "#6f42c1",
        },
      ],
      bar: {
        percent: 42,
        color: "#6f42c1",
      },
      extra: (
        <div className="table-responsive mt-4">
          <table className="table table-dark table-striped table-hover">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Gender</th>
                <th>Storage Used</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>John Doe</td>
                <td>john@example.com</td>
                <td>Male</td>
                <td>1.2 GB</td>
              </tr>
              <tr>
                <td>Jane Smith</td>
                <td>jane@example.com</td>
                <td>Female</td>
                <td>980 MB</td>
              </tr>
              <tr>
                <td>Alex Johnson</td>
                <td>alex@example.com</td>
                <td>Other</td>
                <td>2.0 GB</td>
              </tr>
            </tbody>
          </table>
        </div>
      ),
    },
    {
      title: "📈 Analytics",
      stats: [
        { label: "Daily Active Users", value: "312", color: "#20c997" },
        { label: "Avg Session Time", value: "5m 32s", color: "#ffc107" },
      ],
    },
  ];

  return (
    <div className="container-fluid bg-dark text-white min-vh-100">
      <div className="row">
        <aside className="col-md-3 col-lg-2 bg-secondary p-0 vh-100 sticky-top">
          <SideBar />
        </aside>

        <main className="col-md-9 col-lg-10 py-4">
          <h1 className="h3 mb-4">🛠️ Admin Dashboard</h1>

          <div className="accordion" id="adminAccordion">
            {adminSections.map((section, index) => (
              <div
                className="accordion-item bg-dark border border-secondary mb-3"
                key={index}
              >
                <h2 className="accordion-header">
                  <button
                    className="accordion-button bg-secondary text-white"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse-${index}`}
                    aria-expanded="false"
                    aria-controls={`collapse-${index}`}
                  >
                    {section.title}
                  </button>
                </h2>
                <div
                  id={`collapse-${index}`}
                  className="accordion-collapse collapse"
                  data-bs-parent="#adminAccordion"
                >
                  <div className="accordion-body">
                    <div className="row g-3">
                      {section.stats.map((stat, i) => (
                        <div className="col-md-6" key={i}>
                          <div className="card bg-secondary text-white">
                            <div className="card-body">
                              <h6
                                className="card-title mb-2"
                                style={{ fontSize: "0.9rem" }}
                              >
                                {stat.label}
                              </h6>
                              <h4
                                className="card-text"
                                style={{ color: stat.color }}
                              >
                                {stat.value}
                              </h4>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {section.bar && (
                      <div className="mt-3">
                        <div className="progress">
                          <div
                            className="progress-bar"
                            role="progressbar"
                            style={{
                              width: `${section.bar.percent}%`,
                              backgroundColor: section.bar.color,
                            }}
                            aria-valuenow={section.bar.percent}
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                        <small className="text-muted mt-1 d-block">
                          {section.bar.percent}% used
                        </small>
                      </div>
                    )}
                    {section.extra && (
                      <div className="mt-4">{section.extra}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
