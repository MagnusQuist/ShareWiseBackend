/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const functions = require("firebase-functions");
const {onRequest, HttpsError} = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
admin.initializeApp();

exports.sendNotifications = onRequest((request, response) => {
  const data = request.body;
  const messages = data.tokens.map((token) => ({
    notification: {
      title: data.title,
      body: data.body,
    },
    token: token,
  }));

  return admin.messaging().sendEach(messages)
      .then((response) => {
        functions.info("Notification sent");
        return {success: true, response: response.responses};
      })
      .catch((e) => {
        functions.error("Notification not sent", e.message);
        throw new HttpsError("unknown", e.message, e);
      });
});
