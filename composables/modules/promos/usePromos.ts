import { ref } from 'vue'
import { promos_api } from '@/api_factory/modules/promos'
import { admin_api } from '@/api_factory/modules/admin'
import { useCustomToast } from '@/composables/core/useCustomToast'

export const usePromos = () => {
  const promos = ref<any[]>([])
  const loading = ref(false)
  const isSubmitting = ref(false)
  const users = ref<any[]>([])
  const vendors = ref<any[]>([])
  const { showToast } = useCustomToast()

  const fetchDependencies = async () => {
    try {
      const [usersRes, vendorsRes] = await Promise.all([
        admin_api.getUsers(),
        admin_api.getVendors()
      ])
      users.value = usersRes.data?.users || usersRes.data || []
      vendors.value = vendorsRes.data?.vendors || vendorsRes.data || []
    } catch (e: any) {
      console.error('Failed to load users/vendors', e)
    }
  }

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

  const updatePromo = async (id: string, payload: any) => {
    isSubmitting.value = true
    try {
      await promos_api.updatePromoCode(id, payload)
      showToast({
        title: 'Success',
        message: 'Promo code updated successfully',
        toastType: 'success'
      })
      return true
    } catch (error: any) {
      showToast({
        title: 'Error',
        message: error.response?.data?.message || 'Failed to update promo code',
        toastType: 'error'
      })
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    promos,
    users,
    vendors,
    loading,
    isSubmitting,
    fetchPromos,
    fetchDependencies,
    createPromo,
    updatePromo,
    toggleStatus
  }
}
