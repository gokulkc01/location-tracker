import api from './api';

export const invitationService = {
  sendInvitation: async (circleId, email, message) => {
    const response = await api.post('/invitations/send', {
      circleId,
      email,
      message
    });
    return response.data;
  },

  getMyInvitations: async () => {
    const response = await api.get('/invitations/my');
    return response.data.invitations;
  },

  acceptInvitation: async (invitationId) => {
    const response = await api.post(`/invitations/${invitationId}/accept`);
    return response.data;
  },

  rejectInvitation: async (invitationId) => {
    const response = await api.post(`/invitations/${invitationId}/reject`);
    return response.data;
  }
};