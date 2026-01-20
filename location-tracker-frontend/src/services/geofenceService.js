import api from './api';

export const geofenceService = {
  createGeofence: async (data) => {
    const response = await api.post('/geofences', data);
    return response.data.geofence;
  },

  getGeofences: async (circleId) => {
    const response = await api.get(`/geofences?circleId=${circleId}`);
    return response.data.geofences;
  },

  updateGeofence: async (id, data) => {
    const response = await api.put(`/geofences/${id}`, data);
    return response.data.geofence;
  },

  deleteGeofence: async (id) => {
    const response = await api.delete(`/geofences/${id}`);
    return response.data;
  },
};
