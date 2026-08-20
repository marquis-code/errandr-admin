import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const wallets_api = {
  getWallet: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/wallets/mine');
  },

  getTransactions: (page: number = 1, limit: number = 50) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get(`/wallets/all?page=${page}&limit=${limit}`);
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
  }
};
