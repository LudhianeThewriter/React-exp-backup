const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
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
