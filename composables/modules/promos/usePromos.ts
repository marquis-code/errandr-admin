import { ref } from 'vue'
import { promos_api } from '@/api_factory/modules/promos'
import { useCustomToast } from '@/composables/core/useCustomToast'

export const usePromos = () => {
  const promos = ref<any[]>([])
  const loading = ref(false)
  const isSubmitting = ref(false)
  const { showToast } = useCustomToast()

  const fetchPromos = async () => {
    loading.value = true
    try {
      const res = await promos_api.getPromoCodes()
      promos.value = res.data
    } catch (error: any) {
      showToast({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to fetch promo codes',
        toastType: 'error'
      })
    } finally {
      loading.value = false
    }
  }

  const createPromo = async (payload: any) => {
    isSubmitting.value = true
    try {
      await promos_api.createPromoCode(payload)
      showToast({
        title: 'Success',
        message: 'Promo code created successfully',
        toastType: 'success'
      })
      return true
    } catch (error: any) {
      showToast({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to create promo code',
        toastType: 'error'
      })
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  const toggleStatus = async (promo: any) => {
    try {
      const res = await promos_api.togglePromoStatus(promo._id)
      promo.isActive = res.data.isActive
      showToast({
        title: 'Success',
        message: `Promo code ${promo.isActive ? 'activated' : 'deactivated'}`,
        toastType: 'success'
      })
    } catch (error: any) {
      showToast({
        title: 'Error',
        message: 'Failed to toggle status',
        toastType: 'error'
      })
    }
  }

  return {
    promos,
    loading,
    isSubmitting,
    fetchPromos,
    createPromo,
    toggleStatus
  }
}
