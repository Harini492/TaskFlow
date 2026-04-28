import { useState, useEffect, useContext } from "react";
import API from "./api";
import toast from "react-hot-toast";
import { Moon, Sun, User, ArrowRight, Command } from "lucide-react";
import { AuthContext } from "./AuthProvider"; // ✅ ADD THIS

export default function Login() { // ❌ remove setToken prop
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const { login } = useContext(AuthContext); // ✅ USE CONTEXT

  // THEME ENGINE
  useEffect(() => {
    const root = window.document.documentElement;
    isDark ? root.classList.add("dark") : root.classList.remove("dark");
  }, [isDark]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) return toast.error("Enter all details");

    setIsLoading(true);
    try {
      const res = await API.post("/auth/login", { username, password });

      // ✅ IMPORTANT CHANGE HERE
      login(res.data.token);

      toast.success("Login Successful 🚀");
    } catch (err) {
      toast.error("Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 transition-colors duration-300 p-6">

      {/* THEME TOGGLE */}
      <button 
        onClick={() => setIsDark(!isDark)} 
        className="fixed top-6 right-6 p-3 bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all active:scale-90"
      >
        {isDark ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-slate-500" />}
      </button>

      <div className="w-full max-w-[440px]">

        {/* LOGO */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-3xl bg-blue-600 flex items-center justify-center text-white shadow-xl shadow-blue-500/30 mb-6 rotate-3">
            <Command size={32} />
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-blue-600 dark:text-blue-500">
            TaskFlow
          </h1>
          <p className="opacity-60 mt-2 text-center font-bold uppercase tracking-widest text-[10px]">
            Productivity Reimagined
          </p>
        </div>

        {/* LOGIN CARD */}
        <div className="bg-white dark:bg-[#1e293b] p-8 md:p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl">

          <form onSubmit={handleLogin} className="space-y-6">

            {/* USERNAME */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black tracking-widest opacity-50 ml-1">
                Username
              </label>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-blue-500">
                  <User size={18} />
                </div>

                <input
                  type="text"
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border rounded-2xl focus:ring-2 ring-blue-500/20 focus:border-blue-500 font-bold"
                  placeholder="name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="space-y-2">
              <div className="flex justify-between px-1">
                <label className="text-[10px] uppercase font-black tracking-widest opacity-50">
                  Password
                </label>
              </div>

              <input
                type="password"
                className="w-full px-4 py-4 bg-slate-50 dark:bg-slate-900 border rounded-2xl focus:ring-2 ring-blue-500/20 focus:border-blue-500 font-bold"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-lg shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Enter <ArrowRight size={20} />
                </>
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}