const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

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
      throw new functions.https.HttpsError("internal", error.message);
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
      throw new functions.https.HttpsError("internal", error.message);
    }
  });

// Check suspicious activity during Login

exports.logSuspiciousActivity = functions.https.onCall(
  async (data, context) => {
    if (!context.auth?.token.admin) {
      throw new functions.https.HttpsError("permission-denied", "Admin only");
    }

    return await admin.firestore().collection("securityLogs").add({
      type: data.type,
      detail: data,
      uid: context.auth?.uid,
      time: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
);
