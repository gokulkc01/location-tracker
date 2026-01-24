import { Bell, Menu, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Badge } from '../common/Badge';
import { useSocket } from '../../hooks/useSocket';
import { NotificationPanel } from '../notifications/NotificationPanel';
import { notificationService } from '../../services/notificationService';

export const Header = ({ title, onMenuClick, showBack = false }) => {
  const { socket } = useSocket();
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if we should show back button on mobile
  const isSubPage = location.pathname !== '/' && location.pathname !== '/dashboard';

  useEffect(() => {
    loadUnreadCount();

    // Listen for new notifications via socket
    if (socket) {
      socket.on('notification', () => {
        loadUnreadCount();
      });
    }

    return () => {
      if (socket) {
        socket.off('notification');
      }
    };
  }, [socket]);

  const loadUnreadCount = async () => {
    try {
      const data = await notificationService.getNotifications(true);
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error('Failed to load unread count:', error);
    }
  };

  const handleMenuClick = () => {
    if (onMenuClick) {
      onMenuClick();
    } else if (showBack || isSubPage) {
      navigate(-1);
    } else {
      // Toggle sidebar on dashboard - navigate to dashboard
      navigate('/dashboard');
    }
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleMenuClick}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {(showBack || isSubPage) ? (
                <ArrowLeft className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNotifications(true)}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <NotificationPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </>
  );
};