/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {logger} = require("firebase-functions");
const {onRequest} = require("firebase-functions/v2/https");
const {initializeApp} = require("firebase-admin/app");
const admin = require("firebase-admin");

initializeApp();

exports.sendNotifications = onRequest(async (req, res) => {
  console.log(req.body);
  const data = req.body.data;
  console.log(data);
  console.log(data.tokens);
  const messages = data.tokens.map((token) => ({
    notification: {
      title: data.title,
      body: data.body,
    },
    token: token,
  }));

  return admin.messaging().sendEach(messages)
      .then((res) => {
        logger.info("Notification sent");
        return {success: true, res: res.responses};
      })
      .catch((e) => {
        logger.error("Notification not sent", e.message);
        return {success: false, res: res.responses};
      });
});
