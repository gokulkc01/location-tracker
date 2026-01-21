import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Map,
  Settings,
  LogOut,
  MapPin,
  Mail, // NEW: Add this import
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useState, useEffect } from 'react';
import { invitationService } from '../../services/invitationService';
import { Badge } from '../common/Badge';
import clsx from 'clsx';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const [invitationCount, setInvitationCount] = useState(0);

  useEffect(() => {
    loadInvitationCount();
    const interval = setInterval(loadInvitationCount, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadInvitationCount = async () => {
    try {
      const invitations = await invitationService.getMyInvitations();
      setInvitationCount(invitations.length);
    } catch (error) {
      console.error('Failed to load invitation count:', error);
    }
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Circles', path: '/circles' },
    { icon: Mail, label: 'Invitations', path: '/invitations', badge: invitationCount }, // NEW
    { icon: Map, label: 'Map', path: '/map' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col"
    >
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
            <MapPin className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Tracker</h1>
            <p className="text-xs text-gray-500">Location Safety</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                'flex items-center justify-between px-4 py-3 rounded-lg transition-all',
                isActive
                  ? 'bg-primary-50 text-primary-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              )
            }
          >
            <div className="flex items-center gap-3">
              <item.icon className="h-5 w-5" />
              {item.label}
            </div>
            {item.badge > 0 && (
              <Badge variant="danger" size="sm">
                {item.badge}
              </Badge>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
            {user?.name?.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </motion.aside>
  );
};