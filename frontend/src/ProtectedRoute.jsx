import { useContext } from "react";
import { AuthContext } from "./AuthProvider";
import Login from "./Login";

export default function ProtectedRoute({ children }) {
  const { token } = useContext(AuthContext);

  if (!token) return <Login />;

  return children;
}