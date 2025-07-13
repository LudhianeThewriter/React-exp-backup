const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const runtime = {
  timeoutSeconds: 60,
  memory: "256MB",
};
// Setting role of User
exports.autoGrantBaseAdmin = functions
  .runWith(runtime)
  .auth.user()
  .onCreate(async (user) => {
    const BASE_Mail = "sharmakaran7910929@gmail.com";
    if (user.email && user.email.toLowerCase() == BASE_Mail.toLowerCase()) {
      await admin.auth().setCustomUserClaims(user.uid, { admin: true });
      console.log(`Admin Claim set for base email : ${user.email}`);
    }
  });

// List of all users
exports.listUsers = functions
  .runWith(runtime)
  .https.onCall(async (data, context) => {
    try {
      const listUsersResult = await admin.auth().listUsers(1000);
      return listUsersResult.users.map((user) => ({
        uid: user.uid,
        email: user.email,
        disabled: user.disabled,
        metadata: user.metadata,
      }));
    } catch (error) {
      throw new functions.https.HttpsError("internal", error.message);
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
      throw new functions.https.HttpsError("internal", error.message);
    }
  });

// Block Users by disabling their account (Admin only)

exports.blockUserByIdV1 = functions
  .runWith(runtime)
  .https.onCall(async (data, context) => {
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
