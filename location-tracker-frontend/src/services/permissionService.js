import api from './api';

export const permissionService = {
  toggleSharing: async (circleId, sharingEnabled) => {
    const response = await api.put('/permissions/toggle', {
      circleId,
      sharingEnabled,
    });
    return response.data.permission;
  },

  updateSchedule: async (circleId, schedule) => {
    const response = await api.put('/permissions/schedule', {
      circleId,
      ...schedule,
    });
    return response.data.permission;
  },

  getActivityLog: async (circleId, days = 7) => {
    const response = await api.get(
      `/permissions/activity?circleId=${circleId}&days=${days}`
    );
    return response.data.logs;
  },

  getMyPermissions: async () => {
    const response = await api.get('/permissions/my');
    return response.data.permissions;
  },
};
