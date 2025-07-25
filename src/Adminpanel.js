import React, { useState, useEffect, useCallback } from "react";
import SideBar from "./UserSideBar";
import { auth } from "./firebase";
import { getFunctions, httpsCallable } from "firebase/functions";
import { useNavigate } from "react-router-dom";

export default function AdminDashboardPage() {
  const [users, setUsers] = useState([]);
  const [userTotal, setUserTotal] = useState({ count: 0, blocked: 0 });
  const functions = getFunctions();
  const navigate = useNavigate();
  const fetchUsers = useCallback(async () => {
    try {
      const list = httpsCallable(functions, "listUsers");
      const res = await list();
      setUsers(res.data);
      console.log("List of users ", res.data);
      const uCount = res.data.length;
      const uBlocked = res.data.filter((user) => user.disabled === true).length;
      setUserTotal({ count: uCount, blocked: uBlocked });
    } catch (error) {
      alert("Backend error.. " + error.message);
    }
  }, [functions]);

  // Admin access check

  useEffect(() => {
    const checkAdmin = async () => {
      const user = auth.currentUser;
      if (!user) {
        await auth.signOut();
        navigate("/");
        return;
      }

      try {
        let tokenResult = await user.getIdTokenResult(true);

        console.log("Token Result 1 ", tokenResult);
        const isAdmin = tokenResult.claims?.admin == true;

        if (!isAdmin && user.email == "sharmakaran7910929@gmail.com") {
          console.log("Setting admin claims manually...");
          try {
            const setAdmin = httpsCallable(functions, "setAdminBaseManually");
            await setAdmin();

            await new Promise((r) => setTimeout(r, 1500));
            tokenResult = await user.getIdTokenResult(true);
          } catch (error) {
            alert("ReClaim Admin ", error.message);
          }
          if (!tokenResult.claims?.admin) {
            alert(
              "Admin access still not granted . PLease try logout and login..."
            );
            await auth.signOut();
            navigate("/");
          }
        } else if (!isAdmin) {
          alert("Access Denied :You are not admin");
          await auth.signOut();
          navigate("/");
        }
      } catch (error) {
        console.log("Token Error : ", error.message);
        alert("Error checking access...");
        await auth.signOut();
        navigate("/");
      }
    };
    checkAdmin();
  }, []);
  // Fetch users
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (uid) => {
    if (!window.confirm("Are you sure you want to delete this user ? ")) return;

    try {
      const deleteUser = httpsCallable(functions, "deleteUserByIdV1");
      const { data } = await deleteUser({ uid });
      alert(data.message);
      await fetchUsers();
    } catch (error) {
      alert("Failed to delete user " + error.message);
    }
  };

  const handleBlock = async (uid) => {
    console.log("Blocking user uid : ", uid);
    if (!window.confirm("Block this user ?")) return;

    try {
      const blockUser = httpsCallable(functions, "blockUserByIdV1");
      const { data } = await blockUser(uid);
      alert(data.message);
      await fetchUsers();
    } catch (error) {
      alert("Failed to block the user " + error.message);
    }
  };

  const handleUnblock = async (uid) => {
    console.log("Unblocking user uid : ", uid);
    if (!window.confirm("Unblock this user ?")) return;

    try {
      const UnblockUser = httpsCallable(functions, "UnblockUserByIdV1");
      const { data } = await UnblockUser(uid);
      alert(data.message);
      await fetchUsers();
    } catch (error) {
      alert("Failed to unblock the user " + error.message);
    }
  };

  const adminSections = [
    {
      title: "👥 Manage Users",
      stats: [
        { label: "Total Users", value: userTotal.count, color: "#28a745" },
        {
          label: "Blocked Accounts",
          value: userTotal.blocked,
          color: "#dc3545",
        },
      ],
      extra: (
        <div className="table-responsive mt-4">
          <table className="table table-striped table-bordered table-dark table-hover">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Gender</th>
                <th>Date Joined</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users && users.length > 0 ? (
                users.map((user) => (
                  <tr key={user.uid}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.gender}</td>
                    <td>{user.meta.creationTime}</td>
                    <td>{user.meta.lastSignInTime}</td>
                    <td>
                      {!user.disabled && (
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => handleBlock(user.uid)}
                        >
                          Block
                        </button>
                      )}
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(user.uid)}
                      >
                        Delete
                      </button>
                      {user.disabled && (
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => handleUnblock(user.uid)}
                        >
                          Unblock
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    No user records found!
                  </td>
                </tr>
              )}
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
          <table className="table table-striped table-dark table-bordered table-hover">
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
      className="container-fluid px-0 "
      style={{ minHeight: "100vh", overflow: "hidden" }}
    >
      <div className="row g-0" style={{ minHeight: "100vh" }}>
        {/* Sidebar (collapsible on smaller screens) */}
        <div className="col-md-3">
          <SideBar />
        </div>
        <main className="col-md-9 p-4 bg-dark" style={{ overflowY: "auto" }}>
          <h1 className="h3 mb-4 text-white">🛠️ Admin Dashboard</h1>

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
                        <div className="col-12 col-md-6" key={i}>
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
