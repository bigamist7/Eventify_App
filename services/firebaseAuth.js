// services/firebaseAuth.js
import firebase from "../firebaseConfig"; // ✅ firebase v8 usa import default

export const signIn = (email, password) => {
  const auth = firebase.auth?.(); // proteção extra
  if (!auth) throw new Error("firebase.auth() está undefined");
  return auth.signInWithEmailAndPassword(email, password);
};
