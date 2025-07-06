const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// Setting role of User

exports.setUserRole = functions.https.onCall(async (data, context) => {
  if (!context.auth?.token.admin) {
    throw new functions.https.HttpsError("permission-denied", "Admin-Only");
  }

  const { uid, role } = data;

  if (!["admin", "user"].includes(role)) {
    throw new functions.https.HttpsError("invalid-argument", "Invalid-role");
  }

  try {
    await admin.auth().setCustomUserClaims(uid, { admin: role == "admin" });
    return { message: `Role of user ${uid} has been set to ${role}` };
  } catch (error) {
    throw new functions.https.HttpsError("internal", error.message);
  }
});

// Delete User by UID

exports.deleteUserById = functions.https.onCall(async (data, context) => {
  // only allow users with admin claim
  if (!context.auth?.token.admin) {
    throw new functions.https.HttpsError("permission-denied", "Admins Only");
  }

  const uid = data.uid;

  try {
    await admin.auth().deleteUser(uid);
    return { message: `User ${uid} deleted successfully` };
  } catch (error) {
    throw new functions.https.HttpsError("internal", error.message);
  }
});

// Block Users by disabling their account (Admin only)

exports.blockUserById = functions.https.onCall(async (data, context) => {
  if (!context.auth?.token.admin) {
    throw new functions.https.HttpsError("permission-denied", "Admin only");
  }

  const uid = data.uid;

  try {
    await admin.auth().updateUser(uid, { disabled: true });
    return { message: ` User ${uid} has been blocked` };
  } catch (error) {
    throw new functions.https.HttpsError("internal", error.message);
  }
});
