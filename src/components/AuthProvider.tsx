import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn");

  if (!isLoggedIn || isLoggedIn === "false") {
    return <Navigate to="/login" />;
  }

  return <div>{children}</div>;
};

export default AuthProvider;
