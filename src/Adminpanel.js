import React from "react";
import SideBar from "./UserSideBar";

export default function AdminDashboardPage() {
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
                  <button className="btn btn-sm btn-warning me-2">Block</button>
                  <button className="btn btn-sm btn-danger">Delete</button>
                </td>
              </tr>
              <tr>
                <td>Jane Smith</td>
                <td>jane@example.com</td>
                <td>Female</td>
                <td>2025-01-15</td>
                <td>
                  <button className="btn btn-sm btn-warning me-2">Block</button>
                  <button className="btn btn-sm btn-danger">Delete</button>
                </td>
              </tr>
              <tr>
                <td>Alex Johnson</td>
                <td>alex@example.com</td>
                <td>Other</td>
                <td>2025-03-03</td>
                <td>
                  <button className="btn btn-sm btn-warning me-2">Block</button>
                  <button className="btn btn-sm btn-danger">Delete</button>
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
        <ul className="mt-4 list-group list-group-flush">
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
    <div
      className="d-flex"
      style={{ minHeight: "100vh", backgroundColor: "#15151f", color: "white" }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: "260px",
          position: "sticky",
          top: 0,
          height: "100vh",
          backgroundColor: "#1e1e2f",
          overflowY: "auto",
        }}
      >
        <SideBar />
      </aside>

      {/* Main Content */}
      <main className="flex-grow-1 p-4">
        <h1 className="h3 mb-4">🛠️ Admin Dashboard</h1>

        <div className="accordion" id="adminAccordion">
          {adminSections.map((section, index) => (
            <div
              className="accordion-item bg-transparent border border-secondary mb-3 rounded"
              key={index}
            >
              <h2 className="accordion-header">
                <button
                  className="accordion-button bg-dark text-white"
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
                        <div
                          className="card text-white"
                          style={{ backgroundColor: "#2e2e3e" }}
                        >
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
                      <div
                        className="bg-secondary rounded-pill"
                        style={{ height: "8px", overflow: "hidden" }}
                      >
                        <div
                          className="rounded-pill"
                          style={{
                            width: `${section.bar.percent}%`,
                            backgroundColor: section.bar.color,
                            height: "100%",
                          }}
                        ></div>
                      </div>
                      <small className="text-muted mt-1 d-block">
                        {section.bar.percent}% used
                      </small>
                    </div>
                  )}
                  {section.extra && <div className="mt-4">{section.extra}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
