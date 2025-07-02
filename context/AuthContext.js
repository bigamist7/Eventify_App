// context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import firebase from "../firebaseConfig"; // ✅ compatível com Firebase v8

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = firebase.auth?.(); // ✅ proteção contra undefined

    if (!auth) {
      console.warn("🚨 firebase.auth() está undefined. Confirma firebaseConfig.js.");
      setLoading(false);
      return;
    }

    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      const auth = firebase.auth?.();
      if (auth) {
        await auth.signOut();
      } else {
        console.warn("🚨 firebase.auth() está undefined durante o logout.");
      }
    } catch (err) {
      console.log("Erro ao fazer logout:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
