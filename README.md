# TaskFlow — Team Project Management Tool

A full-stack Trello-style kanban board with real-time collaboration built with MongoDB, Express, React, Node.js, Redux, Socket.IO, and Material UI.

---

## Features

- **Kanban Boards** — drag-and-drop tasks across custom columns
- **Real-time collaboration** — Socket.IO syncs all changes live across teammates
- **Role-based access** — Owner / Member permissions per board
- **Task management** — priority levels, deadlines, assignees, labels, comments
- **Color-coded deadlines** — overdue, due today, due soon indicators
- **Full-text search** — MongoDB text indexes on task title & description
- **Email notifications** — Nodemailer sends alerts for assignments & invites
- **In-app notifications** — bell icon with unread count
- **Online presence** — see who's currently viewing a board

---

## Project Structure

```
taskflow/
├── server/                  # Node.js + Express backend
│   ├── config/db.js         # MongoDB connection
│   ├── controllers/         # Route handlers
│   │   ├── authController.js
│   │   ├── boardController.js
│   │   ├── taskController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── auth.js          # JWT protect middleware
│   │   └── boardAccess.js   # Role-based board access
│   ├── models/
│   │   ├── User.js
│   │   ├── Board.js
│   │   └── Task.js          # with $text index for search
│   ├── routes/
│   │   ├── auth.js
│   │   ├── boards.js
│   │   ├── tasks.js
│   │   └── users.js
│   ├── socket/
│   │   └── socketManager.js # Socket.IO init + event handlers
│   ├── utils/
│   │   ├── email.js         # Nodemailer templates
│   │   └── token.js         # JWT generation
│   └── index.js             # Entry point
│
└── client/                  # React frontend
    └── src/
        ├── components/
        │   ├── Board/
        │   │   ├── KanbanColumn.js
        │   │   ├── CreateBoardDialog.js
        │   │   ├── BoardSettingsDialog.js
        │   │   └── OnlineUsers.js
        │   ├── Task/
        │   │   ├── TaskCard.js
        │   │   ├── CreateTaskDialog.js
        │   │   └── TaskDetailDialog.js
        │   ├── Layout/
        │   │   └── AppLayout.js
        │   └── Common/
        │       └── GlobalSnackbar.js
        ├── hooks/
        │   └── useSocket.js
        ├── pages/
        │   ├── LoginPage.js
        │   ├── RegisterPage.js
        │   ├── DashboardPage.js
        │   ├── BoardPage.js
        │   └── ProfilePage.js
        ├── store/
        │   ├── index.js
        │   └── slices/
        │       ├── authSlice.js
        │       ├── boardSlice.js
        │       ├── taskSlice.js
        │       └── uiSlice.js
        ├── theme/index.js
        ├── utils/
        │   ├── api.js        # Axios instance with JWT interceptor
        │   ├── socket.js     # Socket.IO singleton
        │   └── helpers.js    # Priority config, deadline helpers
        └── App.js
```

---

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Gmail account (for email notifications, optional)

### 1. Clone & Install

```bash
git clone <repo-url>
cd taskflow
npm run install-all
```

### 2. Configure Environment

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000

# Optional: Gmail for email notifications
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=TaskFlow <your_email@gmail.com>
```

> **Gmail setup**: Enable 2FA → Google Account → Security → App Passwords → generate one for "Mail"

### 3. Run Development Servers

From the root directory:

```bash
npm run dev
```

This starts:
- Backend on `http://localhost:5000`
- Frontend on `http://localhost:3000`

---

## API Reference

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |
| PUT | `/api/auth/password` | Change password |
| GET | `/api/auth/notifications` | Get notifications |
| PUT | `/api/auth/notifications/read` | Mark all read |

### Boards
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/boards` | All boards for user |
| POST | `/api/boards` | Create board |
| GET | `/api/boards/:id` | Get board |
| PUT | `/api/boards/:id` | Update board (owner) |
| DELETE | `/api/boards/:id` | Delete board (owner) |
| POST | `/api/boards/:id/columns` | Add column |
| PUT | `/api/boards/:boardId/columns/:columnId` | Update column |
| DELETE | `/api/boards/:boardId/columns/:columnId` | Delete column (owner) |
| PUT | `/api/boards/:boardId/columns/reorder` | Reorder columns |
| POST | `/api/boards/:id/members` | Invite member (owner) |
| DELETE | `/api/boards/:id/members/:userId` | Remove member (owner) |

### Tasks
| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/tasks/board/:boardId` | All tasks for board |
| GET | `/api/tasks/search?boardId=&q=` | Full-text search |
| PUT | `/api/tasks/reorder` | Bulk reorder |
| POST | `/api/tasks` | Create task |
| GET | `/api/tasks/:id` | Get task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| POST | `/api/tasks/:id/comments` | Add comment |
| DELETE | `/api/tasks/:id/comments/:commentId` | Delete comment |

---

## Socket.IO Events

### Client → Server
| Event | Payload | Description |
|-------|---------|-------------|
| `board:join` | `boardId` | Join board room |
| `board:leave` | `boardId` | Leave board room |
| `task:typing` | `{ boardId, taskId }` | Broadcast typing |

### Server → Client
| Event | Payload | Description |
|-------|---------|-------------|
| `task:created` | Task object | New task created |
| `task:updated` | Task object | Task modified |
| `task:deleted` | `{ taskId }` | Task removed |
| `board:updated` | Board object | Board/columns changed |
| `board:deleted` | `{ boardId }` | Board deleted |
| `user:online` | `{ userId, name, avatar }` | User joined board |
| `user:offline` | `{ userId }` | User left board |

---

## Production Deployment

### Build client
```bash
cd client && npm run build
```

### Serve with Express (add to server/index.js)
```js
const path = require('path');
app.use(express.static(path.join(__dirname, '../client/build')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../client/build/index.html')));
```

### Environment variables for production
- Set `NODE_ENV=production`
- Use a strong random `JWT_SECRET`
- Use MongoDB Atlas for `MONGO_URI`
- Set `CLIENT_URL` to your deployed frontend URL

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Database | MongoDB + Mongoose |
| Backend | Node.js + Express |
| Real-time | Socket.IO |
| Auth | JWT + bcryptjs |
| Email | Nodemailer |
| Frontend | React 18 |
| State | Redux Toolkit |
| UI | Material UI v5 |
| Drag & Drop | @hello-pangea/dnd |
| Routing | React Router v6 |
| HTTP Client | Axios |
