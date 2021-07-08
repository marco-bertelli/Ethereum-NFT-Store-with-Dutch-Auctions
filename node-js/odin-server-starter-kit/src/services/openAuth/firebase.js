require('firebase/auth');
const firebase = require('firebase');
import { firebaseConfig } from '../../config';
import logger from 'winston';
let admin = require('firebase-admin');

firebase.initializeApp(firebaseConfig);
admin.initializeApp(firebaseConfig);

export function getUserData(googleIdToken) {
    // Build Firebase credential with the Google ID token.
    let credential = firebase.auth.GoogleAuthProvider.credential(googleIdToken);

    // Sign in with credential from the Google user.
    return firebase.auth().signInWithCredential(credential)
        .then(user => {

            return user;
        })
        .catch(function (error) {
            logger.error(error);
        });
}

export function validateToken(token){

    return admin.auth()
    .verifyIdToken(token,false)
    .then((decodedToken) => {
      console.log(decodedToken);
      // ...
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
}