import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const storedUser = JSON.parse(localStorage.getItem("userInfo"));

  const [user, setUser] = useState(storedUser || null);

  useEffect(() => {
    localStorage.setItem("userInfo", JSON.stringify(user));
  }, [user]);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("userInfo");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
