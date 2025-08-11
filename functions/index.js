const functions = require("firebase-functions");
const admin = require("firebase-admin");

// server config

const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const xssClean = require("xss-clean");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
admin.initializeApp({ credential: admin.credential.applicationDefault() });

app.use(helmet());

app.use(cors());
app.use(xssClean());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests ,Try next day",
});

app.use("/secure-endpoint", limiter);

app.post("/secure-endpoint", async (req, res) => {
  console.log("🔐 Hit /secure-endpoint");
  const authHeader = req.headers.authorization || "";
  const token = authHeader.replace("Bearer ", "");
  console.log("🪪 Authorization Header:", authHeader);
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("❌ Missing or malformed Bearer token");
    return res.status(403).send("UnAuthorised");
  }

  console.log("📦 Extracted Token:", token ? "✅ Present" : "❌ Missing");

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log("user id verified ", decodedToken.uid);
    const userUid = decodedToken.uid;

    res.send({ message: "Logged in ", uid: userUid });
  } catch (error) {
    console.log("Error while verifying ", error.message);
    res.status(401).json({ error: "UnAuthorised-Invalid Token" });
  }
});

// firebase db config

const db = admin.firestore();
const runtime = {
  timeoutSeconds: 60,
  memory: "256MB",
};

// If user already exists
exports.setAdminBaseManually = functions
  .runWith(runtime)
  .https.onCall(async (data, context) => {
    // Ensure user is authenticated
    if (!context.auth) {
      throw new functions.https.HttpsError("unauthenticated", "Login Required");
    }

    // Extra protection :Allow only base BASE_Mail
    const callerEmail = context.auth.token.email;
    const BASE_Mail = "sharmakaran7910929@gmail.com";

    if (callerEmail.toLowerCase() != BASE_Mail.toLowerCase()) {
      throw new functions.https.HttpsError(
        "permission-denied",
        "You are not allowed"
      );
    }

    //Optional Protection: Allow one time usage
    const alreadUsedDoc = await admin
      .firestore()
      .doc("system/adminSetOnce")
      .get();

    if (alreadUsedDoc.exists) {
      throw new functions.https.HttpsError(
        "already-exists",
        "Admin already set"
      );
    }
    const snapshot = await admin.auth().getUserByEmail(BASE_Mail);
    await admin.auth().setCustomUserClaims(snapshot.uid, { admin: true });
    return { message: `Admin claim manually for ${BASE_Mail}` };
  });

// Setting role of User
exports.autoGrantBaseAdmin = functions
  .runWith(runtime)
  .auth.user()
  .onCreate(async (user) => {
    const BASE_Mail = "sharmakaran7910929@gmail.com";
    if (user.email && user.email.toLowerCase() == BASE_Mail.toLowerCase()) {
      try {
        const currentUser = await admin.auth().getUser(user.uid);
        const claims = currentUser.customClaims || {};

        if (!claims.admin) {
          await admin.auth().setCustomUserClaims(user.uid, { admin: true });
          console.log(`✅ Admin claim set for base email: ${user.email}`);
        } else {
          console.log(`ℹ️ Admin claim already exists for: ${user.email}`);
        }
      } catch (error) {
        console.error(`❌ Error setting admin claim for ${user.email}:`, error);
      }

      //
      // console.log(`Admin Claim set for base email : ${user.email}`);
    }
  });

// List of all users
exports.listUsers = functions
  .runWith(runtime)
  .https.onCall(async (data, context) => {
    console.log("Decoded token:", context.auth?.token);

    // Ensure admin access only

    if (!context.auth?.token.admin) {
      throw new functions.https.HttpsError("permission-denied", "Admin only");
    }

    try {
      const listUsersResult = await admin.auth().listUsers(1000);
      const userProfiles = await Promise.all(
        listUsersResult.users.map(async (user) => {
          const profileDoc = await admin
            .firestore()
            .collection("users")
            .doc(user.uid)
            .get();
          const profileData = profileDoc.exists ? profileDoc.data() : {};
          return {
            uid: user.uid,
            email: user.email,
            meta: user.metadata,
            disabled: user.disabled,
            gender: profileData.gender || null,
            username: profileData.username || null,
            plan: profileData.plan || null,
          };
        })
      );

      return userProfiles;
    } catch (error) {
      throw new functions.https.HttpsError("internal 1", error.message);
    }
  });

