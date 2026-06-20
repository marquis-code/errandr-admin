<template>
  <div class="space-y-10 animate-fade-in pb-20">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div class="space-y-1">
        <h1 class="text-4xl font-bold text-gray-900 font-display">Referrals</h1>
        <p class="text-sm font-semibold text-gray-500">Manage campus ambassadors and track referral growth</p>
      </div>
      <button @click="showAddModal = true"
        class="flex items-center gap-2 px-6 py-3 bg-[#FF5C1A] text-white rounded-2xl font-bold text-sm hover:bg-[#E54D12] transition-colors shadow-lg shadow-[#FF5C1A]/20">
        <UserPlus class="w-5 h-5" />
        Add Facilitator
      </button>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <template v-if="statsLoading">
        <div v-for="i in 4" :key="`stat-${i}`" class="bg-gray-50 p-7 rounded-3xl border border-gray-100 animate-pulse">
          <div class="w-14 h-14 bg-gray-200 rounded-2xl mb-6"></div>
          <div class="w-24 h-4 bg-gray-200 rounded-md mb-2"></div>
          <div class="w-20 h-8 bg-gray-200 rounded-lg"></div>
        </div>
      </template>
      <template v-else>
        <div v-for="stat in statCards" :key="stat.label"
          class="bg-gray-50 p-7 rounded-3xl border border-gray-100 hover:border-gray-200 transition-colors group">
          <div class="flex items-center justify-between mb-6">
            <div :class="stat.bgClass" class="w-14 h-14 rounded-2xl flex items-center justify-center">
              <component :is="stat.icon" class="w-6 h-6" />
            </div>
          </div>
          <p class="text-sm font-semibold text-gray-500 mb-1">{{ stat.label }}</p>
          <h3 class="text-3xl font-bold text-gray-900 font-display">{{ stat.value }}</h3>
        </div>
      </template>
    </div>

    <!-- Tabs -->
    <div class="flex items-center gap-1 bg-gray-100 p-1.5 rounded-2xl w-fit">
      <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key"
        class="px-6 py-2.5 rounded-xl text-sm font-bold transition-all"
        :class="activeTab === tab.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'">
        {{ tab.label }}
      </button>
    </div>

    <!-- Facilitators Tab -->
    <div v-if="activeTab === 'facilitators'" class="bg-gray-50 rounded-3xl border border-gray-100 overflow-hidden">
      <div class="p-6 border-b border-gray-100 flex items-center justify-between gap-4">
        <div class="flex items-center gap-4 flex-1">
          <div class="relative flex-1 max-w-sm">
            <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input v-model="facilitatorSearch" type="text" placeholder="Search facilitators..."
              class="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#FF5C1A]/30 focus:ring-2 focus:ring-[#FF5C1A]/10" />
          </div>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="facilitatorsLoading" class="p-8 space-y-4">
        <div v-for="i in 4" :key="`fac-load-${i}`" class="flex items-center gap-4 animate-pulse">
          <div class="w-12 h-12 bg-gray-200 rounded-full"></div>
          <div class="flex-1 space-y-2">
            <div class="w-40 h-4 bg-gray-200 rounded-md"></div>
            <div class="w-28 h-3 bg-gray-200 rounded-md"></div>
          </div>
          <div class="w-24 h-8 bg-gray-200 rounded-xl"></div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredFacilitators.length === 0" class="py-20 text-center">
        <div class="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users class="w-8 h-8 text-gray-400" />
        </div>
        <h3 class="text-lg font-bold text-gray-900 mb-1">No Facilitators Found</h3>
        <p class="text-sm font-medium text-gray-500">Add your first campus ambassador to get started.</p>
      </div>

      <!-- Facilitator Cards -->
      <div v-else class="divide-y divide-gray-100">
        <div v-for="fac in filteredFacilitators" :key="fac._id"
          class="flex items-center gap-5 px-6 py-5 hover:bg-white transition-colors group">
          <!-- Avatar -->
          <div class="w-12 h-12 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#FF5C1A] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {{ fac.name?.charAt(0)?.toUpperCase() }}
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <h4 class="text-sm font-bold text-gray-900 truncate">{{ fac.name }}</h4>
              <span :class="tierBadgeClass(fac.tier)" class="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                {{ tierEmoji(fac.tier) }} {{ fac.tier }}
              </span>
              <span v-if="!fac.isActive" class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-red-100 text-red-600 uppercase">Inactive</span>
            </div>
            <p class="text-xs text-gray-500 font-medium truncate">{{ fac.email }}</p>
            <p v-if="fac.skill" class="text-xs text-gray-400 font-medium mt-0.5">{{ fac.skill }}</p>
          </div>

          <!-- Code -->
          <div class="hidden md:flex flex-col items-center gap-1 flex-shrink-0">
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Code</span>
            <span class="text-sm font-bold text-[#FF5C1A] bg-[#FF5C1A]/10 px-3 py-1 rounded-lg font-mono">{{ fac.referralCode }}</span>
          </div>

          <!-- Referral Count -->
          <div class="hidden md:flex flex-col items-center gap-1 flex-shrink-0 min-w-[80px]">
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Referrals</span>
            <span class="text-xl font-bold text-gray-900">{{ fac.totalReferrals || 0 }}</span>
          </div>

          <!-- Points -->
          <div class="hidden lg:flex flex-col items-center gap-1 flex-shrink-0 min-w-[80px]">
            <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Points</span>
            <span class="text-xl font-bold text-gray-900">{{ (fac.pointsEarned || 0).toLocaleString() }}</span>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button @click="resendEmail(fac)" :disabled="resendingEmail === fac._id"
              class="p-2 hover:bg-purple-50 text-gray-400 hover:text-[#7C3AED] rounded-lg transition-colors" title="Resend welcome email">
              <Mail class="w-4 h-4" />
            </button>
            <button v-if="fac.isActive" @click="deactivate(fac)"
              class="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors" title="Deactivate">
              <UserMinus class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Referrals Tab -->
    <div v-if="activeTab === 'referrals'" class="bg-gray-50 rounded-3xl border border-gray-100 overflow-hidden">
      <div class="p-6 border-b border-gray-100">
        <div class="flex items-center gap-3">
          <div class="w-1.5 h-6 bg-[#FF5C1A] rounded-full"></div>
          <h3 class="font-bold text-gray-900 text-lg">All Referrals</h3>
          <span class="text-sm font-bold text-gray-400 ml-auto">{{ referralData?.total || 0 }} total</span>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="referralsLoading" class="p-8 space-y-4">
        <div v-for="i in 5" :key="`ref-load-${i}`" class="flex items-center gap-4 animate-pulse">
          <div class="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div class="flex-1 space-y-2">
            <div class="w-60 h-4 bg-gray-200 rounded-md"></div>
            <div class="w-32 h-3 bg-gray-200 rounded-md"></div>
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div v-else-if="!referralData?.referrals?.length" class="py-20 text-center">
        <div class="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <Gift class="w-8 h-8 text-gray-400" />
        </div>
        <h3 class="text-lg font-bold text-gray-900 mb-1">No Referrals Yet</h3>
        <p class="text-sm font-medium text-gray-500">When users sign up with referral codes, they'll appear here.</p>
      </div>

      <!-- Referral List -->
      <div v-else class="divide-y divide-gray-100">
        <div v-for="ref in referralData.referrals" :key="ref._id"
          class="flex items-center gap-5 px-6 py-4 hover:bg-white transition-colors">
          <!-- Type Badge -->
          <div :class="referrerTypeBadge(ref.referrerType)"
            class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0">
            <span class="text-lg">{{ referrerTypeEmoji(ref.referrerType) }}</span>
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <p class="text-sm text-gray-900 font-medium">
              <span class="font-bold">{{ getReferrerName(ref) }}</span>
              <span class="text-gray-400 mx-1">→</span>
              <span class="font-bold text-[#FF5C1A]">{{ ref.referred?.firstName }} {{ ref.referred?.lastName }}</span>
            </p>
            <div class="flex items-center gap-3 mt-1">
              <span class="text-xs text-gray-400 font-medium">{{ formatDate(ref.createdAt) }}</span>
              <span class="text-xs text-gray-300">•</span>
              <span class="text-xs font-bold font-mono text-gray-500">{{ ref.referralCode }}</span>
              <span class="text-xs text-gray-300">•</span>
              <span class="text-xs font-bold" :class="ref.referredType === 'vendor' ? 'text-emerald-600' : ref.referredType === 'errander' ? 'text-blue-600' : 'text-gray-500'">
                {{ ref.referredType }}
              </span>
            </div>
          </div>

          <!-- Points -->
          <div class="hidden md:flex items-center gap-4 flex-shrink-0">
            <div class="text-right">
              <p class="text-xs text-gray-400 font-bold uppercase">Points Awarded</p>
              <p class="text-sm font-bold text-gray-900">+{{ ref.referrerPointsAwarded + ref.referredPointsAwarded }}</p>
            </div>
            <span :class="statusBadgeClass(ref.status)" class="text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase">
              {{ ref.status }}
            </span>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="referralData?.pages > 1" class="p-4 border-t border-gray-100 flex items-center justify-center gap-2">
        <button v-for="p in referralData.pages" :key="p" @click="referralPage = p; fetchReferrals()"
          class="w-9 h-9 rounded-lg text-sm font-bold transition-colors"
          :class="referralPage === p ? 'bg-[#FF5C1A] text-white' : 'text-gray-500 hover:bg-gray-200'">
          {{ p }}
        </button>
      </div>
    </div>

    <!-- Leaderboard Tab -->
    <div v-if="activeTab === 'leaderboard'" class="bg-gray-50 rounded-3xl border border-gray-100 overflow-hidden">
      <div class="p-6 border-b border-gray-100">
        <div class="flex items-center gap-3">
          <div class="w-1.5 h-6 bg-[#7C3AED] rounded-full"></div>
          <h3 class="font-bold text-gray-900 text-lg">Referral Leaderboard</h3>
          <span class="text-xs font-bold text-gray-400 bg-gray-200 px-2 py-0.5 rounded-md ml-1">TOP 20</span>
        </div>
      </div>

      <div v-if="leaderboardLoading" class="p-8 space-y-4">
        <div v-for="i in 5" :key="`lb-load-${i}`" class="flex items-center gap-4 animate-pulse">
          <div class="w-8 h-8 bg-gray-200 rounded-full"></div>
          <div class="flex-1 space-y-2">
            <div class="w-40 h-4 bg-gray-200 rounded-md"></div>
            <div class="w-28 h-3 bg-gray-200 rounded-md"></div>
          </div>
          <div class="w-16 h-8 bg-gray-200 rounded-xl"></div>
        </div>
      </div>

      <div v-else-if="leaderboard.length === 0" class="py-20 text-center">
        <div class="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy class="w-8 h-8 text-gray-400" />
        </div>
        <h3 class="text-lg font-bold text-gray-900 mb-1">Leaderboard Empty</h3>
        <p class="text-sm font-medium text-gray-500">No referrals yet. The race hasn't started!</p>
      </div>

      <div v-else class="divide-y divide-gray-100">
        <div v-for="(entry, idx) in leaderboard" :key="entry.id"
          class="flex items-center gap-5 px-6 py-4 hover:bg-white transition-colors">
          <!-- Rank -->
          <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-lg"
            :class="idx === 0 ? 'bg-amber-100 text-amber-700' : idx === 1 ? 'bg-gray-200 text-gray-600' : idx === 2 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-500'">
            {{ idx < 3 ? ['🥇', '🥈', '🥉'][idx] : idx + 1 }}
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <h4 class="text-sm font-bold text-gray-900 truncate">{{ entry.name }}</h4>
              <span :class="tierBadgeClass(entry.tier)" class="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                {{ tierEmoji(entry.tier) }} {{ entry.tier }}
              </span>
              <span class="text-[10px] font-bold px-2 py-0.5 rounded-md uppercase"
                :class="entry.type === 'facilitator' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'">
                {{ entry.type }}
              </span>
            </div>
            <p class="text-xs text-gray-400 font-medium mt-0.5">{{ entry.email }}</p>
          </div>

          <!-- Stats -->
          <div class="flex items-center gap-6 flex-shrink-0">
            <div class="text-center">
              <p class="text-xl font-bold text-gray-900">{{ entry.referralCount }}</p>
              <p class="text-[10px] font-bold text-gray-400 uppercase">Referrals</p>
            </div>
            <div class="text-center hidden md:block">
              <p class="text-xl font-bold text-[#FF5C1A]">{{ entry.pointsEarned.toLocaleString() }}</p>
              <p class="text-[10px] font-bold text-gray-400 uppercase">Points</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Facilitator Modal -->
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="showAddModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4" @click.self="showAddModal = false">
        <Transition
          enter-active-class="transition ease-out duration-300"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition ease-in duration-200"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div v-if="showAddModal" class="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 space-y-6">
            <div>
              <h2 class="text-2xl font-bold text-gray-900">Add Facilitator</h2>
              <p class="text-sm text-gray-500 font-medium mt-1">Add a new campus ambassador</p>
            </div>

            <form @submit.prevent="handleAddFacilitator" class="space-y-4">
              <div>
                <label class="text-sm font-bold text-gray-700 block mb-1.5">Full Name *</label>
                <input v-model="newFac.name" type="text" required
                  class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#FF5C1A]/30 focus:ring-2 focus:ring-[#FF5C1A]/10" placeholder="e.g. John Doe" />
              </div>
              <div>
                <label class="text-sm font-bold text-gray-700 block mb-1.5">Email *</label>
                <input v-model="newFac.email" type="email" required
                  class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#FF5C1A]/30 focus:ring-2 focus:ring-[#FF5C1A]/10" placeholder="john@gmail.com" />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="text-sm font-bold text-gray-700 block mb-1.5">Matric No.</label>
                  <input v-model="newFac.matricNumber" type="text"
                    class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#FF5C1A]/30 focus:ring-2 focus:ring-[#FF5C1A]/10" placeholder="Optional" />
                </div>
                <div>
                  <label class="text-sm font-bold text-gray-700 block mb-1.5">Skill</label>
                  <input v-model="newFac.skill" type="text"
                    class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#FF5C1A]/30 focus:ring-2 focus:ring-[#FF5C1A]/10" placeholder="e.g. Graphics Design" />
                </div>
              </div>

              <div class="flex items-center gap-3 p-4 bg-purple-50 border border-purple-100 rounded-2xl">
                <input v-model="newFac.sendWelcomeEmail" type="checkbox" id="send-email"
                  class="w-4 h-4 accent-[#7C3AED]" />
                <label for="send-email" class="text-sm font-bold text-purple-800 cursor-pointer">Send welcome email with referral code</label>
              </div>

              <div v-if="addError" class="p-3 bg-red-50 text-red-600 text-sm font-bold rounded-xl border border-red-100">
                {{ addError }}
              </div>

              <div class="flex gap-3 pt-2">
                <button type="button" @click="showAddModal = false"
                  class="flex-1 py-3.5 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
                <button type="submit" :disabled="addingFac"
                  class="flex-1 py-3.5 bg-[#FF5C1A] text-white rounded-xl font-bold text-sm hover:bg-[#E54D12] transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  <Loader2 v-if="addingFac" class="w-4 h-4 animate-spin" />
                  {{ addingFac ? 'Creating...' : 'Create Facilitator' }}
                </button>
              </div>
            </form>
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { referrals_api } from '@/api_factory/modules/referrals'
import { useCustomToast } from '@/composables/core/useCustomToast'
import {
  Gift, Users, UserPlus, UserMinus, Trophy, Search,
  Mail, TrendingUp, Loader2, Star, Zap
} from 'lucide-vue-next'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Referrals - Errander Admin' })

