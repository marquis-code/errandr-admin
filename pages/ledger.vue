<template>
  <div class="space-y-6">
    <!-- Header & Controls -->
    <div class="flex flex-col gap-4">
      
      <!-- Top Row: Title & Type Filters -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 class="text-xl font-bold text-gray-900 tracking-tight">Ledger & Payouts</h2>
        <div class="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-2 md:pb-0">
          <button 
            v-for="filter in typeFilters" 
            :key="filter.value"
            @click="typeFilter = filter.value"
            class="px-4 py-2 rounded-full text-xs font-bold transition-colors whitespace-nowrap border"
            :class="typeFilter === filter.value 
              ? 'bg-[#FF5C1A] text-white border-[#FF5C1A] shadow-md shadow-[#FF5C1A]/20' 
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'"
          >
            {{ filter.label }}
          </button>
        </div>
      </div>
      
      <!-- Middle Row: Search, Status, Dates -->
      <div class="flex items-center gap-3 flex-wrap bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
        <div class="relative flex-1 min-w-[250px]">
          <Search class="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search reference or desc..." 
            class="pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#FF5C1A] focus:ring-1 focus:ring-[#FF5C1A] w-full"
            @keyup.enter="handleSearch"
          />
        </div>
        
        <select v-model="statusFilter" @change="applyFilters" class="py-2.5 pl-3 pr-8 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#FF5C1A] appearance-none bg-white font-medium text-gray-700 min-w-[150px]">
          <option value="">All Statuses</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
        
        <DateRangePicker 
          v-model:start="startDate"
          v-model:end="endDate"
          @update:start="applyFilters"
          @update:end="applyFilters"
        />
      </div>

      <!-- Bottom Row: Specific Users -->
      <div class="flex items-center gap-3 flex-wrap bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
        <span class="text-xs font-bold text-gray-400 uppercase tracking-widest pl-2">Filter By User</span>
        <div class="flex-1 min-w-[200px] border border-gray-200 rounded-xl hover:border-[#FF5C1A] transition-colors focus-within:border-[#FF5C1A] focus-within:ring-1 focus-within:ring-[#FF5C1A]">
          <SelectInput 
            v-model="vendorFilter"
            label="Select Vendor"
            :options="vendorOptions"
            class="!mb-0"
            @update:modelValue="onVendorSelect"
          />
        </div>
        <div class="flex-1 min-w-[200px] border border-gray-200 rounded-xl hover:border-[#FF5C1A] transition-colors focus-within:border-[#FF5C1A] focus-within:ring-1 focus-within:ring-[#FF5C1A]">
          <SelectInput 
            v-model="erranderFilter"
            label="Select Errander"
            :options="erranderOptions"
            class="!mb-0"
            @update:modelValue="onErranderSelect"
          />
        </div>
        <div class="flex-1 min-w-[200px] border border-gray-200 rounded-xl hover:border-[#FF5C1A] transition-colors focus-within:border-[#FF5C1A] focus-within:ring-1 focus-within:ring-[#FF5C1A]">
          <SelectInput 
            v-model="studentFilter"
            label="Select Student"
            :options="studentOptions"
            class="!mb-0"
            @update:modelValue="onStudentSelect"
          />
        </div>
      </div>
    </div>

    <!-- Main Table Card -->
    <div class="bg-white rounded-[1.25rem] border border-gray-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-100 bg-gray-50/50">
              <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">Date & Time</th>
              <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">User Details</th>
              <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider">Transaction Info</th>
              <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider text-right">Amount</th>
              <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider text-right">Status</th>
              <th class="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          
          <tbody class="divide-y divide-gray-100" v-if="!loading && transactions.length > 0">
            <tr v-for="txn in transactions" :key="txn._id" class="hover:bg-gray-50/50 transition-colors">
              
              <!-- Date & Time -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex flex-col">
                  <span class="text-xs font-bold text-gray-900">{{ new Date(txn.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) }}</span>
                  <span class="text-[10px] font-medium text-gray-500">{{ new Date(txn.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }}</span>
                </div>
              </td>
              
              <!-- User Details -->
              <td class="px-6 py-4">
                <NuxtLink :to="getUserRoute(txn)" class="flex items-center gap-3 p-2 -m-2 rounded-xl hover:bg-gray-50 transition-colors group cursor-pointer" :class="{'pointer-events-none': getUserRoute(txn) === '#'}">
                  <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600 text-xs shadow-sm border border-gray-200 group-hover:border-[#FF5C1A] group-hover:text-[#FF5C1A] transition-colors">
                    {{ getUserInitials(txn) }}
                  </div>
                  <div class="flex flex-col">
                    <span class="text-sm font-bold text-gray-900 group-hover:text-[#FF5C1A] transition-colors">{{ getUserName(txn) }}</span>
                    <div class="flex items-center gap-2 mt-0.5">
                      <span class="text-[10px] font-medium text-gray-500">{{ getUserEmail(txn) }}</span>
                      <span class="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded" :class="getRoleBadgeClass(txn)">
                        {{ getUserRole(txn) }}
                      </span>
                    </div>
                  </div>
                </NuxtLink>
              </td>
              
              <!-- Transaction Info -->
              <td class="px-6 py-4">
                <div class="flex flex-col">
                  <div class="flex items-center gap-2">
                    <span 
                      class="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded flex items-center gap-1"
                      :class="txn.type === 'credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'"
                    >
                      <ArrowDownLeft v-if="txn.type === 'credit'" class="w-3 h-3" />
                      <ArrowUpRight v-else class="w-3 h-3" />
                      {{ txn.type }}
                    </span>
                    <span class="text-[10px] font-mono font-semibold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                      {{ txn.reference || 'N/A' }}
                    </span>
                  </div>
                  <span class="text-xs font-medium text-gray-600 mt-1 truncate max-w-[250px]" :title="txn.description">{{ txn.description || 'No description' }}</span>
                </div>
              </td>
              
              <!-- Amount -->
              <td class="px-6 py-4 text-right whitespace-nowrap">
                <span 
                  class="text-sm font-black font-mono tracking-tight"
                  :class="txn.type === 'credit' ? 'text-emerald-600' : 'text-gray-900'"
                >
                  {{ txn.type === 'credit' ? '+' : '-' }}₦{{ Number(txn.amount).toLocaleString() }}
                </span>
              </td>
              
              <!-- Status -->
              <td class="px-6 py-4 text-right whitespace-nowrap">
                <span 
                  class="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg"
                  :class="{
                    'bg-emerald-100 text-emerald-700': txn.status === 'completed',
                    'bg-amber-100 text-amber-700': txn.status === 'pending',
                    'bg-rose-100 text-rose-700': txn.status === 'failed',
                    'bg-gray-100 text-gray-700': !['completed', 'pending', 'failed'].includes(txn.status)
                  }"
                >
                  {{ txn.status || 'Unknown' }}
                </span>
              </td>
              
              <!-- Action -->
              <td class="px-6 py-4 text-right whitespace-nowrap">
                <button 
                  @click="openDetails(txn)"
                  class="p-2 text-gray-400 hover:text-[#FF5C1A] hover:bg-orange-50 rounded-lg transition-colors border border-transparent hover:border-orange-100"
                  title="View Details"
                >
                  <Eye class="w-4 h-4" />
                </button>
              </td>
              
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="p-8 space-y-4">
        <div v-for="i in 5" :key="`skeleton-${i}`" class="flex items-center gap-4 animate-pulse">
          <div class="h-10 bg-gray-100 rounded-xl w-1/4"></div>
          <div class="h-10 bg-gray-100 rounded-xl w-1/3"></div>
          <div class="h-10 bg-gray-100 rounded-xl w-1/4"></div>
          <div class="h-10 bg-gray-100 rounded-xl w-1/6"></div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && transactions.length === 0" class="p-16 text-center">
        <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
          <Banknote class="w-8 h-8 text-gray-400" />
        </div>
        <h3 class="text-base font-bold text-gray-900 mb-1">No transactions found</h3>
        <p class="text-sm text-gray-500">Try adjusting your filters or search query.</p>
      </div>

      <!-- Pagination -->
      <div class="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50" v-if="totalPages > 1">
        <span class="text-xs font-semibold text-gray-500">
          Showing <span class="text-gray-900">{{ (currentPage - 1) * 20 + 1 }}</span> to <span class="text-gray-900">{{ Math.min(currentPage * 20, totalTransactions) }}</span> of <span class="text-gray-900">{{ totalTransactions }}</span> entries
        </span>
        <div class="flex items-center gap-2">
          <button 
            @click="prevPage" 
            :disabled="currentPage === 1"
            class="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-white hover:text-gray-900 disabled:opacity-50 disabled:hover:bg-transparent transition-colors shadow-sm bg-white"
          >
            <ChevronLeft class="w-4 h-4" />
          </button>
          <button 
            @click="nextPage" 
            :disabled="currentPage === totalPages"
            class="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-white hover:text-gray-900 disabled:opacity-50 disabled:hover:bg-transparent transition-colors shadow-sm bg-white"
          >
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Details Side Drawer -->
    <SideDrawer :isOpen="isDrawerOpen" @close="isDrawerOpen = false" title="Transaction Details">
      <div v-if="selectedTransaction" class="p-6 space-y-8">
        
        <!-- Header / Status -->
        <div class="flex items-start justify-between">
          <div class="flex flex-col gap-1">
            <span class="text-xs font-bold text-gray-500 uppercase tracking-widest">Transaction Reference</span>
            <span class="text-lg font-mono font-bold text-gray-900">{{ selectedTransaction.reference || 'N/A' }}</span>
          </div>
          <span 
            class="text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg border"
            :class="{
              'bg-emerald-50 text-emerald-700 border-emerald-200': selectedTransaction.status === 'completed',
              'bg-amber-50 text-amber-700 border-amber-200': selectedTransaction.status === 'pending',
              'bg-rose-50 text-rose-700 border-rose-200': selectedTransaction.status === 'failed',
              'bg-gray-50 text-gray-700 border-gray-200': !['completed', 'pending', 'failed'].includes(selectedTransaction.status)
            }"
          >
            {{ selectedTransaction.status || 'Unknown' }}
          </span>
        </div>

        <!-- Financial Summary Card -->
        <div class="bg-gray-50 rounded-2xl p-6 border border-gray-200 relative overflow-hidden">
          <div class="absolute right-0 top-0 w-32 h-32 bg-white/40 rounded-bl-full -mr-16 -mt-16 border-l border-b border-white/60"></div>
          
          <span class="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2 relative z-10">Amount</span>
          <div class="flex items-end gap-3 relative z-10">
            <span 
              class="text-3xl font-black font-mono tracking-tight"
              :class="selectedTransaction.type === 'credit' ? 'text-emerald-600' : 'text-gray-900'"
            >
              {{ selectedTransaction.type === 'credit' ? '+' : '-' }}₦{{ Number(selectedTransaction.amount).toLocaleString() }}
            </span>
            <span 
              class="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md flex items-center gap-1 mb-1.5"
              :class="selectedTransaction.type === 'credit' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'"
            >
              <ArrowDownLeft v-if="selectedTransaction.type === 'credit'" class="w-3 h-3" />
              <ArrowUpRight v-else class="w-3 h-3" />
              {{ selectedTransaction.type }}
            </span>
          </div>
          
          <div class="mt-4 pt-4 border-t border-gray-200/60 relative z-10">
            <span class="text-[11px] font-medium text-gray-500 leading-relaxed block">{{ selectedTransaction.description || 'No description provided.' }}</span>
          </div>
        </div>

        <!-- User Details Section -->
        <div>
          <span class="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-4">Involved User</span>
          <div class="flex items-center gap-4 bg-white border border-gray-100 shadow-sm p-4 rounded-2xl">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center font-bold text-gray-700 text-lg shadow-inner border border-gray-200/60">
              {{ getUserInitials(selectedTransaction) }}
            </div>
            <div class="flex flex-col">
              <span class="text-sm font-bold text-gray-900">{{ getUserName(selectedTransaction) }}</span>
              <span class="text-xs font-medium text-gray-500">{{ getUserEmail(selectedTransaction) }}</span>
            </div>
            <div class="ml-auto">
              <span class="text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-lg" :class="getRoleBadgeClass(selectedTransaction)">
                {{ getUserRole(selectedTransaction) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Bank Details Section (if exists) -->
        <div v-if="selectedTransaction.wallet?.bankDetails">
          <span class="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-4">Payout Account</span>
          <div class="bg-white border border-gray-100 shadow-sm p-4 rounded-2xl flex flex-col gap-2">
            <div class="flex justify-between items-center">
              <span class="text-xs font-semibold text-gray-500">Bank Name</span>
              <span class="text-sm font-bold text-gray-900">{{ selectedTransaction.wallet.bankDetails.bankName }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs font-semibold text-gray-500">Account Number</span>
              <span class="text-sm font-mono font-bold text-gray-900">{{ selectedTransaction.wallet.bankDetails.accountNumber }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs font-semibold text-gray-500">Account Name</span>
              <span class="text-xs font-bold text-gray-900">{{ selectedTransaction.wallet.bankDetails.accountName }}</span>
            </div>
          </div>
        </div>

        <!-- Wallet Context Section -->
        <div v-if="selectedTransaction.wallet">
          <span class="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-4">Wallet Snapshot</span>
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-white border border-gray-100 shadow-sm p-4 rounded-2xl flex flex-col gap-1.5">
              <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Current Balance</span>
              <span class="text-lg font-mono font-black text-gray-900">₦{{ Number(selectedTransaction.wallet.balance || 0).toLocaleString() }}</span>
            </div>
            <div class="bg-white border border-gray-100 shadow-sm p-4 rounded-2xl flex flex-col gap-1.5">
              <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Earned</span>
              <span class="text-lg font-mono font-black text-emerald-600">₦{{ Number(selectedTransaction.wallet.totalEarned || 0).toLocaleString() }}</span>
            </div>
          </div>
        </div>

        <!-- Additional Context (Action Type, Proof) -->
        <div v-if="selectedTransaction.actionType || selectedTransaction.proofOfTransaction">
          <span class="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-4">Additional Info</span>
          <div class="bg-white border border-gray-100 shadow-sm p-4 rounded-2xl flex flex-col gap-4">
            <div class="flex justify-between items-center" v-if="selectedTransaction.actionType">
              <span class="text-xs font-semibold text-gray-500">Action Type</span>
              <span class="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded bg-gray-100 text-gray-700">
                {{ selectedTransaction.actionType }}
              </span>
            </div>
            <div v-if="selectedTransaction.proofOfTransaction" class="flex flex-col gap-2">
              <span class="text-xs font-semibold text-gray-500">Proof of Transaction</span>
              <a :href="selectedTransaction.proofOfTransaction" target="_blank" class="block w-full overflow-hidden rounded-xl border border-gray-200 hover:border-[#FF5C1A] transition-colors relative group">
                <img :src="selectedTransaction.proofOfTransaction" alt="Proof" class="w-full h-32 object-cover object-top" />
                <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span class="text-white text-xs font-bold px-3 py-1.5 bg-black/50 rounded-lg">View Full Image</span>
                </div>
              </a>
            </div>
          </div>
        </div>

        <!-- Meta Information -->
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-white border border-gray-100 shadow-sm p-4 rounded-2xl flex flex-col gap-1.5">
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Transaction Date</span>
            <span class="text-sm font-semibold text-gray-900">{{ new Date(selectedTransaction.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}</span>
          </div>
          <div class="bg-white border border-gray-100 shadow-sm p-4 rounded-2xl flex flex-col gap-1.5">
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Transaction Time</span>
            <span class="text-sm font-semibold text-gray-900">{{ new Date(selectedTransaction.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) }}</span>
          </div>
        </div>

      </div>
    </SideDrawer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { wallets_api } from '@/api_factory/modules/wallets'
import { admin_api } from '@/api_factory/modules/admin'
import { useCustomToast } from '@/composables/core/useCustomToast'
import { 
  Search, ChevronLeft, ChevronRight, Banknote, ArrowDownLeft, ArrowUpRight, Eye 
} from 'lucide-vue-next'
import SideDrawer from '@/components/ui/SideDrawer.vue'
import SelectInput from '@/components/ui/SelectInput.vue'
import DateRangePicker from '@/components/ui/DateRangePicker.vue'

definePageMeta({
  layout: 'admin'
})

useHead({
  title: 'Payouts & Ledger - Errander Admin'
})

const { showToast } = useCustomToast()

const loading = ref(true)
const transactions = ref<any[]>([])
const totalTransactions = ref(0)
const totalPages = ref(1)
const currentPage = ref(1)
const searchQuery = ref('')
const typeFilter = ref('all')
const statusFilter = ref('')
const userRoleFilter = ref('all')
const userIdFilter = ref('all')
const startDate = ref('')
const endDate = ref('')
const isDrawerOpen = ref(false)
const selectedTransaction = ref<any>(null)
const allUsers = ref<any[]>([])

const vendorFilter = ref('')
const erranderFilter = ref('')
const studentFilter = ref('')

const studentOptions = computed(() => {
  return allUsers.value
    .filter(u => !u.role || u.role === 'student')
    .map(u => ({ label: `${u.firstName} ${u.lastName} (${u.email})`, value: u._id }))
})

const vendorOptions = computed(() => {
  return allUsers.value
    .filter(u => u.role === 'vendor')
    .map(u => ({ label: `${u.firstName} ${u.lastName} (${u.email})`, value: u._id }))
})

const erranderOptions = computed(() => {
  return allUsers.value
    .filter(u => u.role === 'errander')
    .map(u => ({ label: `${u.firstName} ${u.lastName} (${u.email})`, value: u._id }))
})

const onVendorSelect = (val: string) => {
  erranderFilter.value = ''
  studentFilter.value = ''
  userIdFilter.value = val || 'all'
  applyFilters()
}

const onErranderSelect = (val: string) => {
  vendorFilter.value = ''
  studentFilter.value = ''
  userIdFilter.value = val || 'all'
  applyFilters()
}

const onStudentSelect = (val: string) => {
  vendorFilter.value = ''
  erranderFilter.value = ''
  userIdFilter.value = val || 'all'
  applyFilters()
}

const typeFilters = [
  { label: 'All Transactions', value: 'all' },
  { label: 'Credits (Funding)', value: 'credit' },
  { label: 'Debits (Payouts)', value: 'debit' },
  { label: 'Payout Requests', value: 'payout_requests' }
]

const fetchTransactions = async () => {
  loading.value = true
  try {
    const query: any = {}
    if (searchQuery.value) query.search = searchQuery.value
    if (typeFilter.value !== 'all') {
      if (typeFilter.value === 'payout_requests') {
        query.category = 'payout_requests'
      } else {
        query.type = typeFilter.value
      }
    }
    if (statusFilter.value) query.status = statusFilter.value
    if (userRoleFilter.value !== 'all') query.userRole = userRoleFilter.value
    if (userIdFilter.value !== 'all') query.userId = userIdFilter.value
    if (startDate.value) query.startDate = startDate.value
    if (endDate.value) query.endDate = endDate.value
    
    const res = await wallets_api.getTransactions(currentPage.value, 20, query)
    transactions.value = res.data.transactions || res.data || []
    totalTransactions.value = res.data.total || 0
    totalPages.value = Math.ceil(totalTransactions.value / 20)
  } catch (e: any) {
    showToast({
      title: "Error",
      message: e.response?.data?.message || "Failed to load ledger entries",
      toastType: "error"
    })
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  currentPage.value = 1
  fetchTransactions()
}

const applyFilters = () => {
  currentPage.value = 1
  fetchTransactions()
}

watch(typeFilter, () => {
  applyFilters()
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    fetchTransactions()
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchTransactions()
  }
}

const openDetails = (txn: any) => {
  selectedTransaction.value = txn
  isDrawerOpen.value = true
}

// Helpers for displaying user data
const getUserDetails = (txn: any) => {
  if (txn.wallet && txn.wallet.owner) {
    return txn.wallet.owner
  }
  return null
}

const getUserName = (txn: any) => {
  const user = getUserDetails(txn)
  if (!user) return 'System / Unknown'
  return `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown User'
}

const getUserEmail = (txn: any) => {
  const user = getUserDetails(txn)
  return user?.email || 'No email'
}

const getUserInitials = (txn: any) => {
  const name = getUserName(txn)
  if (name === 'System / Unknown') return 'S'
  return name.charAt(0).toUpperCase()
}

const getUserRole = (txn: any) => {
  const user = getUserDetails(txn)
  if (!user) return 'System'
  if (user.role === 'vendor') return 'Vendor'
  if (user.role === 'errander') return 'Errander'
  if (user.role === 'admin') return 'Admin'
  return 'Student' // Default user role
}

const getRoleBadgeClass = (txn: any) => {
  const role = getUserRole(txn)
  switch (role) {
    case 'Vendor': return 'bg-amber-100 text-amber-700'
    case 'Errander': return 'bg-indigo-100 text-indigo-700'
    case 'Admin': return 'bg-rose-100 text-rose-700'
    case 'Student': return 'bg-blue-100 text-blue-700'
    default: return 'bg-gray-200 text-gray-700'
  }
}

const getUserRoute = (txn: any) => {
  const user = getUserDetails(txn)
  if (!user || !user._id) return '#'
  
  if (user.role === 'vendor') return `/vendors/${user._id}`
  if (user.role === 'errander') return `/dispatchers/${user._id}`
  if (user.role === 'admin') return '#'
  return `/users/${user._id}`
}

const fetchUsers = async () => {
  try {
    const res = await admin_api.getUsers()
    if (res.data) {
      allUsers.value = res.data
    }
  } catch (err: any) {
    console.error('Error fetching users:', err)
  }
}

onMounted(() => {
  fetchUsers()
  fetchTransactions()
})
</script>
