import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { FaMapMarkerAlt } from "react-icons/fa";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";

import {
  FaUserShield,
  FaSignInAlt,
  FaUser,
  FaEnvelope,
  FaLock,
  FaVenusMars,
} from "react-icons/fa";
import { motion } from "framer-motion";

export default function UserReg() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [gender, setGender] = useState("");
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("");
  const [regType, setRegType] = useState("Login");
  const [loading, setLoading] = useState(false);
  const [coordinates, setCoordinates] = useState({ lat: null, long: null });
  const [autolocation, setAutoLocation] = useState("");
  const [emailVerified, setEmailVerified] = useState(true);
  const [unverifiedUser, setUnverifiedUser] = useState(null);
  const functions = getFunctions();
  const baseMail = "sharmakaran7910929@gmail.com";
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    if (!userEmail || !userPassword || !userName || gender === "") {
      setStatus("Please fill all required fields");
      setLoading(false);
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userEmail,
        userPassword
      );

      await sendEmailVerification(userCredential.user);
      setStatus("Verification Email Sent. Please Check your Inbox");

      const isAdmin =
        baseMail.toLowerCase() == userCredential.user.email.toLowerCase();
      const role = isAdmin ? "admin" : "user";
      const plan = isAdmin ? "all" : "regular";

      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: userCredential.user.email,
        username: userName,
        gender: gender,
        createdAt: new Date(),
        lat: coordinates.lat,
        long: coordinates.long,
        role: role,
        plan: plan,
      });

      if (isAdmin) {
        await auth.currentUser.getIdToken(true);
      }
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setStatus("Email already Registered");
      } else if (error.code === "auth/invalid-email") {
        setStatus("Invalid Email");
      } else if (error.code === "auth/weak-password") {
        setStatus("Password must be at least 6 characters");
      } else {
        setStatus(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const resendLink = async (e) => {
    if (unverifiedUser) {
      try {
        await sendEmailVerification(unverifiedUser);
        setStatus("Verification Mail sent. Please check your inbox");
      } catch (err) {
        console.log("Verification problem ", err);
        setStatus("Fail to send Verification Link " + err.message);
      }
    } else {
      setStatus("Login first to resend the verification link.");
    }
  };
  const handleLogIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        userEmail,
        userPassword
      );

      if (!userCredential.user.emailVerified) {
        setUnverifiedUser(userCredential.user);
        setEmailVerified(false);
        setStatus("Email Not Verified. Please verify it before Logging In");
        await signOut(auth);
      } else {
        setUser(userCredential.user);
        const token = await userCredential.user.getIdToken(true);
        console.log("Try to login token : ", token);
        // https://us-central1-expense-a4a50.cloudfunctions.net/api
        await fetch(
          "https://us-central1-expense-a4a50.cloudfunctions.net/api/secure-endpoint",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              event: "login",
              email: userCredential.user.email,
            }),
          }
        );
        navigate("/dashboard");
      }
    } catch (error) {
      setStatus("Wrong Email / Password");
      const logEvent = httpsCallable(functions, "logSuspiciousActivity");
      logEvent({
        type: "Login Failure",
        email: userEmail,
        error: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogOut = async () => {
    await signOut(auth);
    setUser(null);
    setStatus("Logged Out");
  };

  const handleForgotPassword = async () => {
    const email = prompt("Enter your email for reset password");
    if (!email) return;
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setStatus("Password reset link sent to your email (if it exists)");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      console.log("Hello location");
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ lat: latitude, long: longitude });
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    } else {
      alert("GeoLocation not supported");
    }

    console.log("Coords : ", coordinates);
  }, []);

  return (
    <div className="container my-5" style={{ maxWidth: "480px" }}>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-4"
      >
        <FaUserShield size={50} className="text-primary mb-2" />
        <h1 className="fw-bold">Expencer</h1>
        <p className="text-secondary fst-italic mb-4">
          Your trusted expense tracking partner
        </p>

        <div
          className="btn-group"
          role="group"
          aria-label="Login or Signup toggle"
        >
          <button
            onClick={() => {
              setRegType("Login");
              setUserEmail("");
              setUserPassword("");
              setUserName("");
              setGender("");
              setStatus("");
            }}
            className={`btn btn-outline-primary ${
              regType === "Login" ? "active" : ""
            }`}
          >
            <FaSignInAlt className="me-2" />
            Login
          </button>
          <button
            onClick={() => {
              setRegType("SignUp");
              setUserEmail("");
              setUserPassword("");
              setUserName("");
              setGender("");
              setStatus("");
            }}
            className={`btn btn-outline-success ${
              regType === "SignUp" ? "active" : ""
            }`}
          >
            <FaUser className="me-2" />
            Signup
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="card shadow p-4"
      >
        {regType === "SignUp" && (
          <form onSubmit={handleSignUp}>
            <div className="mb-3">
              <label className="form-label">
                <FaEnvelope className="me-2" />
                Email
              </label>
              <input
                required
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                <FaLock className="me-2" />
                Password
              </label>
              <input
                required
                type="password"
                className="form-control"
                placeholder="Enter your password"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                <FaUser className="me-2" />
                Username
              </label>
              <input
                required
                type="text"
                className="form-control"
                placeholder="Choose a username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="form-label">
                <FaVenusMars className="me-2" />
                Gender
              </label>
              <select
                required
                className="form-select"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">-- Select Gender --</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="form-label">
                <FaMapMarkerAlt className="me-2 text-danger" /> Location (Auto)
              </label>
              <input
                type="text"
                class="form-control"
                value={
                  coordinates.lat && coordinates.long
                    ? `${coordinates.lat.toFixed(
                        6
                      )} , ${coordinates.long.toFixed(6)}`
                    : "Detecing Location..."
                }
                disabled
              />
              {coordinates.lat && coordinates.long ? (
                <small className="text-success">
                  📍 Coordinates auto-detected successfully.
                </small>
              ) : (
                <small className="text-muted">
                  Waiting for geolocation permission...
                </small>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-warning w-100 fw-semibold"
              disabled={loading}
            >
              {loading && (
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
              )}
              Sign Up
            </button>
          </form>
        )}

        {regType === "Login" && (
          <form onSubmit={handleLogIn}>
            <div className="mb-3">
              <label className="form-label">
                <FaEnvelope className="me-2" />
                Email
              </label>
              <input
                required
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                <FaLock className="me-2" />
                Password
              </label>
              <input
                required
                type="password"
                className="form-control"
                placeholder="Enter your password"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
              />
            </div>

            <div className="text-end mb-3">
              <button
                type="button"
                className="btn btn-link p-0"
                style={{ fontSize: "0.9rem" }}
                onClick={handleForgotPassword}
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 fw-semibold"
              disabled={loading}
            >
              {loading && (
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
              )}
              Log In
            </button>
          </form>
        )}
      </motion.div>

      {status && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="alert alert-info mt-4 text-center"
          role="alert"
        >
          {status}
          {!emailVerified && (
            <button
              className="btn btn-sm btn-outline-secondary mt-2"
              onClick={resendLink}
            >
              Not Received Verification Link?
            </button>
          )}
        </motion.div>
      )}
    </div>
  );
}
