import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

const ProtectedRoute = ({ children }: Props) => {
  return isAuthenticated() ? children : <Navigate to="/" />;
};

export default ProtectedRoute;