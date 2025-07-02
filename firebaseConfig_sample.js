//FirebaseConfig.js
import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";

//Insert here your Firebase credentials
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;