const { showToast } = useCustomToast()

// ─── State ───────────────────────────────────────────────────────

const activeTab = ref<'facilitators' | 'referrals' | 'leaderboard'>('facilitators')
const statsLoading = ref(true)
const facilitatorsLoading = ref(true)
const referralsLoading = ref(true)
const leaderboardLoading = ref(true)
const stats = ref<any>({})
const facilitators = ref<any[]>([])
const referralData = ref<any>({})
const leaderboard = ref<any[]>([])
const facilitatorSearch = ref('')
const referralPage = ref(1)
const showAddModal = ref(false)
const addingFac = ref(false)
const addError = ref('')
const resendingEmail = ref<string | null>(null)

const newFac = reactive({
  name: '', email: '', matricNumber: '', skill: '', sendWelcomeEmail: true,
})

const tabs = [
  { key: 'facilitators', label: '🧑‍💼 Facilitators' },
  { key: 'referrals', label: '🔗 All Referrals' },
  { key: 'leaderboard', label: '🏆 Leaderboard' },
]

// ─── Computed ────────────────────────────────────────────────────

const statCards = computed(() => [
  { label: 'Total Referrals', value: stats.value.totalReferrals || 0, icon: Gift, bgClass: 'bg-orange-100 text-orange-600' },
  { label: 'Active Facilitators', value: stats.value.activeFacilitators || 0, icon: Users, bgClass: 'bg-purple-100 text-purple-600' },
  { label: 'This Week', value: stats.value.recentReferrals || 0, icon: TrendingUp, bgClass: 'bg-emerald-100 text-emerald-600' },
  { label: 'Points Awarded', value: (stats.value.totalPointsAwarded || 0).toLocaleString(), icon: Star, bgClass: 'bg-amber-100 text-amber-600' },
])

