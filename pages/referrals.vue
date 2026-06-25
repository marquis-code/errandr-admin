<template>
  <div class="space-y-6 animate-fade-in pb-20">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="space-y-1">
        <h1 class="text-2xl font-semibold text-gray-900 font-heading tracking-tight">Facilitators Management</h1>
        <p class="text-xs text-gray-500">Manage campus ambassadors and track referral growth</p>
      </div>
      <button @click="showAddModal = true"
        class="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg font-medium text-xs hover:bg-gray-800 transition-colors">
        <UserPlus class="w-4 h-4" />
        Add Facilitator
      </button>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <template v-if="statsLoading">
        <div v-for="i in 4" :key="`stat-${i}`" class="bg-white p-5 rounded-xl border border-gray-200 animate-pulse">
          <div class="w-10 h-10 bg-gray-100 rounded-lg mb-4"></div>
          <div class="w-20 h-3 bg-gray-100 rounded mb-2"></div>
          <div class="w-16 h-6 bg-gray-100 rounded"></div>
        </div>
      </template>
      <template v-else>
        <div v-for="stat in statCards" :key="stat.label"
          class="bg-white p-5 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors group">
          <div class="flex items-center justify-between mb-4">
            <div :class="stat.bgClass" class="w-10 h-10 rounded-lg flex items-center justify-center">
              <component :is="stat.icon" class="w-5 h-5" />
            </div>
          </div>
          <p class="text-xs font-medium text-gray-500 mb-1">{{ stat.label }}</p>
          <h3 class="text-2xl font-semibold text-gray-900 font-heading">{{ stat.value }}</h3>
        </div>
      </template>
    </div>

    <!-- Tabs -->
    <div class="flex items-center gap-1 bg-gray-50 p-1 rounded-lg w-fit border border-gray-200">
      <button v-for="tab in tabs" :key="tab.key" @click="activeTab = tab.key"
        class="px-4 py-1.5 rounded-md text-xs font-medium transition-all"
        :class="activeTab === tab.key ? 'bg-white text-gray-900 shadow-sm border border-gray-200/50' : 'text-gray-500 hover:text-gray-700'">
        {{ tab.label }}
      </button>
    </div>

    <!-- Facilitators Tab -->
    <div v-if="activeTab === 'facilitators'" class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div class="p-4 border-b border-gray-200 flex items-center justify-between gap-4">
        <div class="relative flex-1 max-w-sm">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input v-model="facilitatorSearch" type="text" placeholder="Search facilitators..."
            class="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium focus:outline-none focus:border-gray-300 focus:bg-white transition-colors" />
        </div>
      </div>

      <!-- Loading -->
      <div v-if="facilitatorsLoading" class="p-6 space-y-4">
        <div v-for="i in 4" :key="`fac-load-${i}`" class="flex items-center gap-4 animate-pulse">
          <div class="w-10 h-10 bg-gray-100 rounded-full"></div>
          <div class="flex-1 space-y-2">
            <div class="w-32 h-3 bg-gray-100 rounded"></div>
            <div class="w-20 h-2 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredFacilitators.length === 0" class="py-16 text-center">
        <div class="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-gray-100">
          <Users class="w-5 h-5 text-gray-400" />
        </div>
        <h3 class="text-sm font-semibold text-gray-900 mb-1">No Facilitators Found</h3>
        <p class="text-xs text-gray-500">Add your first campus ambassador to get started.</p>
      </div>

      <!-- Facilitator Cards -->
      <div v-else class="divide-y divide-gray-100">
        <div v-for="fac in filteredFacilitators" :key="fac._id"
          class="flex items-center gap-4 px-5 py-3 hover:bg-gray-50/50 transition-colors group">
          <!-- Avatar -->
          <div class="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
            {{ fac.name?.charAt(0)?.toUpperCase() }}
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-0.5">
              <h4 class="text-sm font-semibold text-gray-900 truncate">{{ fac.name }}</h4>
              <span :class="tierBadgeClass(fac.tier)" class="text-[10px] font-medium px-1.5 py-0.5 rounded border uppercase">
                {{ tierEmoji(fac.tier) }} {{ fac.tier }}
              </span>
              <span v-if="!fac.isActive" class="text-[10px] font-medium px-1.5 py-0.5 rounded bg-red-50 text-red-600 border border-red-100 uppercase">Inactive</span>
            </div>
            <p class="text-xs text-gray-500 truncate">{{ fac.email }}</p>
            <p v-if="fac.skill" class="text-[10px] text-gray-400 mt-0.5">{{ fac.skill }}</p>
          </div>

          <!-- Code -->
          <div class="hidden md:flex flex-col items-center gap-0.5 flex-shrink-0 w-24">
            <span class="text-[9px] font-medium text-gray-400 uppercase tracking-wide">Code</span>
            <span class="text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded border border-gray-200 font-mono">{{ fac.referralCode }}</span>
          </div>

          <!-- Referral Count -->
          <div class="hidden md:flex flex-col items-center gap-0.5 flex-shrink-0 min-w-[60px]">
            <span class="text-[9px] font-medium text-gray-400 uppercase tracking-wide">Referrals</span>
            <span class="text-sm font-semibold text-gray-900">{{ fac.totalReferrals || 0 }}</span>
          </div>

          <!-- Points -->
          <div class="hidden lg:flex flex-col items-center gap-0.5 flex-shrink-0 min-w-[60px]">
            <span class="text-[9px] font-medium text-gray-400 uppercase tracking-wide">Points</span>
            <span class="text-sm font-semibold text-gray-900">{{ (fac.pointsEarned || 0).toLocaleString() }}</span>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button @click="resendEmail(fac)" :disabled="resendingEmail === fac._id"
              class="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors" title="Resend welcome email">
              <Mail class="w-4 h-4" />
            </button>
            <button v-if="fac.isActive" @click="requestDeactivate(fac)"
              class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Deactivate">
              <UserMinus class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Referrals Tab -->
    <div v-if="activeTab === 'referrals'" class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div class="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 class="font-semibold text-gray-900 text-sm">All Referrals</h3>
        <span class="text-xs font-medium text-gray-500">{{ referralData?.total || 0 }} total</span>
      </div>

      <!-- Loading -->
      <div v-if="referralsLoading" class="p-6 space-y-4">
        <div v-for="i in 5" :key="`ref-load-${i}`" class="flex items-center gap-4 animate-pulse">
          <div class="w-8 h-8 bg-gray-100 rounded-lg"></div>
          <div class="flex-1 space-y-2">
            <div class="w-40 h-3 bg-gray-100 rounded"></div>
            <div class="w-24 h-2 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div v-else-if="!referralData?.referrals?.length" class="py-16 text-center">
        <div class="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-gray-100">
          <Gift class="w-5 h-5 text-gray-400" />
        </div>
        <h3 class="text-sm font-semibold text-gray-900 mb-1">No Referrals Yet</h3>
        <p class="text-xs text-gray-500">When users sign up with referral codes, they'll appear here.</p>
      </div>

      <!-- Referral List -->
      <div v-else class="divide-y divide-gray-100">
        <div v-for="ref in referralData.referrals" :key="ref._id"
          class="flex items-center gap-4 px-5 py-3 hover:bg-gray-50/50 transition-colors cursor-pointer"
          @click="viewReferralDetails(ref)">
          <!-- Type Badge -->
          <div :class="referrerTypeBadge(ref.referrerType)"
            class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border">
            <span class="text-sm">{{ referrerTypeEmoji(ref.referrerType) }}</span>
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <p class="text-xs text-gray-900">
              <span class="font-semibold">{{ getReferrerName(ref) }}</span>
              <span class="text-gray-400 mx-1.5">→</span>
              <span class="font-semibold text-gray-700">{{ ref.referred?.firstName }} {{ ref.referred?.lastName }}</span>
            </p>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-[10px] text-gray-400">{{ formatDate(ref.createdAt) }}</span>
              <span class="text-[10px] text-gray-300">•</span>
              <span class="text-[10px] font-medium font-mono text-gray-500">{{ ref.referralCode }}</span>
              <span class="text-[10px] text-gray-300">•</span>
              <span class="text-[10px] font-medium" :class="ref.referredType === 'vendor' ? 'text-emerald-600' : ref.referredType === 'errander' ? 'text-blue-600' : 'text-gray-500'">
                {{ ref.referredType }}
              </span>
            </div>
          </div>

          <!-- Points -->
          <div class="hidden md:flex items-center gap-4 flex-shrink-0">
            <div class="text-right">
              <p class="text-[9px] text-gray-400 font-medium uppercase tracking-wide">Awarded</p>
              <p class="text-xs font-semibold text-gray-900">+{{ ref.referrerPointsAwarded + ref.referredPointsAwarded }} pts</p>
            </div>
            <span :class="statusBadgeClass(ref.status)" class="text-[10px] font-medium px-2 py-0.5 rounded border uppercase">
              {{ ref.status }}
            </span>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="referralData?.pages > 1" class="p-3 border-t border-gray-200 flex items-center justify-center gap-1">
        <button v-for="p in referralData.pages" :key="p" @click="referralPage = p; fetchReferrals()"
          class="w-7 h-7 rounded text-xs font-medium transition-colors"
          :class="referralPage === p ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-100'">
          {{ p }}
        </button>
      </div>
    </div>

    <!-- Leaderboard Tab -->
    <div v-if="activeTab === 'leaderboard'" class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div class="p-4 border-b border-gray-200 flex items-center gap-2">
        <h3 class="font-semibold text-gray-900 text-sm">Leaderboard</h3>
        <span class="text-[10px] font-medium text-gray-500 bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded">TOP 20</span>
      </div>

      <div v-if="leaderboardLoading" class="p-6 space-y-4">
        <div v-for="i in 5" :key="`lb-load-${i}`" class="flex items-center gap-4 animate-pulse">
          <div class="w-6 h-6 bg-gray-100 rounded-full"></div>
          <div class="flex-1 space-y-2">
            <div class="w-32 h-3 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>

      <div v-else-if="leaderboard.length === 0" class="py-16 text-center">
        <div class="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 border border-gray-100">
          <Trophy class="w-5 h-5 text-gray-400" />
        </div>
        <h3 class="text-sm font-semibold text-gray-900 mb-1">Leaderboard Empty</h3>
        <p class="text-xs text-gray-500">No referrals yet.</p>
      </div>

      <div v-else class="divide-y divide-gray-100">
        <div v-for="(entry, idx) in leaderboard" :key="entry.id"
          class="flex items-center gap-4 px-5 py-3 hover:bg-gray-50/50 transition-colors">
          <!-- Rank -->
          <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-xs border"
            :class="idx === 0 ? 'bg-amber-50 text-amber-700 border-amber-200' : idx === 1 ? 'bg-gray-50 text-gray-600 border-gray-200' : idx === 2 ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-white text-gray-500 border-gray-100'">
            {{ idx < 3 ? ['🥇', '🥈', '🥉'][idx] : idx + 1 }}
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <h4 class="text-sm font-semibold text-gray-900 truncate">{{ entry.name }}</h4>
              <span :class="tierBadgeClass(entry.tier)" class="text-[9px] font-medium px-1.5 py-0.5 rounded border uppercase">
                {{ tierEmoji(entry.tier) }} {{ entry.tier }}
              </span>
              <span class="text-[9px] font-medium px-1.5 py-0.5 rounded border uppercase"
                :class="entry.type === 'facilitator' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-blue-50 text-blue-600 border-blue-100'">
                {{ entry.type }}
              </span>
            </div>
            <p class="text-[10px] text-gray-500 mt-0.5">{{ entry.email }}</p>
          </div>

          <!-- Stats -->
          <div class="flex items-center gap-5 flex-shrink-0">
            <div class="text-center">
              <p class="text-sm font-semibold text-gray-900">{{ entry.referralCount }}</p>
              <p class="text-[9px] font-medium text-gray-400 uppercase tracking-wide">Refs</p>
            </div>
            <div class="text-center hidden md:block">
              <p class="text-sm font-semibold text-gray-700">{{ entry.pointsEarned.toLocaleString() }}</p>
              <p class="text-[9px] font-medium text-gray-400 uppercase tracking-wide">Points</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <Teleport to="body">
      <!-- Add Facilitator Modal -->
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showAddModal" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/30 backdrop-blur-sm px-4" @click.self="showAddModal = false">
          <div class="bg-white rounded-xl shadow-lg border border-gray-100 max-w-sm w-full p-6 space-y-5">
            <div>
              <h2 class="text-lg font-semibold text-gray-900">Add Facilitator</h2>
              <p class="text-xs text-gray-500 mt-0.5">Register a new campus ambassador.</p>
            </div>

            <form @submit.prevent="handleAddFacilitator" class="space-y-4">
              <div>
                <label class="text-xs font-medium text-gray-700 block mb-1">Full Name *</label>
                <input v-model="newFac.name" type="text" required
                  class="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-xs focus:outline-none focus:border-gray-400 transition-colors" placeholder="e.g. John Doe" />
              </div>
              <div>
                <label class="text-xs font-medium text-gray-700 block mb-1">Email *</label>
                <input v-model="newFac.email" type="email" required
                  class="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-xs focus:outline-none focus:border-gray-400 transition-colors" placeholder="john@example.com" />
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-xs font-medium text-gray-700 block mb-1">Matric No.</label>
                  <input v-model="newFac.matricNumber" type="text"
                    class="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-xs focus:outline-none focus:border-gray-400 transition-colors" placeholder="Optional" />
                </div>
                <div>
                  <label class="text-xs font-medium text-gray-700 block mb-1">Skill</label>
                  <input v-model="newFac.skill" type="text"
                    class="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-xs focus:outline-none focus:border-gray-400 transition-colors" placeholder="e.g. Design" />
                </div>
              </div>

              <div class="flex items-center gap-2 mt-2">
                <input v-model="newFac.sendWelcomeEmail" type="checkbox" id="send-email"
                  class="w-3.5 h-3.5 accent-gray-900 rounded border-gray-300" />
                <label for="send-email" class="text-xs font-medium text-gray-700 cursor-pointer">Send welcome email & referral code</label>
              </div>

              <div v-if="addError" class="p-2 bg-red-50 text-red-600 text-xs rounded border border-red-100">
                {{ addError }}
              </div>

              <div class="flex gap-2 pt-2">
                <button type="button" @click="showAddModal = false"
                  class="flex-1 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium text-xs hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" :disabled="addingFac"
                  class="flex-1 py-2 bg-gray-900 text-white rounded-lg font-medium text-xs hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  <Loader2 v-if="addingFac" class="w-3 h-3 animate-spin" />
                  {{ addingFac ? 'Creating...' : 'Create' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition>

      <!-- Deactivate Confirmation Modal -->
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showDeactivateModal" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/30 backdrop-blur-sm px-4" @click.self="showDeactivateModal = false">
          <div class="bg-white rounded-xl shadow-lg border border-gray-100 max-w-sm w-full p-6 text-center space-y-4">
            <div class="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto border border-red-100">
              <UserMinus class="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Deactivate Facilitator</h3>
              <p class="text-xs text-gray-500 mt-1">
                Are you sure you want to deactivate <span class="font-semibold text-gray-900">{{ facToDeactivate?.name }}</span>? Their referral code will stop working immediately.
              </p>
            </div>
            <div class="flex gap-2 pt-2">
              <button @click="showDeactivateModal = false"
                class="flex-1 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg font-medium text-xs hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button @click="confirmDeactivate"
                class="flex-1 py-2 bg-red-600 text-white rounded-lg font-medium text-xs hover:bg-red-700 transition-colors">
                Yes, Deactivate
              </button>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Referral Details Modal -->
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showDetailsModal" class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/30 backdrop-blur-sm px-4" @click.self="showDetailsModal = false">
          <div class="bg-white rounded-xl shadow-lg border border-gray-100 max-w-md w-full overflow-hidden">
            <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 class="font-semibold text-gray-900 text-sm">Referral Details</h3>
              <button @click="showDetailsModal = false" class="p-1 hover:bg-gray-100 rounded text-gray-500">
                <X class="w-4 h-4" />
              </button>
            </div>
            <div class="p-5 space-y-4" v-if="selectedReferral">
              
              <!-- Referrer Info -->
              <div class="bg-gray-50 p-3 rounded-lg border border-gray-100">
                <p class="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-1">Referred By</p>
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">
                    {{ getReferrerName(selectedReferral).charAt(0) }}
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-gray-900">{{ getReferrerName(selectedReferral) }}</p>
                    <p class="text-[10px] text-gray-500 font-mono">{{ selectedReferral.referralCode }}</p>
                  </div>
                </div>
              </div>

              <!-- Arrow -->
              <div class="flex justify-center -my-1 relative z-10">
                <div class="bg-white border border-gray-100 rounded-full p-1">
                  <ArrowDown class="w-3 h-3 text-gray-400" />
                </div>
              </div>

              <!-- Referred Info -->
              <div class="bg-white border border-gray-200 p-3 rounded-lg shadow-sm">
                <p class="text-[10px] font-medium text-gray-400 uppercase tracking-wide mb-1">New User Signed Up</p>
                <div class="flex justify-between items-start">
                  <div>
                    <p class="text-sm font-semibold text-gray-900">{{ selectedReferral.referred?.firstName }} {{ selectedReferral.referred?.lastName }}</p>
                    <p class="text-xs text-gray-500">{{ selectedReferral.referred?.email }}</p>
                  </div>
                  <span class="text-[10px] font-medium px-1.5 py-0.5 rounded border capitalize"
                    :class="selectedReferral.referredType === 'vendor' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'">
                    {{ selectedReferral.referredType }}
                  </span>
                </div>
              </div>

              <!-- Stats / Rewards -->
              <div class="grid grid-cols-2 gap-3 pt-2">
                <div class="border border-gray-100 rounded-lg p-3 text-center">
                  <p class="text-[10px] font-medium text-gray-400 uppercase tracking-wide">Status</p>
                  <p class="text-xs font-semibold capitalize mt-1" :class="{'text-emerald-600': selectedReferral.status === 'completed', 'text-amber-600': selectedReferral.status === 'pending'}">{{ selectedReferral.status }}</p>
                </div>
                <div class="border border-gray-100 rounded-lg p-3 text-center">
                  <p class="text-[10px] font-medium text-gray-400 uppercase tracking-wide">Points Earned</p>
                  <p class="text-xs font-semibold text-gray-900 mt-1">{{ selectedReferral.referrerPointsAwarded }}</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { referrals_api } from '@/api_factory/modules/referrals'
import { useCustomToast } from '@/composables/core/useCustomToast'
import {
  Gift, Users, UserPlus, UserMinus, Trophy, Search,
  Mail, TrendingUp, Loader2, Star, X, ArrowDown
} from 'lucide-vue-next'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Facilitators Management - Errander Admin' })

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

// Deactivate Modal state
const showDeactivateModal = ref(false)
const facToDeactivate = ref<any>(null)

// Details Modal state
const showDetailsModal = ref(false)
const selectedReferral = ref<any>(null)

const newFac = reactive({
  name: '', email: '', matricNumber: '', skill: '', sendWelcomeEmail: true,
})

const tabs = [
  { key: 'facilitators', label: 'Facilitators' },
  { key: 'referrals', label: 'All Referrals' },
  { key: 'leaderboard', label: 'Leaderboard' },
]

// ─── Computed ────────────────────────────────────────────────────

const statCards = computed(() => [
  { label: 'Total Referrals', value: stats.value.totalReferrals || 0, icon: Gift, bgClass: 'bg-gray-50 text-gray-600 border border-gray-100' },
  { label: 'Active Facilitators', value: stats.value.activeFacilitators || 0, icon: Users, bgClass: 'bg-gray-50 text-gray-600 border border-gray-100' },
  { label: 'This Week', value: stats.value.recentReferrals || 0, icon: TrendingUp, bgClass: 'bg-gray-50 text-gray-600 border border-gray-100' },
  { label: 'Points Awarded', value: (stats.value.totalPointsAwarded || 0).toLocaleString(), icon: Star, bgClass: 'bg-gray-50 text-gray-600 border border-gray-100' },
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
    showToast({ title: 'Success', message: `${newFac.name} added.`, toastType: 'success', duration: 3000 })
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
    showToast({ title: 'Sent', message: `Welcome email sent to ${fac.email}`, toastType: 'success', duration: 3000 })
  } catch (e) {
    showToast({ title: 'Error', message: 'Failed to resend email', toastType: 'error', duration: 3000 })
  } finally { resendingEmail.value = null }
}

const requestDeactivate = (fac: any) => {
  facToDeactivate.value = fac
  showDeactivateModal.value = true
}

const confirmDeactivate = async () => {
  if (!facToDeactivate.value) return
  const fac = facToDeactivate.value
  try {
    await referrals_api.deactivateFacilitator(fac._id)
    showToast({ title: 'Deactivated', message: `${fac.name} has been deactivated.`, toastType: 'success', duration: 3000 })
    showDeactivateModal.value = false
    fetchFacilitators()
  } catch (e) {
    showToast({ title: 'Error', message: 'Failed to deactivate', toastType: 'error', duration: 3000 })
  }
}

const viewReferralDetails = (ref: any) => {
  selectedReferral.value = ref
  showDetailsModal.value = true
}

// ─── Helpers ─────────────────────────────────────────────────────

const tierEmoji = (tier: string) => ({ starter: '🌱', hustler: '🔥', ambassador: '💎', legend: '👑' }[tier] || '🌱')

const tierBadgeClass = (tier: string) => ({
  starter: 'bg-gray-50 text-gray-600 border-gray-200',
  hustler: 'bg-orange-50 text-orange-700 border-orange-200',
  ambassador: 'bg-purple-50 text-purple-700 border-purple-200',
  legend: 'bg-amber-50 text-amber-700 border-amber-200',
}[tier] || 'bg-gray-50 text-gray-600 border-gray-200')

const statusBadgeClass = (status: string) => ({
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rewarded: 'bg-blue-50 text-blue-700 border-blue-200',
}[status] || 'bg-gray-50 text-gray-600 border-gray-200')

const referrerTypeBadge = (type: string) => ({
  facilitator: 'bg-purple-50 text-purple-600 border-purple-100',
  student: 'bg-blue-50 text-blue-600 border-blue-100',
  vendor: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  errander: 'bg-amber-50 text-amber-600 border-amber-100',
}[type] || 'bg-gray-50 text-gray-600 border-gray-100')

const referrerTypeEmoji = (type: string) => ({
  facilitator: '💼', student: '🎓', vendor: '🏪', errander: '🚲'
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
  animation: fadeIn 0.4s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
