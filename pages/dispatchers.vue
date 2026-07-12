<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Dispatcher Verifications</h1>
      <button @click="fetchPending" class="p-2 text-gray-400 hover:text-gray-900 transition-colors">
        <RefreshCw class="w-5 h-5" :class="{ 'animate-spin': loading }" />
      </button>
    </div>

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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config'
import { useCustomToast as useToast } from '@/composables/core/useCustomToast'
import { RefreshCw, X } from 'lucide-vue-next'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Dispatchers Verification - Admin' })

const dispatchers = ref<any[]>([])
const loading = ref(false)
const processing = ref<string | null>(null)
const page = ref(1)
const total = ref(0)
const totalPages = computed(() => Math.ceil(total.value / 10))
const { showToast } = useToast()
const selectedImage = ref<string | null>(null)

const approveModalOpen = ref(false)
const rejectModalOpen = ref(false)
const selectedDispatcher = ref<any>(null)
const rejectionReason = ref('')

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

watch(page, fetchPending)
onMounted(fetchPending)

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

const confirmApprove = async () => {
  if (!selectedDispatcher.value) return
  processing.value = selectedDispatcher.value._id
  try {
    await api.put(`/admin/dispatchers/${selectedDispatcher.value._id}/approve`)
    showToast({ title: 'Approved', message: 'Dispatcher verified successfully', toastType: 'success' })
    approveModalOpen.value = false
    await fetchPending()
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