// Delete User by UID

exports.deleteUserByIdV1 = functions
  .runWith(runtime)
  .https.onCall(async (data, context) => {
    // only allow users with admin claim
    if (!context.auth?.token.admin) {
      throw new functions.https.HttpsError("permission-denied", "Admins Only");
    }

    const uid = data.uid;

    try {
      await admin.auth().deleteUser(uid);
      return { message: `User ${uid} deleted successfully` };
    } catch (error) {
      throw new functions.https.HttpsError("internal 2", error.message);
    }
  });

// Block Users by disabling their account (Admin only)

exports.blockUserByIdV1 = functions
  .runWith(runtime)
  .https.onCall(async (data, context) => {
    if (!context.auth?.token.admin) {
      throw new functions.https.HttpsError("permission-denied", "Admin only");
    }

    const uid = data;

    try {
      await admin.auth().updateUser(uid, { disabled: true });
      // audit log
      await db.collection("adminLogs").add({
        performBy: context.auth.uid,
        action: "block_user",
        targetUid: uid,
        details: "User blocked",
        timeStamp: admin.firestore.FieldValue.serverTimestamp(),
      });
      return { message: ` User ${uid} has been blocked` };
    } catch (error) {
      throw new functions.https.HttpsError("internal 3", error.message);
    }
  });

exports.UnblockUserByIdV1 = functions
  .runWith(runtime)
  .https.onCall(async (data, context) => {
    if (!context.auth?.token.admin) {
      throw new functions.https.HttpsError("permission-denied", "Admin only");
    }

    const uid = data;

    try {
      await admin.auth().updateUser(uid, { disabled: false });
      // audit log
      await db.collection("adminLogs").add({
        performBy: context.auth.uid,
        action: "unblock_user",
        targetUid: uid,
        details: "User blocked",
        timeStamp: admin.firestore.FieldValue.serverTimestamp(),
      });
      return { message: ` User ${uid} has been unblocked` };
    } catch (error) {
      throw new functions.https.HttpsError("internal 4", error.message);
    }
  });

// Check suspicious activity during Login

exports.logSuspiciousActivity = functions.https.onCall(
  async (data, context) => {
    return await admin.firestore().collection("securityLogs").add({
      type: data.type,
      detail: data,
      uid: context.auth?.uid,
      time: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
);

//--- CREATE DOWNLOADABLE EXCEL TEMPLATE FOR WITH SOME STANDARDS

const Exceljs = require("exceljs");

app.get("/downloadExcel", async (req, res) => {
  const workbook = new Exceljs.Workbook();
  const worksheet = workbook.addWorksheet("Expense_template");

  //Add headers
  worksheet.columns = [
    { header: "Expense Category", key: "category", width: 30 },
    { header: "Amount", key: "amount", width: 15 },
    { header: "Date", key: "date", width: 20 },
    { header: "Remarks", key: "remarks", width: 40 },
  ];

  // Lock Header Rows

  worksheet.getRow(1).eachCell((cell) => {
    (cell.protection = { locked: true }),
      (cell.font = { bold: true }),
      (cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFFE0B2" },
      });
  });

  // Add 20 Rows

  for (let i = 0; i < 20; i++) {
    worksheet.addRow({
      category: "",
      amount: "",
      date: "",
      remarks: "",
    });
  }

  // Apply dropdown data validation

  const categories = ["Milk & Newspaper", "Fruits & Vegetables", "Rent"];

  for (let i = 2; i <= 21; i++) {
    worksheet.getCell(`A${i}`).dataValidation = {
      type: "list",
      allowBlank: true,
      formulae: [`"${categories.join(",")}"`],
      showErrorMessage: true,
      error: "Choose a valid Expense category from dropdown",
    };
  }

  // Protect worksheet

  await worksheet.protect("123", {
    selectLockedCells: true,
    selectUnlockedCells: true,
    formatCells: false,
    insertRows: false,
    deleteRows: false,
  });

  res.setHeader(
    "Content-type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );

  res.setHeader(
    "Content-Disposition",
    "attachment; filename=Expense_template.xlsx"
  );

  await workbook.xlsx.write(res);

  res.end();
});

exports.api = functions.https.onRequest(app);
