<![CDATA[# 🚀 TeamHub

A production-quality, full-stack SaaS team collaboration platform built with the **MERN stack** (MongoDB, Express, React, Node.js). TeamHub brings together project management, task tracking, real-time notifications, and team collaboration into a single unified workspace.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Server Setup](#2-server-setup)
  - [3. Client Setup](#3-client-setup)
  - [4. Run the Application](#4-run-the-application)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Available Scripts](#-available-scripts)
- [License](#-license)

---

## ✨ Features

| Category | Features |
|---|---|
| **Authentication** | Register, login, logout, JWT access + refresh tokens, protected routes |
| **Projects** | Create, update, delete projects · Add/remove team members · Role-based access |
| **Tasks** | Full CRUD · Assign to members · Priority levels · Status tracking · Filtering |
| **Comments** | Threaded comments on tasks · Real-time updates |
| **Dashboard** | Analytics overview · Project/task stats · Activity feed |
| **Notifications** | In-app notifications · Mark as read · Bulk mark all as read |
| **Real-time** | Socket.io-powered live updates · Online/offline user presence · Project rooms |
| **File Uploads** | Cloudinary-backed file/image uploads with Multer |
| **UI/UX** | Dark/light theme · Responsive design · Animated transitions · Toast notifications |

---

## 🛠 Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** (≥ 18) | Runtime |
| **Express 5** | Web framework |
| **MongoDB + Mongoose 8** | Database + ODM |
| **Socket.io** | Real-time WebSocket communication |
| **JWT** (jsonwebtoken) | Authentication (access + refresh tokens) |
| **bcryptjs** | Password hashing |
| **Cloudinary** | Cloud file/image storage |
| **Multer** | File upload handling |
| **Helmet** | Security headers |
| **express-rate-limit** | API rate limiting |
| **express-validator** | Request validation |
| **Morgan** | HTTP request logging |

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** | UI library |
| **Vite 8** | Build tool + dev server |
| **Tailwind CSS 4** | Utility-first styling |
| **Redux Toolkit** | Global state management |
| **Redux Persist** | Persisted auth state |
| **React Router 7** | Client-side routing |
| **Axios** | HTTP client with interceptors |
| **Framer Motion** | Animations + transitions |
| **Recharts** | Dashboard charts + analytics |
| **React Hook Form + Zod** | Form handling + schema validation |
| **Lucide React** | Icon library |
| **React Hot Toast** | Toast notifications |

---

## 📁 Project Structure

```
teamhub/
├── client/                     # React frontend (Vite)
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── assets/             # Images, fonts, etc.
│   │   ├── components/         # Reusable UI components
│   │   │   ├── dashboard/      # Dashboard-specific components
│   │   │   ├── layout/         # Sidebar, header, app shell
│   │   │   ├── project/        # Project cards, forms, modals
│   │   │   └── task/           # Task cards, forms, filters
│   │   ├── constants/          # App-wide constants
│   │   ├── context/            # React context (ThemeProvider)
│   │   ├── hooks/              # Custom React hooks
│   │   ├── layouts/            # Page layouts (Auth, App)
│   │   ├── mock/               # Mock data for development
│   │   ├── pages/              # Route-level page components
│   │   │   ├── auth/           # Login, Register, Forgot Password
│   │   │   ├── dashboard/      # Dashboard overview
│   │   │   ├── notifications/  # Notifications center
│   │   │   ├── profile/        # User profile
│   │   │   ├── projects/       # Project list + detail views
│   │   │   ├── settings/       # App settings
│   │   │   └── tasks/          # Task management
│   │   ├── routes/             # Route definitions + ProtectedRoute
│   │   ├── services/           # Axios API client
│   │   ├── store/              # Redux store + slices
│   │   │   └── slices/         # auth, project, task, notification, ui
│   │   ├── styles/             # Global CSS + Tailwind config
│   │   └── utils/              # Utility functions
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                     # Express backend
│   ├── src/
│   │   ├── config/             # DB, Cloudinary, Socket.io setup
│   │   ├── constants/          # Enums + app constants
│   │   ├── controllers/        # Route handlers (business logic)
│   │   ├── jobs/               # Background jobs
│   │   ├── middleware/         # Auth, error handler, upload, validation
│   │   ├── models/             # Mongoose schemas
│   │   │   ├── User.js
│   │   │   ├── Project.js
│   │   │   ├── Task.js
│   │   │   ├── Comment.js
│   │   │   ├── Notification.js
│   │   │   └── ActivityLog.js
│   │   ├── routes/             # Express route definitions
│   │   ├── services/           # Service layer
│   │   ├── sockets/            # Socket.io event handlers
│   │   ├── uploads/            # Local file upload directory
│   │   ├── utils/              # Utility functions
│   │   ├── validators/         # Request validation schemas
│   │   └── app.js              # Express app factory
│   ├── server.js               # Entry point — bootstraps everything
│   ├── .env.example            # Environment variable template
│   └── package.json
│
├── .gitignore
├── LICENSE                     # MIT License
└── README.md
```

---

## 📦 Prerequisites

Before you begin, make sure you have the following installed:

- **[Node.js](https://nodejs.org/)** — v18.0.0 or higher
- **[npm](https://www.npmjs.com/)** — v9+ (comes with Node.js)
- **[MongoDB](https://www.mongodb.com/)** — Either:
  - A local MongoDB instance ([install guide](https://www.mongodb.com/docs/manual/installation/)), **or**
  - A free [MongoDB Atlas](https://www.mongodb.com/atlas) cloud cluster
- **[Cloudinary](https://cloudinary.com/) account** *(optional)* — Required only for file/image upload features. Sign up for a [free account](https://cloudinary.com/users/register_free).

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/teamhub.git
cd teamhub
```

### 2. Server Setup

```bash
# Navigate to the server directory
cd server

# Install dependencies
npm install

# Create your environment file from the template
cp .env.example .env
```

Now open `server/.env` and fill in your values:

```env
# Server Configuration
NODE_ENV=development
PORT=3001

# MongoDB — use your connection string
MONGODB_URI=mongodb://localhost:27017/teamhub
# Or for Atlas: mongodb+srv://<username>:<password>@<cluster>.mongodb.net/teamhub?retryWrites=true&w=majority

# JWT Secrets — use strong random strings (minimum 32 characters)
JWT_ACCESS_SECRET=your_access_token_secret_here_min_32_chars
JWT_REFRESH_SECRET=your_refresh_token_secret_here_min_32_chars
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Cloudinary (required for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS — must match your frontend URL
CLIENT_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

> **💡 Tip:** Generate secure JWT secrets with:
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

### 3. Client Setup

```bash
# Navigate to the client directory (from project root)
cd client

# Install dependencies
npm install
```

The client connects to the backend API at `http://localhost:3001/api` by default. To change this, set the `VITE_API_URL` environment variable:

```bash
# Optional: create client/.env
echo "VITE_API_URL=http://localhost:3001/api" > .env
```

### 4. Run the Application

You need **two terminal windows** — one for the server and one for the client.

**Terminal 1 — Start the server:**
```bash
cd server
npm run dev
```
The server will start on `http://localhost:3001` with hot-reload via Nodemon.

**Terminal 2 — Start the client:**
```bash
cd client
npm run dev
```
The client will start on `http://localhost:5173` and open in your browser automatically.

> ✅ **You're all set!** Visit **http://localhost:5173** to start using TeamHub.

---

## 🔐 Environment Variables

### Server (`server/.env`)

| Variable | Required | Default | Description |
|---|:---:|---|---|
| `NODE_ENV` | No | `development` | Environment mode (`development` / `production`) |
| `PORT` | No | `3001` | Server port |
| `MONGODB_URI` | **Yes** | — | MongoDB connection string |
| `JWT_ACCESS_SECRET` | **Yes** | — | Secret for signing access tokens |
| `JWT_REFRESH_SECRET` | **Yes** | — | Secret for signing refresh tokens |
| `JWT_ACCESS_EXPIRY` | No | `15m` | Access token expiration time |
| `JWT_REFRESH_EXPIRY` | No | `7d` | Refresh token expiration time |
| `CLOUDINARY_CLOUD_NAME` | No* | — | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | No* | — | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | No* | — | Cloudinary API secret |
| `CLIENT_URL` | No | `http://localhost:5173` | Frontend URL for CORS |
| `RATE_LIMIT_WINDOW_MS` | No | `900000` | Rate limit window (ms) |
| `RATE_LIMIT_MAX_REQUESTS` | No | `100` | Max requests per window |

> \* Cloudinary variables are only required if you want file/image upload functionality.

### Client (optional `client/.env`)

| Variable | Required | Default | Description |
|---|:---:|---|---|
| `VITE_API_URL` | No | `http://localhost:3001/api` | Backend API base URL |

---

## 📡 API Reference

All API endpoints are prefixed with `/api`. Protected routes require a `Bearer` token in the `Authorization` header.

### Health Check

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `GET` | `/api/health` | ✗ | Server health status |

### Authentication (`/api/auth`)

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `POST` | `/api/auth/register` | ✗ | Register a new user |
| `POST` | `/api/auth/login` | ✗ | Login and receive tokens |
| `POST` | `/api/auth/refresh-token` | ✗ | Refresh access token |
| `POST` | `/api/auth/logout` | ✓ | Logout and invalidate token |
| `GET` | `/api/auth/me` | ✓ | Get current user profile |

### Projects (`/api/projects`)

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `POST` | `/api/projects` | ✓ | Create a new project |
| `GET` | `/api/projects` | ✓ | List all user's projects |
| `GET` | `/api/projects/:id` | ✓ | Get project details |
| `PUT` | `/api/projects/:id` | ✓ | Update a project |
| `DELETE` | `/api/projects/:id` | ✓ | Delete a project |
| `POST` | `/api/projects/:id/members` | ✓ | Add a team member |
| `DELETE` | `/api/projects/:id/members/:userId` | ✓ | Remove a team member |

### Tasks (`/api/tasks`)

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `POST` | `/api/tasks` | ✓ | Create a new task |
| `GET` | `/api/tasks` | ✓ | List tasks (with filters) |
| `GET` | `/api/tasks/:id` | ✓ | Get task details |
| `PUT` | `/api/tasks/:id` | ✓ | Update a task |
| `DELETE` | `/api/tasks/:id` | ✓ | Delete a task |
| `POST` | `/api/tasks/:id/comments` | ✓ | Add a comment to a task |
| `GET` | `/api/tasks/:id/comments` | ✓ | Get comments for a task |
| `DELETE` | `/api/tasks/comments/:id` | ✓ | Delete a comment |

### Notifications (`/api/notifications`)

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `GET` | `/api/notifications` | ✓ | Get user notifications |
| `PUT` | `/api/notifications/:id/read` | ✓ | Mark notification as read |
| `PUT` | `/api/notifications/read-all` | ✓ | Mark all as read |

### Dashboard (`/api/dashboard`)

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `GET` | `/api/dashboard` | ✓ | Get dashboard analytics |

### Activity (`/api/activities`)

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `GET` | `/api/activities` | ✓ | Get activity logs |

### Files (`/api/files`)

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `POST` | `/api/files/upload` | ✓ | Upload a file (multipart) |

### Users (`/api/users`)

| Method | Endpoint | Auth | Description |
|---|---|:---:|---|
| `GET` | `/api/users` | ✓ | List/search users |

### WebSocket Events

TeamHub uses Socket.io for real-time communication. After connecting with a valid JWT:

| Event | Direction | Description |
|---|---|---|
| `userOnline` | Server → Client | A user came online |
| `userOffline` | Server → Client | A user went offline |
| `joinProject` | Client → Server | Join a project room for live updates |
| `leaveProject` | Client → Server | Leave a project room |

---

## 📜 Available Scripts

### Server (`server/`)

| Command | Description |
|---|---|
| `npm start` | Start production server |
| `npm run dev` | Start dev server with Nodemon (hot-reload) |
| `npm run seed` | Seed the database with sample data |

### Client (`client/`)

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server on port 5173 |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/kevaljamnapara">Keval Jamnapara</a>
</p>
]]>
