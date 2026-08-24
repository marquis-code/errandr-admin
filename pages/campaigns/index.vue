<template>
  <main class="flex-1 overflow-y-auto bg-gray-50/50 p-4 md:p-8">
    <div class="max-w-6xl mx-auto space-y-6">
      
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Push Campaigns</h1>
          <p class="text-gray-500 text-sm mt-1">Manage automated, interval-based push notifications sent to users.</p>
        </div>
        <button @click="openCreateModal" class="px-5 py-2.5 bg-[#FF5C1A] text-white font-bold rounded-xl shadow-lg shadow-[#FF5C1A]/20 hover:bg-[#e65318] transition-all flex items-center gap-2">
          <Plus class="w-5 h-5" />
          Create Campaign
        </button>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div v-if="loading" class="p-10 flex justify-center">
          <Loader2 class="w-8 h-8 text-[#FF5C1A] animate-spin" />
        </div>
        <div v-else class="overflow-x-auto w-full">
          <table class="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr class="bg-gray-50/80 border-b border-gray-100 text-sm font-semibold text-gray-600">
              <th class="py-4 px-6 whitespace-nowrap">Campaign Title</th>
              <th class="py-4 px-6 whitespace-nowrap">Audience</th>
              <th class="py-4 px-6 whitespace-nowrap">Channels</th>
              <th class="py-4 px-6 whitespace-nowrap">Interval</th>
              <th class="py-4 px-6 whitespace-nowrap">Status</th>
              <th class="py-4 px-6 text-right whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody class="text-sm divide-y divide-gray-100">
            <tr v-for="c in campaigns" :key="c._id" class="hover:bg-gray-50/50 transition-colors group">
              <td class="py-4 px-6">
                <p class="font-bold text-gray-900">{{ c.title }}</p>
                <p class="text-xs text-gray-500 mt-1 line-clamp-1 max-w-xs">{{ c.body }}</p>
              </td>
              <td class="py-4 px-6">
                <span class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold uppercase tracking-wider">
                  {{ c.targetAudience }}
                </span>
              </td>
              <td class="py-4 px-6">
                <div class="flex flex-wrap gap-2">
                  <span v-if="c.sendPush !== false" class="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-semibold">Push</span>
                  <span v-if="c.sendEmail" class="px-2 py-1 bg-orange-50 text-[#FF5C1A] rounded text-xs font-semibold">Email</span>
                  <span v-if="c.sendPush === false && !c.sendEmail" class="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs font-semibold">None</span>
                </div>
              </td>
              <td class="py-4 px-6">
                <div class="flex items-center gap-1 text-gray-600">
                  <Clock class="w-4 h-4 text-gray-400" />
                  {{ c.intervalValue }} {{ c.intervalUnit }}
                </div>
              </td>
              <td class="py-4 px-6">
                <span v-if="c.isActive" class="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center w-max gap-1">
                  <span class="w-1.5 h-1.5 rounded-full bg-green-500"></span> Active
                </span>
                <span v-else class="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold flex items-center w-max gap-1">
                  Inactive
                </span>
              </td>
              <td class="py-4 px-6 text-right space-x-2">
                <button @click="promptTriggerCampaign(c._id)" title="Send Now" class="p-2 text-indigo-500 hover:bg-indigo-50 rounded-xl transition-colors">
                  <Send class="w-4 h-4" />
                </button>
                <button @click="openEditModal(c)" title="Edit" class="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors">
                  <Edit2 class="w-4 h-4" />
                </button>
                <button @click="promptDeleteCampaign(c._id)" title="Delete" class="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                  <Trash2 class="w-4 h-4" />
                </button>
              </td>
            </tr>
            <tr v-if="campaigns.length === 0">
              <td colspan="6" class="py-10 text-center text-gray-500">No push campaigns found.</td>
            </tr>
          </tbody>
        </table>
        </div>
      </div>

    </div>

    <!-- Modals -->
    <CoreCampaignModal 
      v-model="isModalOpen" 
      :campaign="selectedCampaign" 
      @save="handleSave"
    />
    
    <UiConfirmationModal
      :isOpen="confirmationModal.isOpen"
      :title="confirmationModal.title"
      :message="confirmationModal.message"
      :confirmText="confirmationModal.confirmText"
      :type="confirmationModal.type"
      @cancel="confirmationModal.isOpen = false"
      @confirm="handleConfirmAction"
    />
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Plus, Loader2, Clock, Edit2, Trash2, Send } from 'lucide-vue-next'
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config'

const campaigns = ref<any[]>([])
const loading = ref(true)

const isModalOpen = ref(false)
const selectedCampaign = ref<any>(null)

const confirmationModal = ref({
  isOpen: false,
  title: '',
  message: '',
  confirmText: '',
  type: 'danger',
  actionType: '' as 'delete' | 'trigger',
  targetId: ''
})

const fetchCampaigns = async () => {
  try {
    loading.value = true
    const res = await api.get('/push-campaigns')
    campaigns.value = res.data
  } catch (err) {
    console.error('Failed to fetch campaigns', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCampaigns()
})

const openCreateModal = () => {
  selectedCampaign.value = null
  isModalOpen.value = true
}

const openEditModal = (campaign: any) => {
  selectedCampaign.value = campaign
  isModalOpen.value = true
}

const handleSave = async ({ id, data }: { id?: string, data: any }) => {
  try {
    if (id) {
      await api.patch(`/push-campaigns/${id}`, data)
    } else {
      await api.post('/push-campaigns', data)
    }
    useCoreUi().showToast('Campaign saved successfully!', 'success')
    isModalOpen.value = false
    fetchCampaigns()
  } catch (err) {
    useCoreUi().showToast('Failed to save campaign', 'error')
  }
}

const promptDeleteCampaign = (id: string) => {
  confirmationModal.value = {
    isOpen: true,
    title: 'Delete Campaign',
    message: 'Are you sure you want to delete this push campaign? This cannot be undone.',
    confirmText: 'Delete',
    type: 'danger',
    actionType: 'delete',
    targetId: id
  }
}

const promptTriggerCampaign = (id: string) => {
  confirmationModal.value = {
    isOpen: true,
    title: 'Trigger Campaign',
    message: 'This will send a push notification to the target audience immediately. Proceed?',
    confirmText: 'Send Now',
    type: 'success',
    actionType: 'trigger',
    targetId: id
  }
}

const handleConfirmAction = async () => {
  const { actionType, targetId } = confirmationModal.value
  confirmationModal.value.isOpen = false
  
  if (actionType === 'delete') {
    await deleteCampaign(targetId)
  } else if (actionType === 'trigger') {
    await triggerCampaign(targetId)
  }
}

const deleteCampaign = async (id: string) => {
  try {
    await api.delete(`/push-campaigns/${id}`)
    useCoreUi().showToast('Campaign deleted successfully!', 'success')
    fetchCampaigns()
  } catch (err) {
    useCoreUi().showToast('Failed to delete campaign', 'error')
  }
}

const triggerCampaign = async (id: string) => {
  try {
    await api.post(`/push-campaigns/${id}/trigger`)
    useCoreUi().showToast('Campaign dispatched successfully!', 'success')
  } catch (err) {
    useCoreUi().showToast('Failed to trigger campaign', 'error')
  }
}

definePageMeta({
  layout: 'admin'
})
</script>
