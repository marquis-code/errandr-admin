import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const referrals_api = {
  // Stats
  getStats: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/admin/referrals/stats');
  },

  // Referrals
  getAllReferrals: (params?: { page?: number; limit?: number; status?: string; type?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.set('page', params.page.toString());
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.status) query.set('status', params.status);
    if (params?.type) query.set('type', params.type);
    return GATEWAY_ENDPOINT_WITH_AUTH.get(`/admin/referrals?${query.toString()}`);
  },

  // Leaderboard
  getLeaderboard: (limit = 20) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get(`/admin/referrals/leaderboard?limit=${limit}`);
  },

  // Facilitators
  getFacilitators: (params?: { search?: string; active?: string }) => {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.active) query.set('active', params.active);
    return GATEWAY_ENDPOINT_WITH_AUTH.get(`/admin/referrals/facilitators?${query.toString()}`);
  },

  createFacilitator: (data: { name: string; email: string; matricNumber?: string; skill?: string; referralCode?: string; sendWelcomeEmail?: boolean }) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.post('/admin/referrals/facilitators', data);
  },

  getFacilitator: (id: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get(`/admin/referrals/facilitators/${id}`);
  },

  updateFacilitator: (id: string, data: any) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put(`/admin/referrals/facilitators/${id}`, data);
  },

  deactivateFacilitator: (id: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.delete(`/admin/referrals/facilitators/${id}`);
  },

  getFacilitatorReferrals: (id: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get(`/admin/referrals/facilitators/${id}/referrals`);
  },

  resendWelcomeEmail: (id: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.post(`/admin/referrals/facilitators/${id}/resend-email`);
  },

  seedFacilitators: (facilitators: Array<{ name: string; email: string; matricNumber?: string; skill?: string }>) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.post('/admin/referrals/facilitators/seed', { facilitators });
  },

  // User referrals
  getUserReferrals: (userId: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get(`/admin/referrals/user/${userId}`);
  },
};
