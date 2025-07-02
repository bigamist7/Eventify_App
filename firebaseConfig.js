//FirebaseConfig.js
import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBS49BdEsTJyJUvRDyw1SWM-BEpn4p8aIU",
  authDomain: "db-95bb8.firebaseapp.com",
  projectId: "db-95bb8",
  storageBucket: "db-95bb8.appspot.com",
  messagingSenderId: "997219172096",
  appId: "1:997219172096:web:e3edf4810676912aa33de5",
  measurementId: "G-FTF8KCVEB5"
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;




