import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authorized, setAuthorized] = useState(false);
  const [userData, setUserData] = useState(null);

  const login = (userData) => {
    setAuthorized(true);
    setUserData(userData);
  };

  const logout = () => {
    setUserData(null);
    setAuthorized(false);
  };

  return (
    <AuthContext.Provider value={{ authorized, login, logout, userData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
