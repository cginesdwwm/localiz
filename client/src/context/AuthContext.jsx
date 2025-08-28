import { useContext, useState } from "react";
import { createContext } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userConnected, setUserConnected] = useState(null);

  console.log(userConnected);
  const login = async (values) => {
    setUserConnected(values);
  };

  const logout = () => {
    setUserConnected(null);
  };

  return (
    <AuthContext.Provider
      value={{
        userConnected,
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
