import { useEffect, useState } from "react";
import API from "./api";
import toast from "react-hot-toast";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  LayoutDashboard, CheckCircle, Clock, Menu, X, Sun, Moon,
  LogOut, Plus, Trash2, Calendar, User as UserIcon, Edit2, Check,
  Search, Bell, GripVertical, Command
} from "lucide-react";

export default function Dashboard({ setToken }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("low"); 
  const [dueDate, setDueDate] = useState("");
  const [search, setSearch] = useState("");
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDark, setIsDark] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const [userData] = useState({ 
    name: "Harini R", 
    role: "Full Stack Developer",
    email: "harini.renu@example.com",
    github: "github.com/harini-r"
  });

  // --- LOGOUT FINAL FIX ---
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.clear(); 
    if (setToken) {
      setToken(""); 
    }
    toast.success("Logged out");
    // Forces the browser to reload and see that the token is gone
    setTimeout(() => {
      window.location.href = "/";
    }, 500);
  };

  useEffect(() => {
    const root = window.document.documentElement;
    isDark ? root.classList.add("dark") : root.classList.remove("dark");
  }, [isDark]);

  const requestNotificationPermission = () => {
    if ("Notification" in window) {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          setNotificationsEnabled(true);
          toast.success("Notifications Enabled!");
          new Notification("TaskFlow", { body: "Reminders are now active." });
        }
      });
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      toast.error("Fetch failed");
    }
  };

  const addTask = async () => {
    if (!title) return toast.error("Enter a title");
    try {
      await API.post("/tasks", { title, priority, dueDate: dueDate || null, completed: false });
      setTitle("");
      setDueDate("");
      setPriority("low");
      fetchTasks();
      toast.success("Task Added");
    } catch (err) {
      toast.error("Failed to add");
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTasks(items);
  };

  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
      toast.success("Deleted");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const toggleTask = async (task) => {
    try {
      await API.put(`/tasks/${task._id}`, { ...task, completed: !task.completed });
      fetchTasks();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const startEdit = (task) => {
    setEditingTask(task._id);
    setEditTitle(task.title);
  };

  const saveEdit = async (id) => {
    try {
      await API.put(`/tasks/${id}`, { title: editTitle });
      setEditingTask(null);
      fetchTasks();
      toast.success("Updated");
    } catch (err) {
      toast.error("Save failed");
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
    if (search.startsWith("#completed")) return t.completed;
    if (search.startsWith("#pending")) return !t.completed;
    return matchesSearch;
  });

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f8fafc] dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* SIDEBAR */}
      <aside className={`${sidebarOpen ? "w-72" : "w-20"} flex flex-col h-full bg-white dark:bg-[#1e293b] border-r border-slate-200 dark:border-slate-800 transition-all duration-300 shrink-0 z-20`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800">
          {sidebarOpen && <span className="font-bold text-xl text-blue-600 truncate flex items-center gap-2"><Command size={20}/> TaskFlow</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <SidebarItem icon={<LayoutDashboard size={20}/>} label="All Tasks" active={search === ""} onClick={() => setSearch("")} isOpen={sidebarOpen} />
          <SidebarItem icon={<CheckCircle size={20}/>} label="Completed" active={search === "#completed"} onClick={() => setSearch("#completed")} isOpen={sidebarOpen} />
          <SidebarItem icon={<Clock size={20}/>} label="Pending" active={search === "#pending"} onClick={() => setSearch("#pending")} isOpen={sidebarOpen} />
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <button onClick={requestNotificationPermission} className="flex items-center gap-3 w-full p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <Bell size={20} className={notificationsEnabled ? "text-green-500" : "text-slate-400"} />
            {sidebarOpen && <span className="text-sm font-medium">Alerts</span>}
          </button>
          
          <button onClick={() => setShowProfile(true)} className="flex items-center gap-3 w-full p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:ring-2 ring-blue-500 transition-all overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0 font-bold">{userData.name.charAt(0)}</div>
            {sidebarOpen && <div className="flex flex-col text-left truncate"><span className="text-sm font-bold truncate">{userData.name}</span><span className="text-[10px] opacity-60 uppercase font-black text-blue-500">Profile</span></div>}
          </button>

          <button onClick={() => setIsDark(!isDark)} className="flex items-center gap-3 w-full p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            {isDark ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} className="text-slate-500" />}
            {sidebarOpen && <span className="text-sm font-medium">Theme</span>}
          </button>

          <button onClick={logout} className="flex items-center gap-3 w-full p-2.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            <LogOut size={20} className="shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 h-full overflow-y-auto p-6 md:p-10">
        <div className="max-w-4xl mx-auto">
          
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Welcome, {userData.name}!</h2>
            <p className="text-sm text-slate-500">Track and manage your tasks efficiently.</p>
          </div>

          <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
              <input 
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 ring-blue-500 transition-all"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="w-full md:w-64">
              <div className="flex justify-between text-xs mb-1 font-bold"><span>Efficiency</span><span>{progress}%</span></div>
              <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 transition-all duration-1000 ease-out" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <StatCard label="Total" value={tasks.length} color="blue" />
            <StatCard label="Done" value={completedCount} color="green" />
            <StatCard label="Active" value={tasks.length - completedCount} color="orange" />
          </div>

          <div className="bg-white dark:bg-[#1e293b] p-3 rounded-2xl border border-slate-200 dark:border-slate-800 mb-8 shadow-sm flex flex-col md:flex-row gap-2">
            <input className="flex-1 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl outline-none" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New task..." />
            <div className="flex gap-2">
              <select 
                className="bg-slate-50 dark:bg-slate-900 p-3 rounded-xl text-xs outline-none font-bold"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <input type="date" className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl outline-none text-xs" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
              <button onClick={addTask} className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-xl font-bold shadow-lg active:scale-95 transition-all">Add</button>
            </div>
          </div>

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="tasks">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3 pb-10">
                  {filteredTasks.map((t, index) => (
                    <Draggable key={t._id} draggableId={t._id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`group flex justify-between items-center p-4 bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-slate-800 transition-all`}
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <div {...provided.dragHandleProps} className="text-slate-300 dark:text-slate-600 cursor-grab active:cursor-grabbing">
                              <GripVertical size={20}/>
                            </div>
                            <input type="checkbox" checked={t.completed} onChange={() => toggleTask(t)} className="w-5 h-5 accent-blue-600 cursor-pointer" />
                            <div className="flex-1">
                              {editingTask === t._id ? (
                                <div className="flex gap-2"><input className="bg-slate-100 dark:bg-slate-800 p-1 rounded w-full outline-none" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} autoFocus/><button onClick={() => saveEdit(t._id)} className="text-green-500"><Check size={20}/></button></div>
                              ) : (
                                <h4 className={`font-bold text-lg leading-tight ${t.completed ? "line-through opacity-30" : ""}`}>{t.title}</h4>
                              )}
                              <div className="flex gap-3 items-center mt-1">
                                <p className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-black text-slate-500 uppercase">{t.priority}</p>
                                <p className="text-[11px] opacity-40 flex items-center gap-1"><Calendar size={12}/> {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "No Deadline"}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => startEdit(t)} className="p-2 text-slate-400 hover:text-blue-500"><Edit2 size={18} /></button>
                            <button onClick={() => deleteTask(t._id)} className="p-2 text-slate-400 hover:text-red-500"><Trash2 size={18} /></button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <div className="mt-12 p-6 bg-white dark:bg-[#1e293b] rounded-3xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-sm font-black uppercase tracking-widest opacity-40 mb-4">Task Consistency (Last 7 Days)</h3>
            <div className="flex gap-2 overflow-x-auto">
              {[...Array(21)].map((_, i) => (
                <div key={i} className={`w-8 h-8 rounded-md shrink-0 transition-colors ${i % 3 === 0 ? 'bg-blue-600' : 'bg-slate-100 dark:bg-slate-800'}`} title={`Day ${i}: Tasks Finished`} />
              ))}
            </div>
          </div>
        </div>
      </main>

      {showProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1e293b] w-full max-w-md rounded-3xl p-8 shadow-2xl relative border border-slate-200 dark:border-slate-800">
            <button onClick={() => setShowProfile(false)} className="absolute top-6 right-6 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full"><X size={24}/></button>
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-3xl bg-blue-600 flex items-center justify-center text-white text-4xl font-black mb-4">{userData.name.charAt(0)}</div>
              <h2 className="text-2xl font-black">{userData.name}</h2>
              <p className="text-blue-500 font-bold text-sm mb-6 uppercase tracking-widest">{userData.role}</p>
              <div className="w-full space-y-4 text-left">
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl"><p className="text-[10px] uppercase opacity-50 font-black">Email</p><p className="font-bold">{userData.email}</p></div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl"><p className="text-[10px] uppercase opacity-50 font-black">GitHub</p><p className="font-bold text-blue-500">{userData.github}</p></div>
              </div>
              <button onClick={() => setShowProfile(false)} className="mt-8 w-full bg-slate-900 dark:bg-blue-600 text-white py-4 rounded-2xl font-bold">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick, isOpen }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all ${active ? "bg-blue-600 text-white shadow-lg" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
      <span className="shrink-0">{icon}</span>
      {isOpen && <span className="text-sm font-black whitespace-nowrap">{label}</span>}
    </button>
  );
}

function StatCard({ label, value, color }) {
  const styles = {
    blue: "border-blue-200 bg-blue-50 dark:bg-blue-900/20 text-blue-600",
    green: "border-green-200 bg-green-50 dark:bg-green-900/20 text-green-600",
    orange: "border-orange-200 bg-orange-50 dark:bg-orange-900/20 text-orange-600"
  };
  return (
    <div className={`p-6 rounded-2xl border ${styles[color]} shadow-sm transition-transform hover:-translate-y-1`}>
      <p className="text-[10px] uppercase font-black opacity-40 tracking-widest leading-none">{label}</p>
      <p className="text-4xl font-black mt-2 text-slate-800 dark:text-white">{value}</p>
    </div>
  );
}