import api from './api';

export const notificationService = {
  getNotifications: async (unreadOnly = false) => {
    const response = await api.get('/notifications', {
      params: { unreadOnly }
    });
    return response.data;
  },

  markAsRead: async (notificationId) => {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  },

  deleteNotification: async (notificationId) => {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  }
};