<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Dispatcher Verifications</h1>
      <button @click="fetchPending" class="p-2 text-gray-400 hover:text-gray-900 transition-colors">
        <RefreshCw class="w-5 h-5" :class="{ 'animate-spin': loading }" />
      </button>
    </div>

    <!-- Tabs -->
    <div class="flex items-center gap-6 border-b border-gray-200">
      <button 
        @click="activeTab = 'verifications'"
        class="pb-4 text-sm font-bold transition-colors border-b-2 relative -mb-[1px]"
        :class="activeTab === 'verifications' ? 'border-primary text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'"
      >
        Pending Verifications
        <span v-if="total > 0" class="ml-2 inline-flex items-center justify-center bg-red-500 text-white text-[10px] w-5 h-5 rounded-full">{{ total }}</span>
      </button>
      <button 
        @click="activeTab = 'all'"
        class="pb-4 text-sm font-bold transition-colors border-b-2 relative -mb-[1px]"
        :class="activeTab === 'all' ? 'border-primary text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'"
      >
        All Dispatchers
      </button>
    </div>

    <!-- Verifications Tab -->
    <div v-show="activeTab === 'verifications'" class="space-y-6">
      <!-- Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-2xl border border-gray-100">
          <p class="text-sm text-gray-500 font-medium">Pending Approvals</p>
          <p class="text-3xl font-bold text-gray-900 mt-2">{{ total }}</p>
        </div>
      </div>

    <!-- Pending Table -->
    <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100">
        <h3 class="font-bold text-gray-900">Requires Admin Review</h3>
      </div>
      
      <div v-if="loading && !dispatchers.length" class="p-8 text-center text-gray-400 text-sm">
        Loading...
      </div>
      
      <div v-else-if="dispatchers.length === 0" class="p-12 text-center">
        <div class="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mx-auto text-2xl mb-4">
          ✓
        </div>
        <h4 class="font-bold text-gray-900">All caught up!</h4>
        <p class="text-sm text-gray-500 mt-1">There are no pending dispatcher verifications to review.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-100 bg-gray-50 text-[11px] uppercase tracking-wider text-gray-500">
              <th class="px-6 py-4 font-bold">Dispatcher</th>
              <th class="px-6 py-4 font-bold">School & Matric</th>
              <th class="px-6 py-4 font-bold">Level</th>
              <th class="px-6 py-4 font-bold text-center">ID Card</th>
              <th class="px-6 py-4 font-bold text-center">Selfie</th>
              <th class="px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr v-for="errander in dispatchers" :key="errander._id" class="hover:bg-gray-50/50 transition-colors">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-gray-100 rounded-full overflow-hidden shrink-0">
                    <img v-if="errander.user?.avatar" :src="errander.user?.avatar" class="w-full h-full object-cover">
                    <div v-else class="w-full h-full flex items-center justify-center text-sm font-bold text-gray-500">
                      {{ errander.user?.firstName?.[0] }}
                    </div>
                  </div>
                  <div>
                    <h4 class="font-bold text-gray-900 text-sm">{{ errander.user?.firstName }} {{ errander.user?.lastName }}</h4>
                    <p class="text-xs text-gray-500 mt-0.5">{{ errander.user?.email }}</p>
                    <p class="text-xs text-gray-500">{{ errander.user?.phone }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <p class="text-sm font-bold text-gray-900">{{ errander.school || 'Not specified' }}</p>
                <p class="text-xs text-gray-500 mt-0.5">{{ errander.matricNumber || 'Not specified' }}</p>
              </td>
              <td class="px-6 py-4">
                <span class="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg">Tier {{ errander.verificationLevel || 1 }}</span>
              </td>
              <td class="px-6 py-4 text-center">
                <button v-if="errander.idCardImage" @click="viewImage(errander.idCardImage)" class="inline-flex w-16 h-12 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 hover:border-[#FF5C1A] transition-colors relative group">
                  <img :src="errander.idCardImage" class="w-full h-full object-cover" />
                  <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                    <span class="text-[10px] text-white font-bold">View</span>
                  </div>
                </button>
                <span v-else class="text-xs text-gray-400">No Image</span>
              </td>
              <td class="px-6 py-4 text-center">
                <button v-if="errander.selfieImage" @click="viewImage(errander.selfieImage)" class="inline-flex w-12 h-12 bg-gray-100 rounded-full overflow-hidden border border-gray-200 hover:border-[#FF5C1A] transition-colors relative group">
                  <img :src="errander.selfieImage" class="w-full h-full object-cover" />
                  <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                    <span class="text-[10px] text-white font-bold">View</span>
                  </div>
                </button>
                <span v-else class="text-xs text-gray-400">No Image</span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button 
                    @click="openApproveModal(errander)" 
                    :disabled="processing === errander._id"
                    class="px-4 py-2 bg-emerald-50 text-emerald-600 font-bold rounded-lg hover:bg-emerald-100 transition-colors disabled:opacity-50 text-sm"
                  >
                    Approve
                  </button>
                  <button 
                    @click="openRejectModal(errander)" 
                    :disabled="processing === errander._id"
                    class="px-4 py-2 bg-red-50 text-red-600 font-bold rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 text-sm"
                  >
                    Reject
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div v-if="totalPages > 1" class="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
        <button 
          @click="page--" 
          :disabled="page === 1"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        <span class="text-sm text-gray-500">Page {{ page }} of {{ totalPages }}</span>
        <button 
          @click="page++" 
          :disabled="page === totalPages"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
    
    <!-- Image Modal -->
    <div v-if="selectedImage" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" @click="selectedImage = null">
      <img :src="selectedImage" class="max-w-full max-h-full rounded-xl" @click.stop>
      <button class="absolute top-6 right-6 text-white w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20" @click="selectedImage = null">
        <X class="w-5 h-5" />
      </button>
    </div>

    <!-- Approve Modal -->
    <div v-if="approveModalOpen" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4" @click.self="approveModalOpen = false">
      <div class="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-center">
        <div class="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h3 class="text-lg font-bold text-gray-900 mb-2">Approve Dispatcher?</h3>
        <p class="text-sm text-gray-500 mb-6">Are you sure you want to approve <span class="font-bold text-gray-900">{{ selectedDispatcher?.user?.firstName }} {{ selectedDispatcher?.user?.lastName }}</span>? They will gain full access to deliveries.</p>
        <div class="flex gap-3">
          <button @click="approveModalOpen = false" class="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
          <button @click="confirmApprove" :disabled="processing === selectedDispatcher?._id" class="flex-1 py-2.5 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-50">Approve</button>
        </div>
      </div>
    </div>

    <!-- Reject Modal -->
    <div v-if="rejectModalOpen" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4" @click.self="rejectModalOpen = false">
      <div class="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-left">
        <div class="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </div>
        <h3 class="text-lg font-bold text-gray-900 mb-2 text-center">Reject Verification</h3>
        <p class="text-sm text-gray-500 mb-4 text-center">Rejecting <span class="font-bold text-gray-900">{{ selectedDispatcher?.user?.firstName }} {{ selectedDispatcher?.user?.lastName }}</span> will block their access.</p>
        
        <div class="mb-6">
          <label class="block text-xs font-bold text-gray-700 mb-2">Reason for rejection (Optional)</label>
          <textarea v-model="rejectionReason" placeholder="e.g. ID card is blurry..." class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none transition-all shadow-sm resize-none h-24"></textarea>
        </div>

        <div class="flex gap-3">
          <button @click="rejectModalOpen = false" class="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
          <button @click="confirmReject" :disabled="processing === selectedDispatcher?._id" class="flex-1 py-2.5 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50">Reject</button>
        </div>
      </div>
    </div>

    <!-- Profile Drawer -->
    <div v-if="drawerOpen" class="fixed inset-0 z-50 flex justify-end">
      <div class="absolute inset-0 bg-black/20 backdrop-blur-sm" @click="drawerOpen = false"></div>
      <div class="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 overflow-y-auto">
        <div class="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 class="text-lg font-bold text-gray-900">Dispatcher Profile</h2>
          <button @click="drawerOpen = false" class="p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors">
            <X class="w-5 h-5" />
          </button>
        </div>
        
        <div v-if="selectedProfile" class="p-6 space-y-8 flex-1">
          <!-- Header -->
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 bg-gray-100 rounded-full overflow-hidden">
              <img v-if="selectedProfile.user?.avatar" :src="selectedProfile.user?.avatar" class="w-full h-full object-cover">
            </div>
            <div>
              <h3 class="font-bold text-xl text-gray-900">{{ selectedProfile.user?.firstName }} {{ selectedProfile.user?.lastName }}</h3>
              <p class="text-sm text-gray-500">{{ selectedProfile.user?.email }}</p>
              <span v-if="selectedProfile.isApproved" class="inline-flex items-center gap-1 mt-2 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-md">
                <div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Active
              </span>
              <span v-else class="inline-flex items-center gap-1 mt-2 px-2 py-0.5 bg-red-50 text-red-700 text-xs font-bold rounded-md">
                <div class="w-1.5 h-1.5 rounded-full bg-red-500"></div> Suspended
              </span>
            </div>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <p class="text-xs font-bold text-gray-500 uppercase">Deliveries</p>
              <p class="text-2xl font-black text-gray-900 mt-1">{{ selectedProfile.totalDeliveries || 0 }}</p>
            </div>
            <div class="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <p class="text-xs font-bold text-gray-500 uppercase">Rating</p>
              <div class="flex items-center gap-1 mt-1">
                <p class="text-2xl font-black text-gray-900">{{ (selectedProfile.rating || 0).toFixed(1) }}</p>
                <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div>
            <h4 class="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">Account Actions</h4>
            <div class="space-y-3">
              <button 
                v-if="selectedProfile.isApproved"
                @click="toggleSuspension(selectedProfile._id, 'suspend')" 
                :disabled="processing === selectedProfile._id"
                class="w-full flex items-center justify-between p-4 rounded-xl border border-red-100 bg-red-50 hover:bg-red-100 transition-colors text-red-700 font-bold group"
              >
                <span>Suspend Dispatcher</span>
                <span class="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </button>
              
              <button 
                v-else
                @click="toggleSuspension(selectedProfile._id, 'activate')" 
                :disabled="processing === selectedProfile._id"
                class="w-full flex items-center justify-between p-4 rounded-xl border border-emerald-100 bg-emerald-50 hover:bg-emerald-100 transition-colors text-emerald-700 font-bold group"
              >
                <span>Reactivate Dispatcher</span>
                <span class="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </button>
            </div>
            <p class="text-xs text-gray-500 mt-3 text-center">Suspending a dispatcher prevents them from accepting new deliveries or going online.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config'
import { useCustomToast as useToast } from '@/composables/core/useCustomToast'
import { RefreshCw, X } from 'lucide-vue-next'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Dispatchers Management - Admin' })

// Tabs
const activeTab = ref('verifications') // 'verifications' | 'all'

// Verifications state
const dispatchers = ref<any[]>([])
const loading = ref(false)
const page = ref(1)
const total = ref(0)
const totalPages = computed(() => Math.ceil(total.value / 10))

// All dispatchers state
const allDispatchers = ref<any[]>([])
const allLoading = ref(false)
const allPage = ref(1)
const allTotal = ref(0)
const allTotalPages = computed(() => Math.ceil(allTotal.value / 10))

const processing = ref<string | null>(null)
const { showToast } = useToast()
const selectedImage = ref<string | null>(null)

// Modals
const approveModalOpen = ref(false)
const rejectModalOpen = ref(false)
const selectedDispatcher = ref<any>(null)
const rejectionReason = ref('')

// Drawer
const drawerOpen = ref(false)
const selectedProfile = ref<any>(null)

const fetchPending = async () => {
  loading.value = true
  try {
    const res = await api.get(`/admin/dispatchers/pending?page=${page.value}&limit=10`)
    dispatchers.value = res.data?.dispatchers || []
    total.value = res.data?.total || 0
  } catch (err) {
    showToast({ title: 'Error', message: 'Failed to fetch pending dispatchers', toastType: 'error' })
  } finally {
    loading.value = false
  }
}

const fetchAll = async () => {
  allLoading.value = true
  try {
    const res = await api.get(`/admin/dispatchers?page=${allPage.value}&limit=10`)
    allDispatchers.value = res.data?.dispatchers || []
    allTotal.value = res.data?.total || 0
  } catch (err) {
    showToast({ title: 'Error', message: 'Failed to fetch all dispatchers', toastType: 'error' })
  } finally {
    allLoading.value = false
  }
}

// Watchers
watch(page, fetchPending)
watch(allPage, fetchAll)
watch(activeTab, (newTab) => {
  if (newTab === 'verifications') fetchPending()
  else if (newTab === 'all') fetchAll()
})

onMounted(() => {
  fetchPending()
  fetchAll()
})

const viewImage = (url: string) => {
  selectedImage.value = url
}

const openApproveModal = (errander: any) => {
  selectedDispatcher.value = errander
  approveModalOpen.value = true
}

const openRejectModal = (errander: any) => {
  selectedDispatcher.value = errander
  rejectionReason.value = ''
  rejectModalOpen.value = true
}

const openProfileDrawer = async (errander: any) => {
  processing.value = errander._id
  try {
    const res = await api.get(`/admin/dispatchers/${errander._id}`)
    selectedProfile.value = res.data
    drawerOpen.value = true
  } catch (err) {
    showToast({ title: 'Error', message: 'Failed to load profile', toastType: 'error' })
  } finally {
    processing.value = null
  }
}

const toggleSuspension = async (id: string, action: 'suspend' | 'activate') => {
  if (!confirm(`Are you sure you want to ${action} this dispatcher?`)) return
  processing.value = id
  try {
    await api.put(`/admin/dispatchers/${id}/${action}`)
    showToast({ title: 'Success', message: `Dispatcher ${action}d successfully`, toastType: 'success' })
    await fetchAll()
    // Refresh drawer data
    const res = await api.get(`/admin/dispatchers/${id}`)
    selectedProfile.value = res.data
  } catch (err) {
    showToast({ title: 'Error', message: `Failed to ${action} dispatcher`, toastType: 'error' })
  } finally {
    processing.value = null
  }
}

const confirmApprove = async () => {
  if (!selectedDispatcher.value) return
  processing.value = selectedDispatcher.value._id
  try {
    await api.put(`/admin/dispatchers/${selectedDispatcher.value._id}/approve`)
    showToast({ title: 'Approved', message: 'Dispatcher verified successfully', toastType: 'success' })
    approveModalOpen.value = false
    await fetchPending()
    if (activeTab.value === 'all') await fetchAll()
  } catch (err) {
    showToast({ title: 'Error', message: 'Failed to approve dispatcher', toastType: 'error' })
  } finally {
    processing.value = null
  }
}

const confirmReject = async () => {
  if (!selectedDispatcher.value) return
  processing.value = selectedDispatcher.value._id
  try {
    await api.put(`/admin/dispatchers/${selectedDispatcher.value._id}/reject`, { reason: rejectionReason.value })
    showToast({ title: 'Rejected', message: 'Verification rejected', toastType: 'success' })
    rejectModalOpen.value = false
    await fetchPending()
  } catch (err) {
    showToast({ title: 'Error', message: 'Failed to reject dispatcher', toastType: 'error' })
  } finally {
    processing.value = null
  }
}
</script>
