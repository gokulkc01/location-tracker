<div align="center">
  
# 📍 Location Tracker

### Real-Time Family & Friends Location Sharing App

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6+-47A248?logo=mongodb&logoColor=white)](https://mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4+-010101?logo=socket.io&logoColor=white)](https://socket.io/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-5A0FC8?logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)

**Keep your loved ones safe with real-time location sharing, geofencing alerts, and emergency SOS features.**

[Live Demo](#) • [Report Bug](https://github.com/gokulkc01/location-tracker/issues) • [Request Feature](https://github.com/gokulkc01/location-tracker/issues)

---

</div>

## 🌟 Overview

**Location Tracker** is a full-stack, real-time location sharing application designed to help families and friends stay connected and safe. Create private circles, share your location with trusted members, set up safe zones with geofencing, and send emergency alerts when needed.

Built with modern technologies including React, Node.js, MongoDB, and Socket.io for seamless real-time updates. Available as a **Progressive Web App (PWA)** - install it on any device!

<div align="center">

### 🎯 Perfect For

| 👨‍👩‍👧‍👦 Families | 👥 Friend Groups | 🏢 Small Teams |
|:---:|:---:|:---:|
| Track kids' locations | Coordinate meetups | Field team tracking |
| Elderly parent safety | Road trip companions | Delivery monitoring |
| School commute alerts | Event coordination | Safety check-ins |

</div>

---

## ✨ Key Features

<table>
<tr>
<td width="50%">

### 🔐 Secure Authentication
- JWT-based authentication
- Encrypted password storage
- Secure session management

### 👥 Circle Management
- Create unlimited private circles
- Invite members via email
- Role-based permissions (Admin/Member)

### 📍 Real-Time Tracking
- Live location updates via WebSocket
- Battery-efficient tracking
- Location history with timestamps

</td>
<td width="50%">

### 🚧 Geofencing
- Create custom safe zones
- Entry/exit notifications
- Multiple geofences per circle

### 🆘 Emergency SOS
- One-tap emergency alerts
- Instant notification to all members
- Location shared automatically

### 📱 Progressive Web App
- Install on any device
- Works offline
- Native app-like experience

</td>
</tr>
</table>

---

## 🏗️ Tech Stack

<div align="center">

### Frontend
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer&logoColor=white)
![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

</div>

---

## 📁 Project Structure
location-tracker/
├── 📂 backend/ # Node.js API Server
│ ├── 📂 src/
│ │ ├── 📂 config/ # Database & environment config
│ │ ├── 📂 controllers/ # Request handlers
│ │ ├── 📂 middleware/ # Auth & validation middleware
│ │ ├── 📂 models/ # MongoDB schemas
│ │ ├── 📂 routes/ # API endpoints
│ │ ├── 📂 utils/ # Helper functions & socket handler
│ │ └── 📄 server.js # Entry point
│ └── 📄 package.json
│
├── 📂 location-tracker-frontend/ # React PWA Client
│ ├── 📂 public/ # Static assets & PWA icons
│ ├── 📂 src/
│ │ ├── 📂 components/ # Reusable UI components
│ │ ├── 📂 context/ # React Context providers
│ │ ├── 📂 hooks/ # Custom React hooks
│ │ ├── 📂 pages/ # Page components
│ │ ├── 📂 services/ # API service functions
│ │ └── 📄 App.jsx # Root component
│ └── 📄 package.json
│
└── 📄 README.md


---## 🚀 Getting Started### Prerequisites- **Node.js** v18 or higher- **MongoDB** (local installation or [MongoDB Atlas](https://www.mongodb.com/atlas))- **npm** or **yarn**### Installation1️⃣ **Clone the repository**```bashgit clone https://github.com/gokulkc01/location-tracker.gitcd location-tracker

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **MongoDB** (local installation or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **npm** or **yarn**

### Installation

1️⃣ **Clone the repository**
```bash
git clone https://github.com/gokulkc01/location-tracker.git
cd location-tracker
2️⃣ Set up the Backend

cd backend
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_super_secret_key

# Start the server
npm run dev
3️⃣ Set up the Frontend
cd location-tracker-frontend
npm install
🔌 API Reference
<details> <summary><b>🔐 Authentication</b></summary>

Method	Endpoint	Description
POST	/api/auth/register	Register new user
POST	/api/auth/login	Login & get token
GET	/api/auth/me	Get current user
PUT	/api/auth/profile	Update profile
</details> <details> <summary><b>👥 Circles</b></summary>

Method	Endpoint	Description
GET	/api/circles	Get user's circles
POST	/api/circles	Create new circle
GET	/api/circles/:id	Get circle details
POST	/api/circles/:id/invite	Invite member
DELETE	/api/circles/:id/members/:userId	Remove member
</details> <details> <summary><b>📍 Locations</b></summary>

Method	Endpoint	Description
GET	/api/locations/circle/:circleId	Get members' locations
GET	/api/locations/history/:userId	Get location history
</details> <details> <summary><b>🚧 Geofences</b></summary>

Method	Endpoint	Description
GET	/api/geofences/circle/:circleId	Get geofences
POST	/api/geofences	Create geofence
PUT	/api/geofences/:id	Update geofence
DELETE	/api/geofences/:id	Delete geofence
</details>

🔄 Real-Time Events
Event	Direction	Description
location-update	↔️	Send/receive location updates
join-circle	→	Join a circle's room
member-joined	←	Member came online
member-left	←	Member went offline
sos-alert	←	Emergency alert received
notification	←	System notifications
📱 PWA Installation
<table> <tr> <td align="center" width="33%">

🖥️ Desktop
Open app in Chrome/Edge
Click install icon (📥) in address bar
Click "Install"
</td> <td align="center" width="33%">

📱 Android
Open app in Chrome
Tap menu (⋮)
Tap "Add to Home Screen"
</td> <td align="center" width="33%">

🍎 iOS
Open app in Safari
Tap Share button
Tap "Add to Home Screen"
</td> </tr> </table>

🛣️ Roadmap
 User authentication (JWT)
 Circle creation & management
 Real-time location sharing
 Geofencing with alerts
 SOS emergency alerts
 PWA support
 Push notifications
 Location history playback
 Battery optimization
 Dark mode
 Native mobile apps (React Native)
🤝 Contributing
Contributions are welcome! Here's how you can help:

Fork the repository
Create your feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add some AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request
📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

👨‍💻 Author
Gokul KC

<img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&amp;logo=github&amp;logoColor=white" alt="GitHub">

<div align="center">

⭐ Star this repo if you find it useful!
Made with ❤️ and ☕
</div> ```

# Start the development server
npm run dev
http://localhost:5173
