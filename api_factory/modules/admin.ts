import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const admin_api = {
  getDashboardStats: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/admin/stats');
  },

  getChartData: (days: number = 30) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get(`/admin/chart-data?days=${days}`);
  },

  getUsers: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/admin/users');
  },

  getUser: (id: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get(`/admin/users/${id}`);
  },

  getVendors: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/admin/vendors');
  },

  getVendor: (id: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get(`/admin/vendors/${id}`);
  },

  getReports: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/admin/reports');
  },

  getPendingVendors: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/admin/vendors/pending');
  },

  approveVendor: (id: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put(`/admin/vendors/${id}/approve`);
  },

  rejectVendor: (id: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put(`/admin/vendors/${id}/reject`);
  },

  toggleVendorVisibility: (id: string, payload: { isVisible: boolean }) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put(`/admin/vendors/${id}/visibility`, payload);
  },

  deleteVendor: (id: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.delete(`/admin/vendors/${id}`);
  },

  getRecentOrders: (limit: number = 10) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get(`/admin/orders/recent?limit=${limit}`);
  },

  getCustomErrandSettings: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/settings/errands/custom');
  },

  updateCustomErrandSettings: (payload: { baseFee: number; expressFee: number; convenienceFee?: number; commissionPercentage?: number }) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put('/settings/errands/custom', payload);
  },

  getCommunicationsSettings: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/settings/communications');
  },

  updateCommunicationsSettings: (payload: { emailsEnabled: boolean; pushNotificationsEnabled: boolean }) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put('/settings/communications', payload);
  },

  getAdvertSettings: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/settings/advert');
  },

  updateAdvertSettings: (payload: any) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put('/settings/advert', payload);
  },

  getExamBrethrenSettings: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/settings/exam-brethren/public');
  },

  updateExamBrethrenSettings: (payload: { isActive: boolean }) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put('/settings/exam-brethren', payload);
  },

  updateUser: (id: string, payload: any) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put(`/admin/users/${id}`, payload);
  },

  updateVendor: (id: string, payload: any) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put(`/admin/vendors/${id}`, payload);
  },

  updateDispatcher: (id: string, payload: any) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put(`/admin/dispatchers/${id}`, payload);
  },

  suspendUser: (id: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put(`/admin/users/${id}/suspend`);
  },

  activateUser: (id: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put(`/admin/users/${id}/activate`);
  },

  getDispatchers: (page: number = 1, limit: number = 10) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get(`/admin/dispatchers?page=${page}&limit=${limit}`);
  },

  getDispatcher: (id: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get(`/admin/dispatchers/${id}`);
  },

  approveDispatcher: (id: string, payload?: { level: number }) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put(`/admin/dispatchers/${id}/approve`, payload);
  },

  rejectDispatcher: (id: string, payload?: { reason: string }) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put(`/admin/dispatchers/${id}/reject`, payload);
  },

  suspendDispatcher: (id: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put(`/admin/dispatchers/${id}/suspend`);
  },

  activateDispatcher: (id: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put(`/admin/dispatchers/${id}/activate`);
  },
};
