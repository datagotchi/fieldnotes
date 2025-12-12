import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";

import useAPI from "../hooks/useAPI";

const UserContext = createContext(undefined);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  // Initialize API hook here, inside the provider
  const api = useAPI(user);

  // Load user from cookie on initial load
  useEffect(() => {
    try {
      const cookieUserString = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=");

      if (cookieUserString && cookieUserString[1]) {
        const cookieUser = JSON.parse(decodeURIComponent(cookieUserString[1]));
        setUser(cookieUser);
      }
    } catch (error) {
      console.error("Failed to parse user cookie", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      user,
      setUser,
      loading,
      isAuthenticated: !!user,
      api,
    }),
    [user, loading, api]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
