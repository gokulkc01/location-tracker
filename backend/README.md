# 📍 Location Tracker - Backend API

A real-time location tracking API built with Node.js, Express, MongoDB, and Socket.io.

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Express](https://img.shields.io/badge/Express-4.x-lightgrey)
![MongoDB](https://img.shields.io/badge/MongoDB-6+-green)
![Socket.io](https://img.shields.io/badge/Socket.io-4.x-black)

## ✨ Features

- 🔐 **JWT Authentication** - Secure user registration and login
- 👥 **Circle Management** - Create and manage family/friend circles
- 📍 **Real-time Location** - WebSocket-based live location updates
- 🚧 **Geofencing** - Create geographic boundaries with entry/exit alerts
- 🔔 **Notifications** - Real-time invitation and alert notifications
- 🆘 **SOS Alerts** - Emergency alert system
- 📊 **Activity Logging** - Track location history and events
- 🔒 **Permission System** - Granular location sharing controls

## 🏗️ Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Real-time:** Socket.io
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Express Validator

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── db.js           # MongoDB connection
│   │   └── env.js          # Environment variables
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── circleController.js
│   │   ├── geofenceController.js
│   │   ├── locationController.js
│   │   └── permissionController.js
│   ├── middleware/
│   │   ├── auth.js         # JWT verification
│   │   ├── errorHandler.js
│   │   └── validator.js
│   ├── models/
│   │   ├── ActivityLog.js
│   │   ├── Circle.js
│   │   ├── Geofence.js
│   │   ├── Invitation.js
│   │   ├── Location.js
│   │   ├── Notification.js
│   │   ├── Permission.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── circles.js
│   │   ├── geofences.js
│   │   ├── locations.js
│   │   └── permissions.js
│   ├── utils/
│   │   ├── geoUtils.js     # Geolocation calculations
│   │   ├── jwtHelper.js
│   │   └── socketHandler.js # WebSocket events
│   └── server.js           # Entry point
├── .env.example
└── package.json
```

## 🚀 Quick Start

### Prerequisites

- Node.js v18 or higher
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone and navigate to backend:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables:**
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/location-tracker
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

5. **Start the server:**
   ```bash
   # Development (with hot reload)
   npm run dev

   # Production
   npm start
   ```

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/profile` | Update profile |

### Circles
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/circles` | Get user's circles |
| POST | `/api/circles` | Create new circle |
| GET | `/api/circles/:id` | Get circle details |
| PUT | `/api/circles/:id` | Update circle |
| DELETE | `/api/circles/:id` | Delete circle |
| POST | `/api/circles/:id/invite` | Invite member |
| DELETE | `/api/circles/:id/members/:userId` | Remove member |

### Invitations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/invitations` | Get pending invitations |
| POST | `/api/invitations/:id/accept` | Accept invitation |
| POST | `/api/invitations/:id/reject` | Reject invitation |

### Locations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/locations/circle/:circleId` | Get circle members' locations |
| GET | `/api/locations/history/:userId` | Get location history |
| POST | `/api/locations` | Update location (REST fallback) |

### Geofences
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/geofences/circle/:circleId` | Get circle geofences |
| POST | `/api/geofences` | Create geofence |
| PUT | `/api/geofences/:id` | Update geofence |
| DELETE | `/api/geofences/:id` | Delete geofence |

### Permissions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/permissions/circle/:circleId` | Get permissions |
| PUT | `/api/permissions/:id` | Update permission |

## 🔌 WebSocket Events

### Client → Server
| Event | Payload | Description |
|-------|---------|-------------|
| `join-circle` | `{ circleId }` | Join circle room |
| `leave-circle` | `{ circleId }` | Leave circle room |
| `location-update` | `{ circleId, latitude, longitude, accuracy }` | Send location |

### Server → Client
| Event | Payload | Description |
|-------|---------|-------------|
| `location-update` | `{ userId, location, user }` | Receive member location |
| `member-joined` | `{ userId, user }` | Member came online |
| `member-left` | `{ userId }` | Member went offline |
| `notification` | `{ type, message, data }` | System notification |
| `sos-alert` | `{ userId, location, user }` | Emergency alert |

## 🔒 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 🛠️ Scripts

```bash
npm run dev      # Start with nodemon (hot reload)
npm start        # Start production server
npm test         # Run tests
```

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.