const filteredFacilitators = computed(() => {
  if (!facilitatorSearch.value) return facilitators.value
  const q = facilitatorSearch.value.toLowerCase()
  return facilitators.value.filter((f: any) =>
    f.name?.toLowerCase().includes(q) ||
    f.email?.toLowerCase().includes(q) ||
    f.referralCode?.toLowerCase().includes(q)
  )
})

// ─── Fetchers ────────────────────────────────────────────────────

const fetchStats = async () => {
  statsLoading.value = true
  try {
    const res = await referrals_api.getStats()
    stats.value = res.data || {}
  } catch (e) { console.error('Stats fetch error', e) }
  finally { statsLoading.value = false }
}

const fetchFacilitators = async () => {
  facilitatorsLoading.value = true
  try {
    const res = await referrals_api.getFacilitators()
    facilitators.value = res.data || []
  } catch (e) { console.error('Facilitators fetch error', e) }
  finally { facilitatorsLoading.value = false }
}

const fetchReferrals = async () => {
  referralsLoading.value = true
  try {
    const res = await referrals_api.getAllReferrals({ page: referralPage.value, limit: 30 })
    referralData.value = res.data || {}
  } catch (e) { console.error('Referrals fetch error', e) }
  finally { referralsLoading.value = false }
}

const fetchLeaderboard = async () => {
  leaderboardLoading.value = true
  try {
    const res = await referrals_api.getLeaderboard(20)
    leaderboard.value = res.data || []
  } catch (e) { console.error('Leaderboard fetch error', e) }
  finally { leaderboardLoading.value = false }
}

