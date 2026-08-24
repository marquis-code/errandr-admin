import { GATEWAY_ENDPOINT_WITH_AUTH } from '../axios.config';

export const promos_api = {
  getPromoCodes: () => {
    return GATEWAY_ENDPOINT_WITH_AUTH.get('/promo-codes');
  },
  createPromoCode: (payload: any) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.post('/promo-codes', payload);
  },
  togglePromoStatus: (id: string) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put(`/promo-codes/${id}/toggle`);
  },
  updatePromoCode: (id: string, payload: any) => {
    return GATEWAY_ENDPOINT_WITH_AUTH.put(`/promo-codes/${id}`, payload);
  }
};
