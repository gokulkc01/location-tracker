import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { LocationProvider } from './context/LocationContext';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { Circles } from './pages/Circles';
import { Map } from './pages/Map';
import { Settings } from './pages/Settings';
import { Geofences } from './pages/Geofences';
import { useAuth } from './hooks/useAuth';
import './styles/globals.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/auth" replace />;
};

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <LocationProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="circles" element={<Circles />} />
                <Route path="map" element={<Map />} />
                <Route path="geofences" element={<Geofences />} />
                <Route path="settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </LocationProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;