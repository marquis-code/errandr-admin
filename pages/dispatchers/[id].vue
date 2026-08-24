<template>
  <div class="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <div class="mb-8 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <button @click="$router.push('/dispatchers')" class="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors">
          <ArrowLeft class="w-5 h-5" />
        </button>
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Dispatcher Details</h1>
          <p class="text-sm text-gray-500">View and manage dispatcher profile</p>
        </div>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="w-8 h-8 border-4 border-[#FF5C1A] border-t-transparent rounded-full animate-spin"></div>
    </div>

    <div v-else-if="!profile" class="text-center py-20">
      <p class="text-gray-500">Dispatcher not found.</p>
    </div>

    <div v-else class="space-y-6">
      <!-- Profile Header Card -->
      <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-6">
        <div class="w-24 h-24 bg-gray-100 rounded-full overflow-hidden shrink-0 border-4 border-white shadow-md">
          <img v-if="profile.user?.avatar" :src="profile.user?.avatar" class="w-full h-full object-cover">
          <div v-else class="w-full h-full flex items-center justify-center bg-gray-50">
            <User class="w-10 h-10 text-gray-400" />
          </div>
        </div>
        <div class="flex-1">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="font-bold text-2xl text-gray-900">{{ profile.user?.firstName }} {{ profile.user?.lastName }}</h2>
              <p class="text-gray-500 flex items-center gap-2 mt-1">
                <Mail class="w-4 h-4" /> {{ profile.user?.email }}
              </p>
              <p class="text-gray-500 flex items-center gap-2 mt-1">
                <Phone class="w-4 h-4" /> {{ profile.user?.phone || 'N/A' }}
              </p>
            </div>
            <div class="text-right">
              <span v-if="profile.isApproved" class="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FF5C1A]/10 text-[#FF5C1A] text-sm font-bold rounded-lg border border-[#FF5C1A]/20">
                <div class="w-2 h-2 rounded-full bg-[#FF5C1A]/100"></div> Active
              </span>
              <span v-else class="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 text-sm font-bold rounded-lg border border-red-100">
                <div class="w-2 h-2 rounded-full bg-red-500"></div> Suspended
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="flex overflow-x-auto border-b border-gray-100">
          <button @click="activeTab = 'overview'" :class="activeTab === 'overview' ? 'text-[#FF5C1A] border-b-2 border-[#FF5C1A] font-bold' : 'text-gray-500 hover:text-gray-700 font-medium'" class="px-6 py-4 whitespace-nowrap transition-colors">Overview</button>
          <button @click="activeTab = 'operations'" :class="activeTab === 'operations' ? 'text-[#FF5C1A] border-b-2 border-[#FF5C1A] font-bold' : 'text-gray-500 hover:text-gray-700 font-medium'" class="px-6 py-4 whitespace-nowrap transition-colors">Operations & KYC</button>
          <button @click="activeTab = 'errands'" :class="activeTab === 'errands' ? 'text-[#FF5C1A] border-b-2 border-[#FF5C1A] font-bold' : 'text-gray-500 hover:text-gray-700 font-medium'" class="px-6 py-4 whitespace-nowrap transition-colors">Errands History</button>
          <button @click="activeTab = 'active'" :class="activeTab === 'active' ? 'text-[#FF5C1A] border-b-2 border-[#FF5C1A] font-bold' : 'text-gray-500 hover:text-gray-700 font-medium'" class="px-6 py-4 whitespace-nowrap transition-colors flex items-center gap-2">
            Active Orders
            <span v-if="profile.batchOrders?.length" class="bg-[#FF5C1A] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{{ profile.batchOrders.length }}</span>
          </button>
        </div>

        <div class="p-6 bg-gray-50/30">
          
          <!-- OVERVIEW TAB -->
          <div v-if="activeTab === 'overview'" class="space-y-8">
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Identity -->
              <div class="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <User class="w-4 h-4" /> Identity Details
                </h3>
                <div class="space-y-4">
                  <div>
                    <p class="text-xs font-semibold text-gray-400 uppercase">School</p>
                    <p class="font-bold text-gray-900 mt-1">{{ profile.school || 'N/A' }}</p>
                  </div>
                  <div>
                    <p class="text-xs font-semibold text-gray-400 uppercase">Matric Number</p>
                    <p class="font-bold text-gray-900 mt-1">{{ profile.matricNumber || 'N/A' }}</p>
                  </div>
                  <div>
                    <p class="text-xs font-semibold text-gray-400 uppercase">NIN Number</p>
                    <p class="font-bold text-gray-900 mt-1">{{ profile.ninNumber || 'N/A' }}</p>
                  </div>
                </div>
              </div>

              <!-- Financials -->
              <div class="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <h3 class="text-sm font-bold text-[#FF5C1A] uppercase tracking-wider mb-4 flex items-center gap-2">
                  <DollarSign class="w-4 h-4" /> Financials & Banking
                </h3>
                <div class="space-y-4">
                  <div class="grid grid-cols-2 gap-4">
                    <div class="bg-[#FF5C1A]/5 p-3 rounded-lg border border-[#FF5C1A]/10 relative">
                      <p class="text-[10px] font-semibold text-gray-500 uppercase">Wallet Balance</p>
                      <p class="text-xl font-black text-[#FF5C1A] mt-1">₦{{ Number(profile.user?.walletBalance || 0).toLocaleString() }}</p>
                      <button @click="showManualDebitModal = true" class="absolute top-3 right-3 text-[10px] bg-white border border-gray-200 px-2 py-1 rounded text-gray-600 hover:text-[#FF5C1A] font-bold">
                        Deduct
                      </button>
                    </div>
                    <div class="bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <p class="text-[10px] font-semibold text-gray-500 uppercase">Total Earnings</p>
                      <p class="text-xl font-black text-gray-900 mt-1">₦{{ Number(profile.totalEarnings || 0).toLocaleString() }}</p>
                    </div>
                  </div>
                  <div v-if="profile.bankName || profile.accountNumber" class="bg-gray-50 rounded-lg p-4 border border-gray-100 mt-4">
                    <p class="text-xs font-semibold text-gray-400 uppercase mb-2">Bank Details</p>
                    <p class="font-bold text-gray-900">{{ profile.bankName || 'N/A' }}</p>
                    <p class="text-sm text-gray-600 font-mono mt-1">{{ profile.accountNumber || 'N/A' }} - {{ profile.accountName || 'N/A' }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Performance -->
              <div class="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <h3 class="text-sm font-bold text-purple-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Star class="w-4 h-4" /> Performance Metrics
                </h3>
                <div class="grid grid-cols-2 gap-y-6 gap-x-4">
                  <div>
                    <p class="text-xs font-semibold text-gray-400 uppercase">Deliveries</p>
                    <p class="text-2xl font-black text-gray-900 mt-1">{{ profile.totalDeliveries || 0 }}</p>
                  </div>
                  <div>
                    <p class="text-xs font-semibold text-gray-400 uppercase">Rating</p>
                    <div class="flex items-center gap-2 mt-1">
                      <p class="text-2xl font-black text-gray-900">{{ (profile.rating || 0).toFixed(1) }}</p>
                      <Star class="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <span class="text-sm text-gray-400">({{ profile.totalRatings || 0 }})</span>
                    </div>
                  </div>
                  <div>
                    <p class="text-xs font-semibold text-gray-400 uppercase">Reward Points</p>
                    <p class="text-lg font-bold text-gray-900 mt-1">{{ profile.user?.points || 0 }} pts</p>
                  </div>
                  <div>
                    <p class="text-xs font-semibold text-gray-400 uppercase">Activity Streak</p>
                    <p class="text-lg font-bold text-gray-900 mt-1">{{ profile.user?.streakCount || 0 }} 🔥</p>
                  </div>
                </div>
              </div>

              <!-- Guarantor -->
              <div v-if="profile.guarantorDetails" class="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <h3 class="text-sm font-bold text-blue-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Shield class="w-4 h-4" /> Guarantor Information
                </h3>
                <div class="space-y-4">
                  <div>
                    <p class="text-xs font-semibold text-gray-400 uppercase">Guarantor Name</p>
                    <p class="font-bold text-gray-900 mt-1">{{ profile.guarantorDetails.name || 'N/A' }}</p>
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <p class="text-xs font-semibold text-gray-400 uppercase">Phone</p>
                      <p class="font-bold text-gray-900 mt-1">{{ profile.guarantorDetails.phone || 'N/A' }}</p>
                    </div>
                    <div>
                      <p class="text-xs font-semibold text-gray-400 uppercase">Relationship</p>
                      <p class="font-bold text-gray-900 mt-1">{{ profile.guarantorDetails.relationship || 'N/A' }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- OPERATIONS & KYC TAB -->
          <div v-else-if="activeTab === 'operations'" class="space-y-8">
            <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 class="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-6 flex items-center gap-2">
                <CheckCircle class="w-4 h-4" /> Operations & Status
              </h3>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p class="text-xs font-semibold text-gray-500 uppercase mb-2">Device Status</p>
                  <div class="flex items-center gap-2">
                    <div class="w-3 h-3 rounded-full" :class="profile.status === 'online' ? 'bg-green-500' : 'bg-gray-400'"></div>
                    <p class="text-lg font-bold text-gray-900 capitalize">{{ profile.status || 'Offline' }}</p>
                  </div>
                </div>
                
                <div class="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <p class="text-xs font-semibold text-gray-500 uppercase mb-2">Verification Tier</p>
                  <span class="inline-flex items-center font-bold text-[#FF5C1A] bg-[#FF5C1A]/10 px-3 py-1 rounded-lg text-sm uppercase tracking-wider border border-[#FF5C1A]/20">
                    Tier {{ profile.verificationLevel || 1 }}
                  </span>
                </div>

                <div v-if="profile.rejectionReason" class="bg-red-50 p-4 rounded-xl border border-red-100 md:col-span-3">
                  <p class="text-xs font-bold text-red-700 uppercase mb-2">Rejection Reason</p>
                  <p class="text-sm text-red-600">{{ profile.rejectionReason }}</p>
                </div>
              </div>
            </div>

            <!-- Documents -->
            <div v-if="profile.idCardImage || profile.selfieImage || profile.ninSlipImage" class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 class="text-sm font-bold text-gray-800 uppercase tracking-wider mb-6 flex items-center gap-2">
                <FileText class="w-4 h-4" /> KYC Documents
              </h3>
              
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div v-if="profile.idCardImage" class="space-y-2">
                  <p class="text-xs font-bold text-gray-500 uppercase">ID Card</p>
                  <div class="relative aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200 cursor-pointer group" @click="viewImage(profile.idCardImage)">
                    <img :src="profile.idCardImage" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Search class="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
                
                <div v-if="profile.selfieImage" class="space-y-2">
                  <p class="text-xs font-bold text-gray-500 uppercase">Selfie</p>
                  <div class="relative aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200 cursor-pointer group" @click="viewImage(profile.selfieImage)">
                    <img :src="profile.selfieImage" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Search class="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>

                <div v-if="profile.ninSlipImage" class="space-y-2">
                  <p class="text-xs font-bold text-gray-500 uppercase">NIN Slip</p>
                  <div class="relative aspect-video rounded-xl overflow-hidden bg-gray-100 border border-gray-200 cursor-pointer group" @click="viewImage(profile.ninSlipImage)">
                    <img :src="profile.ninSlipImage" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Search class="w-8 h-8 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ERRANDS HISTORY TAB -->
          <div v-else-if="activeTab === 'errands'" class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 class="text-sm font-bold text-gray-800 uppercase tracking-wider mb-6 flex items-center gap-2">
              <Receipt class="w-4 h-4" /> Historical Errands
            </h3>
            <TransactionsList v-if="profile.user?._id" :errander-id="profile.user._id" />
          </div>

          <!-- ACTIVE ORDERS TAB -->
          <div v-else-if="activeTab === 'active'" class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 class="text-sm font-bold text-[#FF5C1A] uppercase tracking-wider mb-6 flex items-center gap-2">
              <Clock class="w-4 h-4" /> Active Batch Orders
            </h3>
            
            <div v-if="!profile.batchOrders?.length" class="text-center py-16">
              <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText class="w-6 h-6 text-gray-400" />
              </div>
              <p class="text-base font-bold text-gray-900">No active orders</p>
              <p class="text-sm text-gray-500 mt-1">This dispatcher hasn't been assigned any active errands currently.</p>
            </div>
            
            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="order in profile.batchOrders" :key="order._id || order" class="bg-gray-50 p-5 rounded-xl border border-gray-200 hover:border-[#FF5C1A]/40 transition-colors shadow-sm">
                <div class="flex items-center justify-between mb-3">
                  <span class="font-mono text-sm font-bold text-gray-900">#{{ typeof order === 'string' ? order.slice(-6).toUpperCase() : (order._id?.slice(-6).toUpperCase() || 'UNKNOWN') }}</span>
                  <span class="text-[10px] font-bold text-[#FF5C1A] bg-[#FF5C1A]/10 px-2 py-1 rounded-md uppercase tracking-wide">Batched Order</span>
                </div>
                <div class="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin class="w-4 h-4 text-gray-400" /> Assigned Errand
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Image Modal -->
    <div v-if="selectedImage" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" @click="selectedImage = null">
      <img :src="selectedImage" class="max-w-full max-h-full rounded-xl" @click.stop>
      <button class="absolute top-6 right-6 text-white w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20" @click="selectedImage = null">
        <X class="w-5 h-5" />
      </button>
    </div>

    <!-- Manual Debit Modal -->
    <div v-if="showManualDebitModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div class="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
        <div class="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 class="text-lg font-bold text-gray-900">Manual Payout / Deduct</h3>
          <button @click="showManualDebitModal = false" class="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="p-6 space-y-4">
          <p class="text-sm text-gray-600">Use this to manually deduct funds if you've paid out the errander directly outside of the system.</p>
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Amount (₦)</label>
            <input v-model="debitAmount" type="number" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20 focus:border-[#FF5C1A]" placeholder="e.g. 5000">
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Reason (Optional)</label>
            <input v-model="debitReason" type="text" class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20 focus:border-[#FF5C1A]" placeholder="e.g. Manual payout">
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Proof of Withdrawal (Optional)</label>
            <input type="file" @change="handleFileUpload" accept="image/*" class="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#FF5C1A]/10 file:text-[#FF5C1A] hover:file:bg-[#FF5C1A]/20 cursor-pointer">
          </div>
        </div>
        <div class="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button @click="showManualDebitModal = false" class="px-4 py-2 font-bold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors">
            Cancel
          </button>
          <button @click="submitManualDebit" :disabled="!debitAmount || debitAmount <= 0 || isSubmittingDebit" class="px-4 py-2 font-bold text-white bg-[#FF5C1A] hover:bg-[#E04D12] rounded-lg transition-colors disabled:opacity-50">
            {{ isSubmittingDebit ? 'Processing...' : 'Deduct Funds' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { GATEWAY_ENDPOINT_WITH_AUTH } from '@/api_factory/axios.config'
import { ArrowLeft, User, Mail, Phone, DollarSign, Star, Shield, CheckCircle, FileText, Search, Receipt, Clock, MapPin, X } from 'lucide-vue-next'
import TransactionsList from '@/components/TransactionsList.vue'

const route = useRoute()
const router = useRouter()
const coreUi = useCoreUi()
const profile = ref<any>(null)
const loading = ref(true)
const activeTab = ref('overview')
const selectedImage = ref<string | null>(null)

const showManualDebitModal = ref(false)
const debitAmount = ref<number | null>(null)
const debitReason = ref('')
const isSubmittingDebit = ref(false)

const viewImage = (url: string) => {
  selectedImage.value = url
}

const fetchProfile = async () => {
  loading.value = true
  try {
    const res = await GATEWAY_ENDPOINT_WITH_AUTH.get(`/admin/dispatchers/${route.params.id}`)
    profile.value = res.data?.data || res.data || null
  } catch (error) {
    console.error('Failed to fetch dispatcher profile', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (route.params.id) {
    fetchProfile()
  }
})

const proofFile = ref<File | null>(null)
const handleFileUpload = (e: any) => {
  if (e.target.files && e.target.files[0]) {
    proofFile.value = e.target.files[0]
  }
}

const submitManualDebit = async () => {
  if (!debitAmount.value || debitAmount.value <= 0 || !profile.value?.user?._id) return;
  
  isSubmittingDebit.value = true;
  try {
    let proofUrl = ''
    if (proofFile.value) {
      const formData = new FormData()
      formData.append('file', proofFile.value)
      const uploadRes = await GATEWAY_ENDPOINT_WITH_AUTH.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      proofUrl = uploadRes.data?.url || uploadRes.data?.data?.url || ''
    }

    await GATEWAY_ENDPOINT_WITH_AUTH.post(`/wallets/admin/debit/${profile.value.user._id}`, {
      amount: debitAmount.value,
      description: debitReason.value || 'Manual Payout / Adjustment',
      proofOfTransaction: proofUrl
    });
    coreUi.showToast('Wallet debited successfully!', 'success');
    showManualDebitModal.value = false;
    debitAmount.value = null;
    debitReason.value = '';
    proofFile.value = null;
    fetchProfile(); 
  } catch (err) {
    console.error('Error debiting wallet', err);
    coreUi.showToast('Failed to debit wallet.', 'error');
  } finally {
    isSubmittingDebit.value = false;
  }
}

</script>
