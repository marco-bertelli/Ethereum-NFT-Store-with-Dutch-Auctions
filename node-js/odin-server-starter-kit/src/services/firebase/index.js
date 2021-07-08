const firebase = require('firebase-admin');
import { pushNotificationEnabled, firebaseSDK } from '../../config';

if (pushNotificationEnabled) {
    firebase.initializeApp({
        credential: firebase.credential.cert(firebaseSDK)
    });
}
module.exports.sendMessage =
    (firebaseToken, payload, options) => firebase.messaging().sendToDevice(firebaseToken, payload, options);
