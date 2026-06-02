# TeamHub Backend

Production-quality Node.js/Express backend for the TeamHub SaaS team collaboration and project management platform.

## Tech Stack

| Technology | Purpose |
|---|---|
| **Node.js** | Runtime |
| **Express.js** | Web framework |
| **MongoDB Atlas** | Database |
| **Mongoose** | ODM |
| **JWT** | Authentication |
| **bcryptjs** | Password hashing |
| **Socket.io** | Real-time events |
| **Cloudinary** | File storage |
| **Multer** | File upload handling |
| **Express Validator** | Input validation |
| **Helmet** | Security headers |
| **Morgan** | HTTP logging |

---

## Quick Start

### Prerequisites

- Node.js >= 18
- MongoDB Atlas account
- Cloudinary account

### Installation

```bash
# From the repository root
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your credentials
# (see Environment Variables section below)

# Start development server
npm run dev
```

The server starts at `http://localhost:3001`.

### Environment Variables

| Variable | Description | Example |
|---|---|---|
| `NODE_ENV` | Environment | `development` |
| `PORT` | Server port | `3001` |
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://...` |
| `JWT_ACCESS_SECRET` | JWT access token secret | Random 32+ char string |
| `JWT_REFRESH_SECRET` | JWT refresh token secret | Random 32+ char string |
| `JWT_ACCESS_EXPIRY` | Access token expiry | `15m` |
| `JWT_REFRESH_EXPIRY` | Refresh token expiry | `7d` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `your_api_key` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `your_api_secret` |
| `CLIENT_URL` | Frontend URL (for CORS) | `http://localhost:5173` |

---

## API Reference

### Authentication

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user | Public |
| `POST` | `/api/auth/login` | Login | Public |
| `POST` | `/api/auth/logout` | Logout | Required |
| `GET` | `/api/auth/me` | Get current user | Required |
| `POST` | `/api/auth/refresh-token` | Refresh access token | Cookie |

### Projects

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/projects` | Create project | Required |
| `GET` | `/api/projects` | List user's projects | Required |
| `GET` | `/api/projects/:id` | Get project details | Required |
| `PUT` | `/api/projects/:id` | Update project | Owner/Admin |
| `DELETE` | `/api/projects/:id` | Delete project | Owner |
| `POST` | `/api/projects/:id/members` | Add member | Owner/Admin |
| `DELETE` | `/api/projects/:id/members/:userId` | Remove member | Owner/Admin |

### Tasks

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/tasks` | Create task | Required |
| `GET` | `/api/tasks` | List tasks (with filters) | Required |
| `GET` | `/api/tasks/:id` | Get task details | Required |
| `PUT` | `/api/tasks/:id` | Update task | Required |
| `DELETE` | `/api/tasks/:id` | Delete task | Owner/Admin |
| `POST` | `/api/tasks/:id/comments` | Add comment | Required |
| `GET` | `/api/tasks/:id/comments` | Get comments | Required |
| `DELETE` | `/api/tasks/comments/:id` | Delete comment | Author/Admin |

### Notifications

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/notifications` | Get notifications | Required |
| `PUT` | `/api/notifications/:id/read` | Mark as read | Required |
| `PUT` | `/api/notifications/read-all` | Mark all as read | Required |

### Activities

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/activities` | Get all activities | Required |
| `GET` | `/api/activities/project/:projectId` | Get project activities | Required |

### Dashboard

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/dashboard/stats` | Get dashboard stats | Required |

### Files

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/files/upload` | Upload file | Required |

### Users

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `PUT` | `/api/users/profile` | Update profile | Required |
| `GET` | `/api/users` | Search users | Required |
| `GET` | `/api/users/:id` | Get user by ID | Required |

### Health Check

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/health` | Server health status | Public |

---

## API Response Format

### Success
```json
{
  "success": true,
  "message": "Project created",
  "data": {}
}
```

### Error
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Please provide a valid email" }
  ]
}
```

---

## Socket.io Events

### Client → Server

| Event | Payload | Description |
|---|---|---|
| `joinProject` | `projectId` | Join project room |
| `leaveProject` | `projectId` | Leave project room |

### Server → Client

| Event | Payload | Description |
|---|---|---|
| `taskAssigned` | Task object | New task assignment |
| `taskUpdated` | Task object | Task was updated |
| `notificationCreated` | Notification object | New notification |
| `userOnline` | `{ userId, name }` | User came online |
| `userOffline` | `{ userId, name }` | User went offline |

### Connection

```javascript
import { io } from "socket.io-client";

const socket = io("http://localhost:3001", {
  auth: { token: "your_jwt_access_token" }
});
```

---

## Project Structure

```
server/
├── server.js                    # Entry point
├── package.json
├── .env.example
└── src/
    ├── app.js                   # Express app config
    ├── config/                  # DB, Cloudinary, Socket.io
    ├── constants/               # Enums and constants
    ├── controllers/             # Route handlers
    ├── middleware/               # Auth, validation, error handling, upload
    ├── models/                  # Mongoose schemas
    ├── routes/                  # Express routes
    ├── services/                # Business logic
    ├── sockets/                 # Socket.io handlers
    ├── utils/                   # Helpers (ApiError, ApiResponse, catchAsync)
    ├── validators/              # Express-validator chains
    ├── jobs/                    # Background jobs (future)
    └── uploads/                 # Temp upload directory
```

---

## Security

- **Helmet** — HTTP security headers
- **CORS** — Restricted to frontend origin
- **Rate Limiting** — 100 req/15min (API), 20 req/15min (auth)
- **JWT** — Access token (15min) + Refresh token (7d, httpOnly cookie)
- **Password Hashing** — bcryptjs with salt rounds 12
- **Input Validation** — express-validator on all endpoints
- **RBAC** — Role-based access control (owner/admin/member)

---

## Deployment

This backend is ready for deployment on **Render**, **Railway**, or similar platforms:

1. Set all environment variables in your hosting platform
2. Set `NODE_ENV=production`
3. Start command: `npm start`
4. Ensure MongoDB Atlas whitelist includes your server's IP

---

## License

MIT
