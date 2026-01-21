# 📍 Location Tracker - Frontend

A modern, real-time location tracking Progressive Web App built with React, Vite, and Tailwind CSS.

![React](https://img.shields.io/badge/React-18+-blue)
![Vite](https://img.shields.io/badge/Vite-5+-purple)
![PWA](https://img.shields.io/badge/PWA-Ready-green)
![Tailwind](https://img.shields.io/badge/Tailwind-3.x-cyan)

## ✨ Features

- 📱 **Progressive Web App** - Install on mobile/desktop, works offline
- 🗺️ **Interactive Maps** - Real-time location display with Leaflet.js
- 👥 **Circle Management** - Create and manage family/friend groups
- 📍 **Live Tracking** - See members' locations in real-time
- 🚧 **Geofencing** - Set up safe zones with entry/exit alerts
- 🔔 **Push Notifications** - Instant alerts and invitations
- 🆘 **SOS Button** - One-tap emergency alerts
- 🌙 **Modern UI** - Beautiful animations with Framer Motion
- 📊 **Location History** - View past locations on the map

## 🏗️ Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite 5
- **Styling:** Tailwind CSS
- **Maps:** Leaflet.js / React-Leaflet
- **Real-time:** Socket.io Client
- **Animations:** Framer Motion
- **PWA:** vite-plugin-pwa
- **Routing:** React Router v6

## 📁 Project Structure

```
location-tracker-frontend/
├── public/
│   └── pwa-icon.svg        # PWA app icon
├── src/
│   ├── assets/             # Static assets
│   │   ├── icons/
│   │   └── images/
│   ├── components/
│   │   ├── alerts/
│   │   │   ├── NotificationBanner.jsx
│   │   │   └── SOSButton.jsx
│   │   ├── auth/
│   │   │   ├── AuthLayout.jsx
│   │   │   ├── LoginForm.jsx
│   │   │   └── RegisterForm.jsx
│   │   ├── circles/
│   │   │   ├── CircleCard.jsx
│   │   │   ├── CircleList.jsx
│   │   │   ├── CircleMembers.jsx
│   │   │   ├── CreateCircleModal.jsx
│   │   │   ├── InvitationNotification.jsx
│   │   │   └── InviteMemberModal.jsx
│   │   ├── common/         # Reusable UI components
│   │   │   ├── Avatar.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── Toast.jsx
│   │   ├── dashboard/
│   │   │   ├── DashboardLayout.jsx
│   │   │   ├── Header.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── geofences/
│   │   │   ├── CreateGeofenceModal.jsx
│   │   │   ├── GeofenceCard.jsx
│   │   │   └── GeofenceList.jsx
│   │   ├── map/
│   │   │   ├── GeofenceMarker.jsx
│   │   │   ├── LocationHistory.jsx
│   │   │   ├── MapContainer.jsx
│   │   │   └── UserLocation.jsx
│   │   └── permissions/
│   ├── context/
│   │   ├── AuthContext.jsx     # Authentication state
│   │   ├── LocationContext.jsx # Geolocation tracking
│   │   └── SocketContext.jsx   # WebSocket connection
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useCircles.js
│   │   ├── useGeofences.js
│   │   ├── useLocation.js
│   │   └── useSocket.js
│   ├── pages/
│   │   ├── Auth.jsx
│   │   ├── Circles.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Geofences.jsx
│   │   ├── Map.jsx
│   │   ├── Profile.jsx
│   │   └── Settings.jsx
│   ├── services/
│   │   ├── api.js              # Axios instance
│   │   ├── authService.js
│   │   ├── circleService.js
│   │   ├── geofenceService.js
│   │   ├── invitationService.js
│   │   ├── locationService.js
│   │   └── permissionService.js
│   ├── styles/
│   │   ├── animations.css
│   │   └── globals.css
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── validators.js
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## 🚀 Quick Start

### Prerequisites

- Node.js v18 or higher
- npm or yarn
- Backend server running (see backend README)

### Installation

1. **Navigate to frontend:**
   ```bash
   cd location-tracker-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure API URL (optional):**
   
   Create `.env.local`:
   ```env
   VITE_API_URL=http://localhost:5000
   VITE_SOCKET_URL=http://localhost:5000
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Open in browser:**
   ```
   http://localhost:5173
   ```

## 📱 PWA Installation

### Desktop (Chrome/Edge)
1. Open the app in browser
2. Click the install icon (📥) in the address bar
3. Click "Install"

### Mobile (Android)
1. Open the app in Chrome
2. Tap the menu (⋮)
3. Tap "Add to Home Screen"

### Mobile (iOS)
1. Open the app in Safari
2. Tap the Share button
3. Tap "Add to Home Screen"

## 🛠️ Scripts

```bash
npm run dev       # Start dev server with HMR
npm run build     # Build for production
npm run preview   # Preview production build
npm run lint      # Run ESLint
```

## 🎨 Customization

### Theme Colors

Edit `tailwind.config.js`:
```js
theme: {
  extend: {
    colors: {
      primary: '#3b82f6',    // Blue
      secondary: '#10b981',  // Green
      danger: '#ef4444',     // Red
    }
  }
}
```

### Map Tiles

The app uses OpenStreetMap tiles by default. To change map provider, edit `MapContainer.jsx`.

## 🔒 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000` |
| `VITE_SOCKET_URL` | WebSocket URL | `http://localhost:5000` |

## 📦 Build for Production

```bash
# Build optimized bundle
npm run build

# Preview the build locally
npm run preview
```

The build output will be in the `dist/` folder, ready for deployment.

## 🚀 Deployment

### Vercel
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
npm run build
# Upload dist/ folder to Netlify
```

### Docker
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

## 🐛 Troubleshooting

### Location not working?
- Ensure HTTPS is used (required for geolocation)
- Check browser permissions
- Allow location access when prompted

### Socket connection failed?
- Verify backend is running
- Check CORS settings in backend
- Ensure correct `VITE_SOCKET_URL`

### PWA not installing?
- Must be served over HTTPS (or localhost)
- Check browser DevTools → Application → Manifest

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.