// ─── Actions ─────────────────────────────────────────────────────

const handleAddFacilitator = async () => {
  addError.value = ''
  addingFac.value = true
  try {
    const res = await referrals_api.createFacilitator(newFac)
    if (res?.type === 'ERROR') throw res
    showToast({ title: 'Success! 🎉', message: `${newFac.name} has been added as a facilitator.`, toastType: 'success', duration: 3000 })
    showAddModal.value = false
    Object.assign(newFac, { name: '', email: '', matricNumber: '', skill: '', sendWelcomeEmail: true })
    fetchFacilitators()
    fetchStats()
  } catch (e: any) {
    addError.value = e?.data?.message || e?.response?.data?.message || 'Failed to create facilitator'
  } finally { addingFac.value = false }
}

const resendEmail = async (fac: any) => {
  resendingEmail.value = fac._id
  try {
    await referrals_api.resendWelcomeEmail(fac._id)
    showToast({ title: 'Email Sent! 📧', message: `Welcome email resent to ${fac.email}`, toastType: 'success', duration: 3000 })
  } catch (e) {
    showToast({ title: 'Error', message: 'Failed to resend email', toastType: 'error', duration: 3000 })
  } finally { resendingEmail.value = null }
}

const deactivate = async (fac: any) => {
  if (!confirm(`Deactivate ${fac.name}? Their referral code will stop working.`)) return
  try {
    await referrals_api.deactivateFacilitator(fac._id)
    showToast({ title: 'Deactivated', message: `${fac.name} has been deactivated.`, toastType: 'success', duration: 3000 })
    fetchFacilitators()
  } catch (e) {
    showToast({ title: 'Error', message: 'Failed to deactivate', toastType: 'error', duration: 3000 })
  }
}

