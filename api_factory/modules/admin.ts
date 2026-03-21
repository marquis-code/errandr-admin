import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const admin_api = {
  getDashboardStats: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/admin/stats');
  },

  getUsers: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/admin/users');
  },

  getVendors: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/admin/vendors');
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

  getRecentOrders: (limit: number = 10) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get(`/admin/orders/recent?limit=${limit}`);
  },
};
