import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import API from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const token =
      localStorage.getItem("access_token");

    if (!token) {
      setLoading(false);
      return;
    }

    API.get("/me")
      .then((response) => {
        setUser(response.data);
      })
      .catch(() => {
        localStorage.removeItem("access_token");
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });

  }, []);

  const login = (token) => {

    localStorage.setItem(
      "access_token",
      token
    );

    return API.get("/me")
      .then((response) => {
        setUser(response.data);
      });
  };

  const logout = () => {

    localStorage.removeItem(
      "access_token"
    );

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}