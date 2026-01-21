import api from './api';

export const circleService = {
    getMyCircles: async () => {
        const response = await api.get('/circles');
        return response.data.circles;
    },

    createCircle: async (name) => {
        const response = await api.post('/circles', { name });
        return response.data.circle;
    },

    inviteMember: async (circleId, email) => {
        const response = await api.post(`/circles/${circleId}/invite`, { email });
        return response.data;
    },

    getPendingInvitations: async () => {
        const response = await api.get('/circles/invitations');
        return response.data.invitations;
    },

    acceptInvitation: async (circleId) => {
        const response = await api.post(`/circles/${circleId}/accept`);
        return response.data;
    },

    declineInvitation: async (circleId) => {
        const response = await api.post(`/circles/${circleId}/decline`);
        return response.data;
    },

    leaveCircle: async (circleId) => {
        const response = await api.delete(`/circles/${circleId}/leave`);
        return response.data;
    },

    syncPermissions: async (circleId) => {
        const response = await api.post(`/circles/${circleId}/sync-permissions`);
        return response.data;
    },
};