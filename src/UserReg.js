import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { setPersistence, browserSessionPersistence } from "firebase/auth";
import { FaMapMarkerAlt } from "react-icons/fa";
import RECAPTCHA from "react-google-recaptcha";
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
  const [captchaToken, setCaptchaToken] = useState(null);

  const [userObject, setUserObject] = useState({
    userEmail: "",
    userPassword: "",
    userName: "",
    gender: "",
  });

  const [userLoginInfo, setUserLoginInfo] = useState({
    userEmail: "",
    userPassword: "",
  });
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("");
  const [regType, setRegType] = useState("SignUp");
  const [loading, setLoading] = useState(false);
  const [coordinates, setCoordinates] = useState({ lat: null, long: null });
  const [autolocation, setAutoLocation] = useState("");
  const [emailVerified, setEmailVerified] = useState(true);
  const [unverifiedUser, setUnverifiedUser] = useState(null);
  const functions = getFunctions();
  const baseMail = "sharmakaran7910929@gmail.com";

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  useEffect(() => {
    if (user) {
      navigate("/dashboard"); // or wherever you want to send logged-in users
    }
  }, [user, navigate]);

  function handleUserSignupInfo(e) {
    setUserObject((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
    console.log("User Sign up ", userObject);
  }

  function handleUserLoginInfo(e) {
    setUserLoginInfo((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
    console.log("User login  ", userLoginInfo);
  }
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

    if (
      !userObject.userEmail ||
      !userObject.userPassword ||
      !userObject.userName ||
      userObject.gender === ""
    ) {
      setStatus("Please fill all required fields");
      setLoading(false);
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userObject.userEmail,
        userObject.userPassword
      );

      await sendEmailVerification(userCredential.user);
      setStatus("Verification Email Sent. Please Check your Inbox");

      const isAdmin =
        baseMail.toLowerCase() == userCredential.user.email.toLowerCase();
      const role = isAdmin ? "admin" : "user";
      const plan = isAdmin ? "all" : "regular";

      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: userCredential.user.email,
        username: userObject.userName,
        gender: userObject.gender,
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

    if (!captchaToken) {
      setStatus("Please complete Captcha first");
      return;
    }
    setLoading(true);
    setStatus("");
    try {
      const captchaFunction = httpsCallable(functions, "verifyCaptcha");
      const result = await captchaFunction({ token: captchaToken });
      console.log("Captcha result ", result.data);
      if (result.data.success) {
        setStatus("✅ Captcha verified. Proceeding with login...");

        await setPersistence(auth, browserSessionPersistence);

        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            userLoginInfo.userEmail,
            userLoginInfo.userPassword
          );

          console.log("");
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
            email: userLoginInfo.userEmail,
            error: error.message,
          });
        }
      } else {
        setStatus("❌ Captcha verification failed. Try again.");
      }
    } catch (error) {
      setStatus("Error " + error.message);
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
  }, []);

  // Force session only persistence

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
                name="userEmail"
                value={userObject.userEmail}
                onChange={handleUserSignupInfo}
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
                name="userPassword"
                value={userObject.userPassword}
                onChange={handleUserSignupInfo}
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
                name="userName"
                value={userObject.userName}
                onChange={handleUserSignupInfo}
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
                name="gender"
                value={userObject.gender}
                onChange={handleUserSignupInfo}
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
                name="userEmail"
                value={userLoginInfo.userEmail}
                onChange={handleUserLoginInfo}
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
                name="userPassword"
                value={userLoginInfo.userPassword}
                onChange={handleUserLoginInfo}
              />
            </div>

            <RECAPTCHA
              sitekey="6Ld38KorAAAAAJ2v4W635IWzYCidNyzW1h28AeHD"
              onChange={handleCaptchaChange}
            />

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
