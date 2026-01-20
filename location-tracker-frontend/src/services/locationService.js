import api from './api';

export const locationService = {
  updateLocation: async (data) => {
    const response = await api.post('/locations/update', data);
    return response.data.location;
  },

  getCircleLocations: async (circleId) => {
    const response = await api.get(`/locations/circle/${circleId}`);
    return response.data.locations;
  },

  getUserLocation: async (userId, circleId) => {
    const response = await api.get(`/locations/user/${userId}?circleId=${circleId}`);
    return response.data.location;
  },

  getLocationHistory: async (userId, circleId, limit = 100) => {
    const response = await api.get(
      `/locations/history/${userId}?circleId=${circleId}&limit=${limit}`
    );
    return response.data.locations;
  },
};