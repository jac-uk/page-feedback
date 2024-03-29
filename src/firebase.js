import * as firebase from 'firebase/app';
import 'firebase/firestore';

// Configure and initialise Firebase
// Config variables are pulled from the environment at build time
const config = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
};
firebase.initializeApp(config);

// Initialise Firestore
const firestore = firebase.firestore();

export {firestore};
export default firebase;
