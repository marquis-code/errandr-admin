<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div class="relative w-full sm:w-96">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search class="h-4 w-4 text-gray-400" />
        </div>
        <input 
          v-model="searchQuery" 
          type="text" 
          class="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-parentPrimary/20 focus:border-parentPrimary transition-colors sm:text-sm" 
          placeholder="Search promo codes..."
        >
      </div>
      
      <button 
        @click="openModal()" 
        class="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors shadow-sm"
      >
        <Plus class="w-4 h-4" />
        Create Promo Code
      </button>
    </div>

    <!-- Promo Codes Table -->
    <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-100 bg-gray-50/50">
              <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">Code</th>
              <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">Discount</th>
              <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">Usage</th>
              <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">Limits</th>
              <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">Status</th>
              <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr v-if="loading" v-for="i in 5" :key="i" class="animate-pulse">
              <td class="px-6 py-4"><div class="h-4 bg-gray-100 rounded w-24"></div></td>
              <td class="px-6 py-4"><div class="h-4 bg-gray-100 rounded w-16"></div></td>
              <td class="px-6 py-4"><div class="h-4 bg-gray-100 rounded w-20"></div></td>
              <td class="px-6 py-4"><div class="h-4 bg-gray-100 rounded w-24"></div></td>
              <td class="px-6 py-4"><div class="h-4 bg-gray-100 rounded w-16"></div></td>
              <td class="px-6 py-4"><div class="h-4 bg-gray-100 rounded w-8 ml-auto"></div></td>
            </tr>
            <tr v-else-if="filteredPromos.length === 0">
              <td colspan="6" class="px-6 py-12 text-center">
                <div class="flex flex-col items-center justify-center text-gray-400">
                  <Tag class="w-12 h-12 mb-3 opacity-20" />
                  <p class="text-sm font-medium text-gray-900">No promo codes found</p>
                  <p class="text-xs">Create a new promo code to get started.</p>
                </div>
              </td>
            </tr>
            <tr v-else v-for="promo in filteredPromos" :key="promo._id" class="hover:bg-gray-50/50 transition-colors">
              <td class="px-6 py-4">
                <div class="flex flex-col">
                  <span class="text-sm font-bold text-gray-900 font-mono tracking-tight">{{ promo.code }}</span>
                  <span v-if="promo.onlyForNewUsers" class="text-[10px] font-bold text-amber-600">New Users Only</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-col">
                  <span class="text-sm font-semibold text-gray-900">
                    {{ promo.discountType === 'percentage' ? promo.value + '%' : '₦' + promo.value.toLocaleString() }}
                  </span>
                  <span v-if="promo.maxDiscountAmount" class="text-[10px] text-gray-500">Up to ₦{{ promo.maxDiscountAmount.toLocaleString() }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <div class="w-full bg-gray-100 rounded-full h-1.5 max-w-[60px]">
                    <div class="bg-parentPrimary h-1.5 rounded-full" :style="{ width: getUsagePercentage(promo) + '%' }"></div>
                  </div>
                  <span class="text-xs font-medium text-gray-600">
                    {{ promo.usageCount }}{{ promo.maxUsageCount ? '/' + promo.maxUsageCount : '' }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-col gap-1">
                  <span v-if="promo.minOrderAmount" class="text-[10px] font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md inline-block w-max">
                    Min: ₦{{ promo.minOrderAmount.toLocaleString() }}
                  </span>
                  <span v-if="promo.expiresAt" class="text-[10px] font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md inline-block w-max" :class="{'text-rose-600 bg-rose-50': isExpired(promo.expiresAt)}">
                    Exp: {{ new Date(promo.expiresAt).toLocaleDateString() }}
                  </span>
                  
                  <span v-if="promo.appliesToDeliveryFeeOnly" class="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md inline-block w-max">
                    Delivery Fee Only
                  </span>
                  
                  <span v-if="promo.applicableOrderTypes?.length" class="text-[10px] font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md inline-block w-max">
                    {{ promo.applicableOrderTypes.length }} Order Type(s)
                  </span>
                  <span v-if="promo.applicableVendors?.length" class="text-[10px] font-medium text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md inline-block w-max">
                    {{ promo.applicableVendors.length }} Vendor(s)
                  </span>
                  <span v-if="promo.applicableUsers?.length" class="text-[10px] font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md inline-block w-max">
                    {{ promo.applicableUsers.length }} User(s)
                  </span>

                  <span v-if="!promo.minOrderAmount && !promo.expiresAt && !promo.appliesToDeliveryFeeOnly && !promo.applicableOrderTypes?.length && !promo.applicableVendors?.length && !promo.applicableUsers?.length" class="text-xs text-gray-400">No limits</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <button 
                  @click="toggleStatus(promo)"
                  class="relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                  :class="promo.isActive ? 'bg-emerald-500' : 'bg-gray-200'"
                >
                  <span 
                    class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                    :class="promo.isActive ? 'translate-x-4' : 'translate-x-0'"
                  />
                </button>
              </td>
              <td class="px-6 py-4 text-right">
                <button @click="copyCode(promo.code)" class="p-1.5 text-gray-400 hover:text-parentPrimary hover:bg-parentPrimary/10 rounded-lg transition-colors">
                  <Copy class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create Promo Modal -->
    <UiSideDrawer :is-open="isModalOpen" @close="closeModal" size="default">
      <div class="space-y-6">
        <div>
          <h2 class="text-lg font-bold text-gray-900">Create Promo Code</h2>
          <p class="text-xs text-gray-500">Configure robust discounts and restrictions.</p>
        </div>

        <form @submit.prevent="submitForm" class="space-y-5">
          <!-- Code -->
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Promo Code *</label>
            <input v-model="form.code" type="text" required placeholder="e.g. SUMMER50" class="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-sm font-mono uppercase focus:outline-none focus:border-parentPrimary focus:ring-1 focus:ring-parentPrimary">
          </div>

          <div class="grid grid-cols-2 gap-4">
            <!-- Type -->
            <div>
              <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Discount Type *</label>
              <select v-model="form.discountType" class="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-parentPrimary focus:ring-1 focus:ring-parentPrimary">
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat Amount (₦)</option>
              </select>
            </div>
            
            <!-- Value -->
            <div>
              <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Value *</label>
              <input v-model.number="form.value" type="number" required min="1" class="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-parentPrimary focus:ring-1 focus:ring-parentPrimary">
            </div>
          </div>

          <!-- Max Discount (Percentage Only) -->
          <div v-if="form.discountType === 'percentage'">
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Max Discount Cap (₦)</label>
            <input v-model.number="form.maxDiscountAmount" type="number" min="0" placeholder="e.g. 1000 (0 for no limit)" class="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-parentPrimary focus:ring-1 focus:ring-parentPrimary">
          </div>

          <div class="grid grid-cols-2 gap-4">
            <!-- Min Order -->
            <div>
              <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Min Order Amount (₦)</label>
              <input v-model.number="form.minOrderAmount" type="number" min="0" class="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-parentPrimary focus:ring-1 focus:ring-parentPrimary">
            </div>
            
            <!-- Max Usage -->
            <div>
              <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Max Global Usage</label>
              <input v-model.number="form.maxUsageCount" type="number" min="0" placeholder="e.g. 100" class="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-parentPrimary focus:ring-1 focus:ring-parentPrimary">
            </div>
          </div>

          <!-- Expiry -->
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Expiry Date</label>
            <input v-model="form.expiresAt" type="datetime-local" class="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-sm focus:outline-none focus:border-parentPrimary focus:ring-1 focus:ring-parentPrimary">
          </div>

          <div class="border-t border-gray-100 pt-4 mt-4 space-y-4">
            <h3 class="text-sm font-bold text-gray-900">Advanced Restrictions</h3>
            
            <div class="flex flex-col gap-4 mt-6">
              <!-- Order Type Restrictions -->
              <div>
                <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Applicable Order Types</label>
                <div class="flex flex-wrap gap-4 bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" value="inside_campus" v-model="form.applicableOrderTypes" class="w-4 h-4 text-parentPrimary rounded border-gray-300">
                    <span class="text-sm text-gray-700">Inside Campus</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" value="outside_campus" v-model="form.applicableOrderTypes" class="w-4 h-4 text-parentPrimary rounded border-gray-300">
                    <span class="text-sm text-gray-700">Outside Campus</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" value="custom_errand" v-model="form.applicableOrderTypes" class="w-4 h-4 text-parentPrimary rounded border-gray-300">
                    <span class="text-sm text-gray-700">Custom Errand</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" value="group_order" v-model="form.applicableOrderTypes" class="w-4 h-4 text-parentPrimary rounded border-gray-300">
                    <span class="text-sm text-gray-700">Group Order</span>
                  </label>
                </div>
                <p class="text-[10px] text-gray-500 mt-1">Leave all unchecked to apply to any order type.</p>
              </div>

              <!-- Vendor Restrictions -->
              <div>
                <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Restrict to Vendors</label>
                <SearchableMultiSelect 
                  v-model="form.applicableVendors"
                  :options="vendorOptions"
                  placeholder="Search vendors..."
                />
              </div>

              <!-- User Restrictions -->
              <div>
                <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Restrict to Users</label>
                <SearchableMultiSelect 
                  v-model="form.applicableUsers"
                  :options="userOptions"
                  placeholder="Search users..."
                />
              </div>
            </div>

            <div class="mt-6 flex flex-col gap-3">
              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" v-model="form.onlyForNewUsers" class="w-4 h-4 text-parentPrimary rounded border-gray-300 focus:ring-parentPrimary">
                <span class="text-sm text-gray-700 font-medium">Only for New Users (0 completed orders)</span>
              </label>

              <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" v-model="form.appliesToDeliveryFeeOnly" class="w-4 h-4 text-parentPrimary rounded border-gray-300 focus:ring-parentPrimary">
                <span class="text-sm text-gray-700 font-medium">Apply Discount to Delivery Fee Only</span>
              </label>
            </div>
          </div>

          <div class="pt-6">
            <button 
              type="submit" 
              :disabled="isSubmitting"
              class="w-full flex justify-center items-center gap-2 bg-gray-900 text-white py-3 px-4 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
            >
              <Loader2 v-if="isSubmitting" class="w-4 h-4 animate-spin" />
              <span>{{ isSubmitting ? 'Creating...' : 'Create Promo Code' }}</span>
            </button>
          </div>
        </form>
      </div>
    </UiSideDrawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Search, Plus, Tag, Loader2, Copy } from 'lucide-vue-next'
import { useCustomToast } from '@/composables/core/useCustomToast'
import { usePromos } from '@/composables/modules/promos/usePromos'
import SearchableMultiSelect from '@/components/ui/SearchableMultiSelect.vue'

definePageMeta({
  layout: 'admin'
})

const { showToast } = useCustomToast()
const { promos, users, vendors, loading, isSubmitting, fetchPromos, fetchDependencies, createPromo, toggleStatus: _toggleStatus } = usePromos()

const searchQuery = ref('')
const isModalOpen = ref(false)

const form = ref({
  code: '',
  discountType: 'percentage',
  value: 10,
  minOrderAmount: 0,
  maxDiscountAmount: 0,
  maxUsageCount: 0,
  expiresAt: '',
  onlyForNewUsers: false,
  appliesToDeliveryFeeOnly: false,
  applicableVendors: [] as string[],
  applicableUsers: [] as string[],
  applicableOrderTypes: [] as string[]
})

const vendorOptions = computed(() => {
  return vendors.value.map(v => ({
    label: v.storeName || v.businessName || v.name || 'Unnamed Vendor',
    value: v._id,
    sublabel: v.email || ''
  }))
})

const userOptions = computed(() => {
  return users.value.map(u => ({
    label: u.fname ? u.fname + ' ' + (u.lname || '') : u.email,
    value: u._id,
    sublabel: u.phone || u.email || ''
  }))
})

const filteredPromos = computed(() => {
  if (!searchQuery.value) return promos.value
  const query = searchQuery.value.toLowerCase()
  return promos.value.filter(p => p.code.toLowerCase().includes(query))
})

const getUsagePercentage = (promo: any) => {
  if (!promo.maxUsageCount) return 0
  return Math.min(100, Math.round((promo.usageCount / promo.maxUsageCount) * 100))
}

const isExpired = (dateString: string) => {
  return new Date(dateString) < new Date()
}

const openModal = () => {
  form.value = {
    code: '',
    discountType: 'percentage',
    value: 10,
    minOrderAmount: 0,
    maxDiscountAmount: 0,
    maxUsageCount: 0,
    expiresAt: '',
    onlyForNewUsers: false,
    appliesToDeliveryFeeOnly: false,
    applicableVendors: [],
    applicableUsers: [],
    applicableOrderTypes: []
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
}

const copyCode = (code: string) => {
  navigator.clipboard.writeText(code)
  showToast({ title: 'Copied', message: 'Promo code copied to clipboard', toastType: 'success' })
}

const toggleStatus = async (promo: any) => {
  await _toggleStatus(promo)
}

const submitForm = async () => {
  const payload = {
    ...form.value,
    // Arrays are already populated nicely by checkboxes
    applicableVendors: form.value.applicableVendors,
    applicableUsers: form.value.applicableUsers,
    applicableOrderTypes: form.value.applicableOrderTypes,
    appliesToDeliveryFeeOnly: form.value.appliesToDeliveryFeeOnly,
    // Set to undefined if 0 or empty so schema defaults/optionals work correctly
    maxDiscountAmount: form.value.maxDiscountAmount || undefined,
    minOrderAmount: form.value.minOrderAmount || undefined,
    maxUsageCount: form.value.maxUsageCount || undefined,
    expiresAt: form.value.expiresAt ? new Date(form.value.expiresAt) : undefined
  }
  
  const success = await createPromo(payload)
  if (success) {
    closeModal()
    fetchPromos()
  }
}

onMounted(() => {
  fetchPromos()
  fetchDependencies()
})
</script>
