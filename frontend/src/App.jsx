import { useContext } from "react";
import Login from "./Login";
import Dashboard from "./Dashboard";
import { AuthContext } from "./AuthProvider";

export default function App() {
  const { token } = useContext(AuthContext);

  console.log("TOKEN:", token); // 🔥 DEBUG

  return token ? <Dashboard /> : <Login />;
}