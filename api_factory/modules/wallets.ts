import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const wallets_api = {
  getWallet: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/wallets/mine');
  },

  getTransactions: (page: number = 1, limit: number = 50, query?: Record<string, any>) => {
    let url = `/wallets/all?page=${page}&limit=${limit}`;
    if (query) {
      if (query.startDate) url += `&startDate=${query.startDate}`;
      if (query.endDate) url += `&endDate=${query.endDate}`;
      if (query.status) url += `&status=${query.status}`;
      if (query.search) url += `&search=${query.search}`;
      if (query.sortBy) url += `&sortBy=${query.sortBy}`;
      if (query.sortOrder) url += `&sortOrder=${query.sortOrder}`;
      if (query.exportAsCsv) url += `&exportAsCsv=${query.exportAsCsv}`;
    }
    const isExport = query?.exportAsCsv;
    const config = isExport ? { responseType: 'blob' as 'blob' } : {};
    return GATEWAY_ENDPOINT_WITH_AUTH.get(url, config);
  },

  updatePreferences: (payload: { preference: string; bankDetails?: any }) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put('/wallets/preferences', payload);
  },

  withdraw: (amount: number) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.post('/wallets/withdraw', { amount });
  },

  getGlobalStats: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/wallets/global-stats');
  },

  approvePayout: (id: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put(`/wallets/transactions/${id}/approve`);
  },
  
  rejectPayout: (id: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put(`/wallets/transactions/${id}/reject`);
  },

  markPayoutAsPaid: (id: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put(`/wallets/transactions/${id}/mark-paid`);
  },
  
  downloadReceipt: (id: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get(`/wallets/transactions/${id}/receipt`, { responseType: 'blob' });
  },

  fundWalletByAdmin: (userId: string, amount: number, description?: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.post(`/wallets/admin/fund/${userId}`, { amount, description });
  }
};
