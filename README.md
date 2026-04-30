# 🚀 TaskFlow — Modern Full Stack Task Manager

A beautifully designed **full-stack task management web app** with real-time authentication, drag-and-drop tasks, dark mode, and modern UI/UX.

---

## ✨ Features

### 🔐 Authentication

* User registration & login (JWT-based)
* Protected routes
* Persistent login (localStorage)

### 🧠 Task Management

* Create, update, delete tasks
* Mark tasks as completed / pending
* Task priority (Low / Medium / High)
* Due date support

### 🎯 Advanced UI

* Drag & drop tasks (Trello-style)
* Real-time progress bar
* Search & filter (All / Completed / Pending)
* Inline editing

### 🎨 UX Enhancements

* Dark mode 🌙
* Responsive collapsible sidebar
* Toast notifications
* Loading states

### 👤 User System

* Fetch logged-in user (`/auth/me`)
* Dynamic profile display
* Avatar upload support (ready)

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* Axios
* React Hot Toast
* Lucide Icons
* @hello-pangea/dnd (Drag & Drop)

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication
* bcryptjs

---

## 📁 Project Structure

```
taskflow/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   └── main.jsx
│
├── server/
│   ├── routes/
│   │   ├── auth.js
│   │   ├── tasks.js
│   ├── middleware/
│   ├── models/
│   └── server.js
│
└── README.md
```

---

## ⚙️ Installation

### 1️⃣ Clone the repo

```bash
git clone https://github.com/Harini492/TaskFlow.git
cd taskflow
```

---

### 2️⃣ Setup Backend

```bash
cd server
npm install
```

Create `.env` file:

```
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret_key
```

Run backend:

```bash
npm start
```

---

### 3️⃣ Setup Frontend

```bash
cd client
npm install
npm run dev
```

---

## 🔌 API Endpoints

### Auth

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
```

### Tasks

```
GET    /api/tasks
POST   /api/tasks
PUT    /api/tasks/:id
DELETE /api/tasks/:id
```

---

## 📸 Screenshots (Optional)

*Add screenshots here for better impact*

---

## 🚀 Future Improvements

* 🔔 Task reminders (notifications)
* ☁️ Cloudinary avatar upload
* 📊 Analytics dashboard
* 👥 Multi-user collaboration
* 📱 Mobile app (React Native)

---

## 🤝 Contributing

Pull requests are welcome. For major changes, open an issue first.

---

## 📄 License

MIT License

---

## 💡 Author

Built with ❤️ by **Harini R**

---

## ⭐ Show Your Support

If you like this project:

* ⭐ Star the repo
* 🍴 Fork it
* 🧠 Learn from it

---

> “Good UI gets attention. Great UX keeps users.”