// ─── Helpers ─────────────────────────────────────────────────────

const tierEmoji = (tier: string) => ({ starter: '🌱', hustler: '🔥', ambassador: '💎', legend: '👑' }[tier] || '🌱')

const tierBadgeClass = (tier: string) => ({
  starter: 'bg-gray-100 text-gray-600',
  hustler: 'bg-orange-100 text-orange-700',
  ambassador: 'bg-purple-100 text-purple-700',
  legend: 'bg-amber-100 text-amber-700',
}[tier] || 'bg-gray-100 text-gray-600')

const statusBadgeClass = (status: string) => ({
  pending: 'bg-amber-100 text-amber-700',
  completed: 'bg-emerald-100 text-emerald-700',
  rewarded: 'bg-blue-100 text-blue-700',
}[status] || 'bg-gray-100 text-gray-600')

const referrerTypeBadge = (type: string) => ({
  facilitator: 'bg-purple-100 text-purple-600',
  student: 'bg-blue-100 text-blue-600',
  vendor: 'bg-emerald-100 text-emerald-600',
  errander: 'bg-amber-100 text-amber-600',
}[type] || 'bg-gray-100 text-gray-600')

const referrerTypeEmoji = (type: string) => ({
  facilitator: '🧑‍💼', student: '🎓', vendor: '🏪', errander: '🚲'
}[type] || '👤')

const getReferrerName = (ref: any) => {
  if (ref.facilitatorReferrer) return ref.facilitatorReferrer.name
  if (ref.referrer) return `${ref.referrer.firstName} ${ref.referrer.lastName}`
  return 'Unknown'
}

const formatDate = (date: string) => {
  if (!date) return ''
  const d = new Date(date)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
  if (diffMins < 10080) return `${Math.floor(diffMins / 1440)}d ago`
  return d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ─── Tab watchers ────────────────────────────────────────────────

watch(activeTab, (tab) => {
  if (tab === 'referrals' && !referralData.value?.referrals) fetchReferrals()
  if (tab === 'leaderboard' && leaderboard.value.length === 0) fetchLeaderboard()
})

// ─── Init ────────────────────────────────────────────────────────

onMounted(() => {
  fetchStats()
  fetchFacilitators()
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.font-display {
  font-family: 'Roobert PRO', sans-serif;
}
</style>
