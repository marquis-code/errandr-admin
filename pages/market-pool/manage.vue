<template>
  <div class="p-6 bg-white min-h-screen">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Market Pool Management</h1>
        <p class="text-sm text-gray-500 mt-1">Manage weekly campaigns, aggregation, and refunds.</p>
      </div>
      <button @click="showCreateModal = true" class="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:bg-primary/90 transition-colors">
        <Plus class="w-4 h-4" /> Create Campaign
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

        <div class="flex gap-6 border-b border-gray-100 mb-6 px-6">
          <button @click="activeTab = 'aggregation'" :class="['pb-3 font-semibold text-sm border-b-2 transition-colors', activeTab === 'aggregation' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700']">Aggregation Dashboard</button>
          <button @click="activeTab = 'catalog'" :class="['pb-3 font-semibold text-sm border-b-2 transition-colors', activeTab === 'catalog' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700']">Manage Catalog</button>
          <button @click="activeTab = 'requests'" :class="['pb-3 font-semibold text-sm border-b-2 transition-colors', activeTab === 'requests' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700']">Student Requests</button>
        </div>

        <!-- Aggregation Tab -->
        <div v-if="activeTab === 'aggregation'" class="p-6 pt-0">
          <div class="flex items-center justify-end mb-4">
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
        <div v-else class="py-16 flex flex-col items-center justify-center text-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
          <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-gray-100">
            <ShoppingCart class="w-8 h-8 text-gray-400" />
          </div>
          <h4 class="font-bold text-gray-900 text-lg tracking-tight mb-1">No Orders Yet</h4>
          <p class="text-sm text-gray-500 max-w-sm">No students have placed orders in this campaign yet. Check back later once the pool starts filling up.</p>
        </div>
        </div>
        <!-- Catalog Tab -->
        <div v-if="activeTab === 'catalog'" class="p-6 pt-0">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold text-gray-800">Current Catalog Items</h3>
            <button @click="showAddItemModal = true" class="text-sm bg-primary text-white px-3 py-1.5 rounded-lg font-medium hover:bg-primary/90 flex items-center gap-1">
              <Plus class="w-4 h-4" /> Add Item
            </button>
          </div>
          <div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="item in catalogItems" :key="item._id" class="border border-gray-200 rounded-xl p-4 flex flex-col">
              <div class="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden flex items-center justify-center">
                <img v-if="item.imageUrl" :src="item.imageUrl" class="w-full h-full object-cover" />
                <ShoppingCart v-else class="w-8 h-8 text-gray-300" />
              </div>
              <h4 class="font-bold text-gray-900">{{ item.name }}</h4>
              <p class="text-xs text-gray-500 mb-2">{{ item.studentQuantity }}</p>
              <div class="mt-auto">
                <p class="text-xs text-gray-500">Buffer Price: ₦{{ item.appPrice.toLocaleString() }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Student Requests Tab -->
        <div v-if="activeTab === 'requests'" class="p-6 pt-0">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold text-gray-800">Custom Item Requests</h3>
            <button @click="fetchCustomRequests" class="text-sm text-primary font-medium hover:underline">
              Refresh
            </button>
          </div>
          <div v-if="customRequests.length > 0" class="space-y-3">
            <div v-for="req in customRequests" :key="req._id" class="border border-gray-200 rounded-xl p-4 flex justify-between items-center">
              <div>
                <h4 class="font-bold text-gray-900">{{ req.itemName }}</h4>
                <p class="text-sm text-gray-600 mb-1">{{ req.description }}</p>
                <div class="flex gap-3 text-xs text-gray-500">
                  <span class="font-medium bg-gray-100 px-2 py-0.5 rounded">Qty: {{ req.desiredQuantity }}</span>
                  <span>Requested by: {{ req.userId?.name }} ({{ req.userId?.phone }})</span>
                </div>
              </div>
              <button @click="approveRequestToCatalog(req)" class="text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg font-medium hover:bg-blue-100">
                Add to Catalog
              </button>
            </div>
          </div>
          <div v-else class="py-12 text-center text-gray-500">
            No custom requests from students.
          </div>
        </div>
      </div>
    </div>
    
    <div v-else-if="!loading" class="py-24 flex flex-col items-center justify-center text-center bg-white rounded-xl border border-dashed border-gray-200">
      <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
        <CalendarX class="w-10 h-10 text-gray-400" />
      </div>
      <h3 class="text-xl font-bold text-gray-900 tracking-tight">No Active Campaign</h3>
      <p class="text-gray-500 mt-2 max-w-md">There is currently no active market pool campaign running. Create a new campaign to open the pool for students.</p>
      <button @click="showCreateModal = true" class="mt-6 flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg font-bold shadow-sm hover:bg-primary/90 transition-colors">
        <Plus class="w-4 h-4" /> Create Campaign
      </button>
    </div>

    <!-- Create Campaign Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div class="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden" @click.stop>
        <div class="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h3 class="text-lg font-bold text-gray-900">Create New Campaign</h3>
            <p class="text-xs text-gray-500 mt-1">Set up a new market pool run</p>
          </div>
          <button @click="showCreateModal = false" class="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X class="w-5 h-5" />
          </button>
        </div>
        
        <div class="p-6 space-y-5">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Campaign Title</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LayoutList class="h-4 w-4 text-gray-400" />
              </div>
              <input v-model="newCampaign.title" type="text" placeholder="e.g. Week 1 Market Run" class="w-full pl-10 bg-gray-50 border-gray-200 text-gray-900 rounded-xl focus:ring-primary focus:border-primary focus:bg-white sm:text-sm px-3 py-2.5 border transition-colors outline-none">
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1.5">Start Date</label>
              <div class="relative">
                <input v-model="newCampaign.startDate" type="datetime-local" class="w-full bg-gray-50 border-gray-200 text-gray-900 rounded-xl focus:ring-primary focus:border-primary focus:bg-white sm:text-sm px-3 py-2.5 border transition-colors outline-none">
              </div>
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1.5">End Date</label>
              <div class="relative">
                <input v-model="newCampaign.endDate" type="datetime-local" class="w-full bg-gray-50 border-gray-200 text-gray-900 rounded-xl focus:ring-primary focus:border-primary focus:bg-white sm:text-sm px-3 py-2.5 border transition-colors outline-none">
              </div>
            </div>
          </div>
          
          <div class="flex items-start gap-3 bg-blue-50/50 p-4 rounded-xl border border-blue-100 mt-2">
            <div class="flex items-center h-5 mt-0.5">
              <input type="checkbox" id="autoPopulate" v-model="autoPopulate" class="rounded text-primary focus:ring-primary h-4 w-4 border-gray-300">
            </div>
            <div class="flex flex-col">
              <label for="autoPopulate" class="text-sm font-bold text-gray-700 cursor-pointer">Auto-populate Standard Catalog</label>
              <p class="text-xs text-gray-500 mt-0.5">Automatically adds staples (Rice, Beans, Garri, Eggs, Indomie) to the pool</p>
            </div>
          </div>
        </div>

        <div class="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
          <button @click="showCreateModal = false" class="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
            Cancel
          </button>
          <button 
            @click="createCampaign" 
            :disabled="loading"
            class="px-5 py-2.5 text-sm font-bold text-white bg-primary hover:bg-primary/90 rounded-xl transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            Start Campaign
          </button>
        </div>
      </div>
    </div>

    <!-- Add Item Modal -->
    <div v-if="showAddItemModal" class="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in">
      <div class="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden" @click.stop>
        <div class="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h3 class="text-lg font-bold text-gray-900">Add Catalog Item</h3>
            <p class="text-xs text-gray-500 mt-1">Upload an image and define measurement units.</p>
          </div>
          <button @click="showAddItemModal = false" class="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X class="w-5 h-5" />
          </button>
        </div>
        
        <div class="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Item Image</label>
            <input type="file" @change="handleImageUpload" accept="image/*" class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer">
            <div v-if="uploadingImage" class="text-xs text-gray-500 mt-2">Uploading image...</div>
            <img v-if="newItem.imageUrl" :src="newItem.imageUrl" class="mt-3 w-24 h-24 object-cover rounded-xl border border-gray-200" />
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Item Name</label>
            <input v-model="newItem.name" type="text" placeholder="e.g. Sweet Potatoes" class="w-full bg-gray-50 border-gray-200 text-gray-900 rounded-xl focus:ring-primary px-3 py-2 border outline-none">
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
            <textarea v-model="newItem.description" placeholder="e.g. Fresh from the farm" class="w-full bg-gray-50 border-gray-200 text-gray-900 rounded-xl focus:ring-primary px-3 py-2 border outline-none resize-none"></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1.5">Measurement / Qty</label>
              <input v-model="newItem.studentQuantity" type="text" placeholder="e.g. 1 Paint Bucket" class="w-full bg-gray-50 border-gray-200 text-gray-900 rounded-xl focus:ring-primary px-3 py-2 border outline-none">
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-1.5">App Price (₦)</label>
              <input v-model="newItem.appPrice" type="number" placeholder="e.g. 4500" class="w-full bg-gray-50 border-gray-200 text-gray-900 rounded-xl focus:ring-primary px-3 py-2 border outline-none">
            </div>
          </div>
        </div>

        <div class="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
          <button @click="showAddItemModal = false" class="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
          <button @click="submitNewItem" :disabled="loading || uploadingImage" class="px-5 py-2.5 text-sm font-bold text-white bg-primary hover:bg-primary/90 rounded-xl transition-all shadow-sm flex items-center gap-2 disabled:opacity-50">Add Item</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { Plus, X, CalendarX, ShoppingCart, LayoutList, UploadCloud } from 'lucide-vue-next'
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config'
import { useCustomToast } from '@/composables/core/useCustomToast'

definePageMeta({
  layout: 'admin'
})

const { showToast } = useCustomToast()

const activeTab = ref('aggregation')
const loading = ref(true)
const campaign = ref(null)
const loadingAggregation = ref(false)
const aggregation = ref([])
const catalogItems = ref([])
const customRequests = ref([])

const showCreateModal = ref(false)
const showAddItemModal = ref(false)
const newCampaign = ref({ title: '', startDate: '', endDate: '' })
const autoPopulate = ref(true)

const newItem = ref({ name: '', description: '', studentQuantity: '', wholesaleEstimatedCost: 0, appPrice: '', imageUrl: '' })
const uploadingImage = ref(false)

const formatDateForInput = (date) => {
  const pad = (n) => n.toString().padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

const getNextDayOfWeek = (dayOfWeek, hour) => {
  const date = new Date()
  const currentDay = date.getDay()
  const daysUntil = (dayOfWeek + 7 - currentDay) % 7 || 7
  date.setDate(date.getDate() + daysUntil)
  date.setHours(hour, 0, 0, 0)
  return date
}

watch(showCreateModal, (val) => {
  if (val) {
    const nextMonday = getNextDayOfWeek(1, 8)
    const nextWednesday = getNextDayOfWeek(3, 20)
    const weekOfStr = nextMonday.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    
    newCampaign.value.title = `Campus Market Pool - Week of ${weekOfStr}`
    newCampaign.value.startDate = formatDateForInput(nextMonday)
    newCampaign.value.endDate = formatDateForInput(nextWednesday)
    autoPopulate.value = true
  }
})

onMounted(async () => {
  await fetchActiveCampaign()
})

const fetchActiveCampaign = async () => {
  try {
    loading.value = true
    const res = await api.get('/market-pool/active')
    if (res.data?.campaign) {
      campaign.value = res.data.campaign
      catalogItems.value = res.data.items || []
      await Promise.all([fetchAggregation(), fetchCustomRequests()])
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const createCampaign = async () => {
  if (!newCampaign.value.title || !newCampaign.value.startDate || !newCampaign.value.endDate) {
    return showToast({ title: 'Error', message: 'Please fill in all fields', toastType: 'error' })
  }
  try {
    loading.value = true
    const res = await api.post('/market-pool/campaigns', {
      title: newCampaign.value.title,
      startDate: new Date(newCampaign.value.startDate),
      endDate: new Date(newCampaign.value.endDate)
    })
    
    const createdCampaign = res.data
    
    if (autoPopulate.value && createdCampaign && createdCampaign._id) {
      const standardCatalog = [
        { name: 'Rice', description: 'Long grain parboiled rice', studentQuantity: '1 Derica', wholesaleEstimatedCost: 1000, appPrice: 1200 },
        { name: 'Beans', description: 'Oloyin beans', studentQuantity: '1 Derica', wholesaleEstimatedCost: 1300, appPrice: 1500 },
        { name: 'Garri', description: 'White/Yellow Garri', studentQuantity: '1 Derica', wholesaleEstimatedCost: 700, appPrice: 800 },
        { name: 'Eggs', description: 'Large farm eggs', studentQuantity: 'Half Crate', wholesaleEstimatedCost: 2200, appPrice: 2500 },
        { name: 'Indomie Noodles', description: 'Onion chicken flavor', studentQuantity: '1 Carton', wholesaleEstimatedCost: 7800, appPrice: 8500 }
      ]
      
      await Promise.all(standardCatalog.map(item => 
        api.post(`/market-pool/campaigns/${createdCampaign._id}/items`, item).catch(e => console.error('Failed to add item', e))
      ))
    }
    
    showCreateModal.value = false
    showToast({ title: 'Success', message: 'Campaign created successfully!', toastType: 'success' })
    await fetchActiveCampaign()
  } catch (e) {
    console.error(e)
    showToast({ title: 'Error', message: 'Failed to create campaign', toastType: 'error' })
  } finally {
    loading.value = false
  }
}

const fetchAggregation = async () => {
  if (!campaign.value) return
  try {
    loadingAggregation.value = true
    const res = await api.get(`/market-pool/campaigns/${campaign.value._id}/aggregation`)
    aggregation.value = res.data
  } catch (e) {
    console.error(e)
  } finally {
    loadingAggregation.value = false
  }
}

const fetchCustomRequests = async () => {
  if (!campaign.value) return
  try {
    const res = await api.get(`/market-pool/campaigns/${campaign.value._id}/custom-requests`)
    customRequests.value = res.data
  } catch (e) {
    console.error(e)
  }
}

const handleImageUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  try {
    uploadingImage.value = true
    const formData = new FormData()
    formData.append('file', file)
    const res = await api.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    newItem.value.imageUrl = res.data.secure_url
    showToast({ title: 'Success', message: 'Image uploaded successfully!', toastType: 'success' })
  } catch (e) {
    console.error(e)
    showToast({ title: 'Error', message: 'Failed to upload image', toastType: 'error' })
  } finally {
    uploadingImage.value = false
  }
}

const submitNewItem = async () => {
  if (!newItem.value.name || !newItem.value.studentQuantity || !newItem.value.appPrice) {
    return showToast({ title: 'Error', message: 'Please fill in name, measurement, and price.', toastType: 'error' })
  }
  try {
    loading.value = true
    await api.post(`/market-pool/campaigns/${campaign.value._id}/items`, {
      name: newItem.value.name,
      description: newItem.value.description,
      studentQuantity: newItem.value.studentQuantity,
      appPrice: Number(newItem.value.appPrice),
      wholesaleEstimatedCost: Number(newItem.value.appPrice) * 0.8, // Rough estimate 
      imageUrl: newItem.value.imageUrl
    })
    showToast({ title: 'Success', message: 'Item added successfully', toastType: 'success' })
    showAddItemModal.value = false
    newItem.value = { name: '', description: '', studentQuantity: '', wholesaleEstimatedCost: 0, appPrice: '', imageUrl: '' }
    await fetchActiveCampaign()
  } catch (e) {
    console.error(e)
    showToast({ title: 'Error', message: 'Failed to add item', toastType: 'error' })
  } finally {
    loading.value = false
  }
}

const approveRequestToCatalog = (req) => {
  newItem.value.name = req.itemName
  newItem.value.description = req.description
  newItem.value.studentQuantity = req.desiredQuantity
  activeTab.value = 'catalog'
  showAddItemModal.value = true
}

const triggerRefund = async (itemId, itemName) => {
  const confirmed = confirm(`Are you sure you want to refund all students for ${itemName}? This will credit their wallets immediately.`)
  if (!confirmed) return
  
  try {
    await api.post(`/market-pool/campaigns/${campaign.value._id}/refund-item`, { itemId })
    showToast({ title: 'Success', message: `Successfully refunded ${itemName} to all affected students.`, toastType: 'success' })
    await fetchAggregation()
  } catch (e) {
    console.error(e)
    showToast({ title: 'Error', message: 'Failed to process refunds', toastType: 'error' })
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
