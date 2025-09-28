import React, { createContext, useContext, useState, useEffect } from "react";
import { saveUserToStorage, getUserFromStorage, clearStorage } from "../utils/storage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getUserFromStorage());

  useEffect(() => {
    const u = getUserFromStorage();
    if (u) setUser(u);
  }, []);

  // resData expected: { token, user }
  const login = (resData) => {
    if (!resData) return;
    const token = resData.token;
    const userData = resData.user;
    saveUserToStorage(userData, token);
    setUser(userData || null);
  };

  const logout = () => {
    clearStorage();
    setUser(null);
    // optionally redirect handled by component
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
