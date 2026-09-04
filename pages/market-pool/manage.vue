<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Market Pool Management</h1>
        <p class="text-sm text-gray-500 mt-1">Manage weekly campaigns, aggregation, and refunds.</p>
      </div>
      <button @click="showCreateModal = true" class="bg-primary text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-primary/90 transition-colors">
        + Create Campaign
      </button>
    </div>

    <!-- Active Campaign Section -->
    <div v-if="campaign" class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
      <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
        <div>
          <h2 class="text-lg font-bold text-gray-900">{{ campaign.title }}</h2>
          <p class="text-xs text-gray-500">
            {{ new Date(campaign.startDate).toLocaleDateString() }} - {{ new Date(campaign.endDate).toLocaleDateString() }}
          </p>
        </div>
        <span class="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold uppercase tracking-wider rounded-full">
          {{ campaign.status }}
        </span>
      </div>

      <div class="p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold text-gray-800">Aggregation Dashboard</h3>
          <button @click="fetchAggregation" class="text-sm text-primary font-medium hover:underline">
            Refresh Aggregation
          </button>
        </div>

        <div v-if="loadingAggregation" class="text-sm text-gray-500 py-4">Loading aggregation data...</div>
        
        <div v-else-if="aggregation.length > 0" class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th class="px-4 py-3 font-semibold rounded-tl-lg">Item</th>
                <th class="px-4 py-3 font-semibold">Total Qty (Student)</th>
                <th class="px-4 py-3 font-semibold">Estimated Bulk Buy</th>
                <th class="px-4 py-3 font-semibold text-right rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="row in aggregation" :key="row._id" class="hover:bg-gray-50/50">
                <td class="px-4 py-3">
                  <p class="font-medium text-gray-900">{{ row.item.name }}</p>
                  <p class="text-[10px] text-gray-500">Buffer Price: ₦{{ row.item.appPrice.toLocaleString() }}</p>
                </td>
                <td class="px-4 py-3">
                  <span class="font-bold text-lg text-primary">{{ row.totalQuantity }}</span>
                  <span class="text-xs text-gray-500 ml-1">x {{ row.item.studentQuantity }}</span>
                </td>
                <td class="px-4 py-3 text-gray-600">
                  <span class="inline-flex items-center px-2 py-1 bg-gray-100 rounded text-xs">
                    {{ calculateBulk(row.totalQuantity, row.item.studentQuantity) }}
                  </span>
                </td>
                <td class="px-4 py-3 text-right">
                  <button 
                    @click="triggerRefund(row.item._id, row.item.name)"
                    class="text-xs px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 font-medium rounded transition-colors"
                  >
                    Trigger Refund
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="text-sm text-gray-500 py-8 text-center bg-gray-50 rounded-lg">
          No orders have been placed in this campaign yet.
        </div>
      </div>
    </div>
    
    <div v-else-if="!loading" class="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
      <h3 class="text-lg font-medium text-gray-900">No Active Campaign</h3>
      <p class="text-gray-500 mt-1">Create a new campaign to start the market pool.</p>
    </div>

    <!-- Create Campaign Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold text-gray-900">Create New Campaign</h3>
          <button @click="showCreateModal = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Campaign Title</label>
            <input v-model="newCampaign.title" type="text" placeholder="e.g. Week 1 Market Run" class="w-full border-gray-300 rounded-lg shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-3 py-2 border">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input v-model="newCampaign.startDate" type="datetime-local" class="w-full border-gray-300 rounded-lg shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-3 py-2 border">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input v-model="newCampaign.endDate" type="datetime-local" class="w-full border-gray-300 rounded-lg shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-3 py-2 border">
          </div>
          <button @click="createCampaign" class="w-full bg-primary text-white font-medium rounded-lg px-4 py-2 hover:bg-primary/90 mt-4 transition-colors">
            Start Campaign
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

definePageMeta({
  layout: 'admin'
})

const { $api } = useNuxtApp()

const loading = ref(true)
const campaign = ref(null)
const loadingAggregation = ref(false)
const aggregation = ref([])
const showCreateModal = ref(false)
const newCampaign = ref({ title: '', startDate: '', endDate: '' })

onMounted(async () => {
  await fetchActiveCampaign()
})

const fetchActiveCampaign = async () => {
  try {
    loading.value = true
    const res = await $api.get('/market-pool/active')
    if (res.data?.campaign) {
      campaign.value = res.data.campaign
      await fetchAggregation()
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const createCampaign = async () => {
  if (!newCampaign.value.title || !newCampaign.value.startDate || !newCampaign.value.endDate) {
    return alert('Please fill in all fields')
  }
  try {
    loading.value = true
    await $api.post('/market-pool/campaigns', {
      title: newCampaign.value.title,
      startDate: new Date(newCampaign.value.startDate),
      endDate: new Date(newCampaign.value.endDate)
    })
    showCreateModal.value = false
    await fetchActiveCampaign()
  } catch (e) {
    console.error(e)
    alert('Failed to create campaign')
  } finally {
    loading.value = false
  }
}

const fetchAggregation = async () => {
  if (!campaign.value) return
  try {
    loadingAggregation.value = true
    const res = await $api.get(`/market-pool/campaigns/${campaign.value._id}/aggregation`)
    aggregation.value = res.data
  } catch (e) {
    console.error(e)
  } finally {
    loadingAggregation.value = false
  }
}

const triggerRefund = async (itemId, itemName) => {
  const confirmed = confirm(`Are you sure you want to refund all students for ${itemName}? This will credit their wallets immediately.`)
  if (!confirmed) return
  
  try {
    await $api.post(`/market-pool/campaigns/${campaign.value._id}/refund-item`, { itemId })
    alert(`Successfully refunded ${itemName} to all affected students.`)
    await fetchAggregation()
  } catch (e) {
    console.error(e)
    alert('Failed to process refunds')
  }
}

const calculateBulk = (qty, type) => {
  // Simple heuristic for the admin view
  if (type.toLowerCase().includes('derica')) {
    const bags = Math.floor(qty / 64)
    const remainder = qty % 64
    if (bags > 0) return `${bags} Bag(s) + ${remainder} Derica(s)`
  }
  if (type.toLowerCase().includes('crate')) {
     const fullCrates = Math.floor(qty / 2) // assuming type is 1/2 crate
     return `${fullCrates} Full Crate(s)`
  }
  return 'Check manually'
}
</script>
