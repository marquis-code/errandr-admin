<template>
  <div>
    <div class="space-y-6 animate-fade-in max-w-full mx-auto pb-10">
      <!-- Search & Quick Stats -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
        <div class="flex-1 relative max-w-2xl group">
          <Search class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#FF5C1A] transition-colors" />
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search name or email..." 
            class="w-full pl-14 pr-14 py-3.5 bg-white hover:bg-gray-50 transition-colors border border-gray-100 rounded-xl text-base font-semibold focus:outline-none focus:ring-4 focus:ring-[#FF5C1A]/5 focus:border-[#FF5C1A]/20 placeholder:text-gray-400 shadow-sm"
          />
        </div>
        <!-- Quick Stats Grid -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
          <div class="flex items-center gap-4 px-5 py-3 bg-white rounded-xl border border-gray-100 shadow-none shrink-0">
            <div class="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <UsersIcon class="w-5 h-5 text-blue-600" />
            </div>
            <div class="flex flex-col">
              <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total</span>
              <span class="text-lg font-black text-gray-900 leading-none">{{ users.length }}</span>
            </div>
          </div>
          <div class="flex items-center gap-4 px-5 py-3 bg-white rounded-xl border border-gray-100 shadow-none shrink-0">
            <div class="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Activity class="w-5 h-5 text-emerald-600" />
            </div>
            <div class="flex flex-col">
              <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active</span>
              <span class="text-lg font-black text-gray-900 leading-none">{{ activeUsersCount }}</span>
            </div>
          </div>
          <div class="flex items-center gap-4 px-5 py-3 bg-white rounded-xl border border-gray-100 shadow-none shrink-0">
            <div class="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
              <XCircle class="w-5 h-5 text-rose-600" />
            </div>
            <div class="flex flex-col">
              <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Suspended</span>
              <span class="text-lg font-black text-gray-900 leading-none">{{ suspendedUsersCount }}</span>
            </div>
          </div>
          <div class="flex items-center gap-4 px-5 py-3 bg-white rounded-xl border border-gray-100 shadow-none shrink-0">
            <div class="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <DollarSign class="w-5 h-5 text-indigo-600" />
            </div>
            <div class="flex flex-col">
              <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Wallet Bal</span>
              <span class="text-lg font-black text-gray-900 leading-none">₦{{ totalWalletBalance.toLocaleString() }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Header & Filters -->
      <div class="space-y-6">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div class="space-y-1">
            <h1 class="text-3xl font-bold text-gray-900 font-display">Users</h1>
            <p class="text-sm font-medium text-gray-500">Manage all registered users on the platform.</p>
          </div>
        </div>
        
        <div class="flex overflow-x-auto pb-2 hide-scrollbar gap-2 flex-1">
          <button 
            v-for="role in roles" 
            :key="role"
            @click="selectedRole = role"
            class="px-5 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap border"
            :class="selectedRole === role ? 'bg-[#FF5C1A] text-white border-[#FF5C1A] shadow-sm' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 bg-white border-gray-100 shadow-sm'"
          >
            <span class="capitalize">{{ role }}</span>
          </button>
        </div>
        
        <div class="flex-shrink-0">
          <DateRangePicker v-model:start="startDate" v-model:end="endDate" />
        </div>
      </div>

      <!-- Table Section -->
      <div class="bg-white rounded-[1.25rem] border border-gray-100/60 shadow-sm hover:shadow-md transition-all overflow-hidden relative">
        <div class="px-6 py-5 border-b border-gray-100/60 bg-gray-50/50 flex justify-between items-center">
          <h3 class="text-sm font-bold text-gray-900 tracking-tight uppercase">Platform Users</h3>
        </div>

        <div v-if="loading" class="p-8 text-center text-gray-400 text-sm">
          <div class="w-8 h-8 border-4 border-[#FF5C1A] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          Loading Users...
        </div>

        <div v-else-if="filteredUsers.length === 0" class="py-20 text-center">
          <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mx-auto mb-4 shadow-sm border border-gray-100">
            <UsersIcon class="w-8 h-8" />
          </div>
          <h4 class="font-bold text-gray-900 tracking-tight">No users found</h4>
          <p class="text-sm text-gray-500 mt-1">There are currently no active users matching your filter.</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-gray-100/60 bg-gray-50/50 text-[11px] uppercase tracking-wider text-gray-500">
                <th class="py-4 px-6 font-bold whitespace-nowrap">User</th>
                <th class="py-4 px-4 font-bold whitespace-nowrap text-center">Role</th>
                <th class="py-4 px-4 font-bold whitespace-nowrap text-center">Wallet</th>
                <th class="py-4 px-4 font-bold whitespace-nowrap text-center">Status</th>
                <th class="py-4 px-4 font-bold whitespace-nowrap">Joined Date</th>
                <th class="py-4 px-6 font-bold whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="user in filteredUsers" :key="user._id" class="hover:bg-gray-50/50 transition-colors group">
                <td class="py-4 px-6 min-w-[250px]">
                  <div class="flex items-center gap-3">
                    <div class="relative shrink-0">
                      <div class="w-10 h-10 rounded-xl bg-[#FF5C1A]/10 flex items-center justify-center text-[#FF5C1A] text-sm font-bold border border-[#FF5C1A]/20">
                        {{ user.firstName?.[0] }}{{ user.lastName?.[0] }}
                      </div>
                    </div>
                    <div class="min-w-0">
                      <p class="text-sm font-bold text-gray-900 leading-none mb-1">{{ user.firstName }} {{ user.lastName }}</p>
                      <p class="text-xs font-medium text-gray-500 truncate">{{ user.email }}</p>
                    </div>
                  </div>
                </td>
                <td class="py-4 px-4 text-center">
                  <span class="text-xs font-semibold text-[#FF5C1A] bg-[#FF5C1A]/10 px-3 py-1 rounded-lg border border-[#FF5C1A]/20 capitalize">
                    {{ user.role }}
                  </span>
                </td>
                <td class="py-4 px-4 text-center">
                  <span class="text-xs font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md">
                    ₦{{ (user.walletBalance || 0).toLocaleString() }}
                  </span>
                </td>
                <td class="py-4 px-4 text-center">
                  <div class="flex justify-center">
                    <StatusBadge :status="user.isActive ? 'active' : 'suspended'" class="scale-75" />
                  </div>
                </td>
                <td class="py-4 px-4">
                  <p class="text-xs font-medium text-gray-600">{{ new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}</p>
                </td>
                <td class="py-4 px-6 text-right">
                  <div class="flex justify-end gap-2">
                    <button 
                      v-if="user.isActive" 
                      @click.stop="initiateAction('suspend', user._id)" 
                      class="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                      title="Suspend User"
                    >
                      <UserX2 class="w-4 h-4" />
                    </button>
                    <button 
                      v-else 
                      @click.stop="initiateAction('activate', user._id)" 
                      class="p-2 rounded-lg bg-[#FF5C1A]/10 text-[#FF5C1A] hover:bg-emerald-100 transition-colors"
                      title="Activate User"
                    >
                      <UserCheck2 class="w-4 h-4" />
                    </button>
                    <button 
                      @click.stop="openUserDrawer(user._id)" 
                      class="p-2 rounded-lg bg-gray-100 text-gray-500 hover:bg-[#FF5C1A] hover:text-white transition-colors"
                      title="View Details"
                    >
                      <Eye class="w-4 h-4" />
                    </button>
                    <button 
                      @click.stop="openFundModal(user)" 
                      class="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
                      title="Fund Wallet"
                    >
                      <Wallet class="w-4 h-4" />
                    </button>
                    <button 
                      @click.stop="openDebitModal(user)" 
                      class="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
                      title="Manual Payout / Deduct"
                    >
                      <Wallet class="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- User Detail Side Drawer -->
    <SideDrawer :isOpen="drawerOpen" @close="closeDrawer">
      <template v-if="drawerOpen">
        <!-- Loading State -->
        <div v-if="drawerLoading" class="flex flex-col items-center justify-center py-20">
          <div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#FF5C1A] mb-4"></div>
          <p class="text-sm font-medium text-gray-400">Loading user details...</p>
        </div>

        <!-- User Details -->
        <template v-else-if="selectedUser">
          <!-- Header Profile -->
          <div class="flex flex-col items-center justify-center pt-6 pb-8 border-b border-gray-100">
            <div class="w-20 h-20 rounded-2xl bg-[#FF5C1A] flex items-center justify-center text-white text-2xl font-bold mb-4">
              {{ selectedUser.firstName?.[0] }}{{ selectedUser.lastName?.[0] }}
            </div>
            <h3 class="text-xl font-bold text-gray-900">{{ selectedUser.firstName }} {{ selectedUser.lastName }}</h3>
            <p class="text-sm font-medium text-gray-500 mb-4">{{ selectedUser.email }}</p>
            <div class="flex items-center gap-3">
              <span class="text-xs font-semibold text-[#FF5C1A] bg-[#FF5C1A]/10 px-3 py-1 rounded-lg border border-[#FF5C1A]/20 capitalize">{{ selectedUser.role }}</span>
              <StatusBadge :status="selectedUser.isActive ? 'active' : 'suspended'" class="scale-90" />
            </div>

            <!-- Quick Stats Row -->
            <div class="flex items-center justify-between w-4/5 mt-6 bg-white rounded-lg border border-gray-100 divide-x divide-gray-100 shadow-sm">
              <div class="text-center flex-1 py-3">
                <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Wallet Balance</p>
                <p class="text-sm font-bold text-[#FF5C1A]">₦{{ Number(selectedUser.walletBalance || 0).toLocaleString() }}</p>
              </div>
              <div class="text-center flex-1 py-3">
                <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">Joined</p>
                <p class="text-xs font-semibold text-gray-900">{{ new Date(selectedUser.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) }}</p>
              </div>
            </div>
          </div>

          <!-- Tabs -->
          <div class="border-b border-gray-100">
            <div class="flex">
              <button 
                v-for="tab in drawerTabs" 
                :key="tab.key" 
                @click="activeDrawerTab = tab.key"
                class="flex-1 py-3 text-sm font-semibold text-center transition-colors border-b-2"
                :class="activeDrawerTab === tab.key ? 'text-[#FF5C1A] border-[#FF5C1A]' : 'text-gray-400 border-transparent hover:text-gray-600'"
              >
                {{ tab.label }}
              </button>
            </div>
          </div>

          <!-- Tab Content -->
          <div class="py-6 space-y-4">
            <!-- Overview Tab -->
            <template v-if="activeDrawerTab === 'overview'">
              <div class="space-y-6">
                <!-- Personal Info -->
                <div>
                  <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2 mb-4">
                    Personal Information
                  </h4>
                  <div class="grid grid-cols-2 gap-y-4 gap-x-4 text-sm px-2">
                    <div>
                      <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Full Name</p>
                      <p class="font-bold text-gray-900">{{ selectedUser.firstName }} {{ selectedUser.lastName }}</p>
                    </div>
                    <div>
                      <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Role</p>
                      <span class="text-[10px] font-bold text-[#FF5C1A] bg-[#FF5C1A]/10 px-2 py-0.5 rounded-md capitalize tracking-wide">{{ selectedUser.role }}</span>
                    </div>
                    <div>
                      <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Phone Number</p>
                      <p class="font-bold text-gray-900">{{ selectedUser.phone || selectedUser.phoneNumber || 'N/A' }}</p>
                    </div>
                    <div>
                      <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Email</p>
                      <p class="font-bold text-gray-900 truncate">{{ selectedUser.email }}</p>
                    </div>
                  </div>
                </div>
                
                <!-- Gamification & Engagement -->
                <div>
                  <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2 mb-4">
                    Engagement & Rewards
                  </h4>
                  <div class="grid grid-cols-2 gap-y-4 gap-x-4 text-sm px-2">
                    <div>
                      <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Reward Points</p>
                      <p class="text-xl font-black text-gray-900">{{ selectedUser.points || 0 }} <span class="text-xs text-gray-400 font-medium">pts</span></p>
                    </div>
                    <div>
                      <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Active Streak</p>
                      <p class="text-xl font-black text-gray-900">{{ selectedUser.streakCount || 0 }} <span class="text-xs">🔥</span></p>
                    </div>
                    <div>
                      <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Referral Code</p>
                      <p class="font-bold text-[#FF5C1A] font-mono tracking-wider">{{ selectedUser.referralCode || 'N/A' }}</p>
                    </div>
                    <div>
                      <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Total Referrals</p>
                      <p class="font-bold text-gray-900">{{ selectedUser.referralCount || 0 }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </template>

            <!-- Account Tab -->
            <template v-if="activeDrawerTab === 'account'">
              <div class="space-y-6">
                <!-- Account Status -->
                <div>
                  <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2 mb-4">
                    Account Status
                  </h4>
                  <div class="grid grid-cols-2 gap-y-4 gap-x-4 text-sm px-2">
                    <div>
                      <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">User ID</p>
                      <p class="font-mono text-xs font-bold text-gray-700 bg-gray-50 px-2 py-1 rounded inline-block">{{ selectedUser._id }}</p>
                    </div>
                    <div>
                      <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Joined Date</p>
                      <p class="font-bold text-gray-900">{{ new Date(selectedUser.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) }}</p>
                    </div>
                    <div>
                      <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Email Verification</p>
                      <span class="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md" :class="selectedUser.emailVerified || selectedUser.isEmailVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'">
                        {{ selectedUser.emailVerified || selectedUser.isEmailVerified ? 'Verified' : 'Unverified' }}
                      </span>
                    </div>
                    <div>
                      <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Last Updated</p>
                      <p class="font-bold text-gray-900">{{ selectedUser.updatedAt ? new Date(selectedUser.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A' }}</p>
                    </div>
                  </div>
                </div>

                <!-- Locations & Addresses -->
                <div>
                  <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2 mb-4">
                    Saved Locations
                  </h4>
                  <div class="px-2">
                    <template v-if="selectedUser.addresses?.length">
                      <div class="space-y-3">
                        <div v-for="(addr, idx) in selectedUser.addresses" :key="idx" class="bg-gray-50 p-3 rounded-lg flex items-start gap-3">
                          <MapPin class="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                          <div>
                            <p class="text-[10px] font-bold text-gray-900 uppercase tracking-wide mb-0.5">{{ addr.label || 'Saved Address' }} <span v-if="addr.isDefault" class="ml-1 text-[8px] bg-[#FF5C1A]/10 text-[#FF5C1A] px-1 py-0.5 rounded uppercase">Default</span></p>
                            <p class="text-xs font-medium text-gray-600 leading-relaxed">{{ addr.address || addr.street }}</p>
                            <p class="text-[10px] text-gray-500 mt-1" v-if="addr.city || addr.state">{{ addr.city }}, {{ addr.state }}</p>
                          </div>
                        </div>
                      </div>
                    </template>
                    <template v-else-if="selectedUser.address || selectedUser.location">
                      <div class="bg-gray-50 p-3 rounded-lg flex items-start gap-3">
                        <MapPin class="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                        <p class="text-xs font-medium text-gray-600 leading-relaxed">{{ selectedUser.address || selectedUser.location }}</p>
                      </div>
                    </template>
                    <template v-else>
                      <p class="text-xs font-medium text-gray-400 italic">No addresses saved</p>
                    </template>
                  </div>
                </div>
              </div>
            </template>

            <!-- Activity Tab -->
            <template v-if="activeDrawerTab === 'activity'">
              <div class="space-y-6">
                <!-- Wallet & Transactions -->
                <div>
                  <h4 class="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2 mb-4">
                    Wallet & Activity
                  </h4>
                  <div class="grid grid-cols-2 gap-y-4 gap-x-4 text-sm px-2">
                    <div>
                      <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Wallet Balance</p>
                      <p class="text-lg font-black text-[#FF5C1A]">₦{{ Number(selectedUser.walletBalance || selectedUser.wallet?.balance || 0).toLocaleString() }}</p>
                    </div>
                    <div>
                      <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Total Orders</p>
                      <p class="text-lg font-black text-gray-900">{{ selectedUser.ordersCount || selectedUser.orders?.length || 0 }}</p>
                    </div>
                    <div>
                      <p class="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Account Age</p>
                      <p class="font-bold text-gray-900">{{ timeAgo(selectedUser.createdAt) }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <!-- Edit Tab -->
            <template v-if="activeDrawerTab === 'edit'">
              <form @submit.prevent="handleUpdateUser" class="space-y-4">
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">First Name</label>
                  <input v-model="editPayload.firstName" type="text" class="w-full p-3 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20" />
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Last Name</label>
                  <input v-model="editPayload.lastName" type="text" class="w-full p-3 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20" />
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Phone</label>
                  <input v-model="editPayload.phone" type="text" class="w-full p-3 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20" />
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-medium text-gray-700">Role</label>
                  <select v-model="editPayload.role" class="w-full p-3 bg-white border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20">
                    <option value="student">Student</option>
                    <option value="vendor">Vendor</option>
                    <option value="errander">Errander</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <button type="submit" :disabled="updating" class="w-full py-3 bg-[#FF5C1A] text-white rounded-xl font-bold hover:bg-[#E04D12] transition-colors disabled:opacity-50">
                  {{ updating ? 'Saving...' : 'Save Changes' }}
                </button>
              </form>
            </template>
          </div>

          <!-- Actions -->
          <div class="border-t border-gray-100 pt-4 flex gap-3">
            <button 
              v-if="selectedUser.isActive"
              @click="initiateAction('suspend', selectedUser._id); closeDrawer()"
              class="flex-1 py-3 px-4 rounded-xl text-rose-600 font-semibold text-sm bg-rose-50 hover:bg-rose-100 transition-colors flex items-center justify-center gap-2"
            >
              <UserX2 class="w-4 h-4" /> Suspend
            </button>
            <button 
              v-else
              @click="initiateAction('activate', selectedUser._id); closeDrawer()"
              class="flex-1 py-3 px-4 rounded-xl text-[#FF5C1A] font-semibold text-sm bg-[#FF5C1A]/10 hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2"
            >
              <UserCheck2 class="w-4 h-4" /> Activate
            </button>
          </div>
        </template>
      </template>
    </SideDrawer>

    <ConfirmationModal
      :isOpen="confirmModal.isOpen"
      :title="confirmModal.title"
      :message="confirmModal.message"
      :type="confirmModal.type"
      :confirmText="confirmModal.confirmText"
      @cancel="confirmModal.isOpen = false"
      @confirm="executeAction"
    />

    <!-- Funding Modal -->
    <div v-if="fundModal.isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-fade-in">
      <div class="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden" @click.stop>
        <div class="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 class="text-xl font-bold text-gray-900">Fund User Wallet</h3>
          <button @click="fundModal.isOpen = false" class="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="p-6 space-y-4">
          <div class="flex items-center gap-3 p-3 bg-blue-50 rounded-xl mb-2">
            <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
              {{ fundModal.user?.firstName?.[0] || 'U' }}
            </div>
            <div>
              <p class="text-sm font-bold text-gray-900">{{ fundModal.user?.firstName }} {{ fundModal.user?.lastName }}</p>
              <p class="text-xs text-gray-500">{{ fundModal.user?.email }}</p>
            </div>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Amount (₦)</label>
            <input 
              v-model.number="fundModal.amount"
              type="number" 
              placeholder="e.g. 500" 
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-base font-medium focus:outline-none focus:ring-2 focus:ring-[#FF5C1A] focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Description (Optional)</label>
            <input 
              v-model="fundModal.description"
              type="text" 
              placeholder="e.g. Customer Service Refund" 
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-base font-medium focus:outline-none focus:ring-2 focus:ring-[#FF5C1A] focus:border-transparent transition-all"
            />
          </div>
        </div>
        <div class="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
          <button 
            @click="fundModal.isOpen = false"
            class="flex-1 py-3 px-4 rounded-xl font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            @click="executeFundUser"
            :disabled="fundModal.loading || !fundModal.amount"
            class="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-[#FF5C1A] hover:bg-[#E04D12] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <span v-if="fundModal.loading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
            Fund Wallet
          </button>
        </div>
      </div>
    </div>
    <!-- Debit Modal -->
    <div v-if="debitModal.isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm animate-fade-in">
      <div class="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden" @click.stop>
        <div class="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 class="text-xl font-bold text-gray-900">Manual Payout / Deduct</h3>
          <button @click="debitModal.isOpen = false" class="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
            <X class="w-5 h-5" />
          </button>
        </div>
        <div class="p-6 space-y-4">
          <div class="p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium mb-2">
            Use this to manually deduct funds if you've paid out the user directly outside of the system. An email will be sent to the user notifying them of this deduction.
          </div>
          <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-2">
            <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold shrink-0">
              {{ debitModal.user?.firstName?.[0] || 'U' }}
            </div>
            <div>
              <p class="text-sm font-bold text-gray-900">{{ debitModal.user?.firstName }} {{ debitModal.user?.lastName }}</p>
              <p class="text-xs text-gray-500">{{ debitModal.user?.email }}</p>
            </div>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Amount to Deduct (₦)</label>
            <input 
              v-model.number="debitModal.amount"
              type="number" 
              placeholder="e.g. 500" 
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-base font-medium focus:outline-none focus:ring-2 focus:ring-[#FF5C1A] focus:border-transparent transition-all"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Description / Note</label>
            <textarea 
              v-model="debitModal.description"
              placeholder="e.g. Paid cash to user" 
              class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-[#FF5C1A] focus:border-transparent transition-all resize-none"
              rows="2"
            ></textarea>
          </div>
        </div>
        <div class="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
          <button 
            @click="debitModal.isOpen = false"
            class="flex-1 py-3 px-4 rounded-xl font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button 
            @click="executeDebitUser"
            :disabled="debitModal.loading || !debitModal.amount"
            class="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <span v-if="debitModal.loading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
            Process Debit
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { admin_api } from '@/api_factory/modules/admin';
import { wallets_api } from '@/api_factory/modules/wallets';
import { useAdminUsers } from '@/composables/modules/admin';
import { Users as UsersIcon, Search, MoreHorizontal, UserCheck, UserX, Shield, Edit2, Activity, DollarSign, XCircle, UserX2, UserCheck2, MapPin, X, Wallet, Eye } from 'lucide-vue-next';
import { ref, computed, onMounted } from 'vue';
import StatusBadge from '@/components/ui/StatusBadge.vue';
import SideDrawer from '@/components/ui/SideDrawer.vue';
import DateRangePicker from '@/components/ui/DateRangePicker.vue';
import ConfirmationModal from '@/components/ui/ConfirmationModal.vue';
import { useCustomToast } from '@/composables/core/useCustomToast';

definePageMeta({
  layout: 'admin'
})

useHead({ title: 'Users - Errander Admin' });

const { showToast } = useCustomToast();
const { users, loading, fetchUsers } = useAdminUsers();
const searchQuery = ref('');
const selectedRole = ref('all');
const startDate = ref('');
const endDate = ref('');
const roles = ['all', 'admin', 'vendor', 'student'];

// Drawer state
const drawerOpen = ref(false);
const drawerLoading = ref(false);
const selectedUser = ref<any>(null);
const activeDrawerTab = ref('overview');
const drawerTabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'account', label: 'Account' },
  { key: 'activity', label: 'Activity' },
  { key: 'edit', label: 'Edit' },
];

const confirmModal = ref({
  isOpen: false,
  title: '',
  message: '',
  type: 'danger',
  confirmText: 'Confirm',
  actionType: '',
  userId: ''
});

const activeUsersCount = computed(() => users.value.filter(u => u.isActive).length);
const suspendedUsersCount = computed(() => users.value.filter(u => !u.isActive).length);
const totalWalletBalance = computed(() => users.value.reduce((acc, u) => acc + (Number(u.walletBalance) || 0), 0));

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchesSearch = !searchQuery.value || 
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase());
    
    const matchesRole = selectedRole.value === 'all' || user.role === selectedRole.value;
    
    let matchesDate = true;
    if (startDate.value || endDate.value) {
      const uDate = new Date(user.createdAt).getTime();
      if (startDate.value && uDate < new Date(startDate.value).getTime()) matchesDate = false;
      if (endDate.value && uDate > new Date(endDate.value).getTime() + 86400000) matchesDate = false;
    }
    
    return matchesSearch && matchesRole && matchesDate;
  });
});

const emptyStateDescription = computed(() => {
  if (searchQuery.value) {
    return `No users match "${searchQuery.value}" in ${selectedRole.value} role.`;
  }
  return `There are currently no users with the ${selectedRole.value} role.`;
});

const timeAgo = (date: string) => {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
  ];
  for (const i of intervals) {
    const count = Math.floor(seconds / i.seconds);
    if (count >= 1) return `${count} ${i.label}${count > 1 ? 's' : ''} ago`;
  }
  return 'Just now';
};

const openUserDrawer = async (userId: string) => {
  drawerOpen.value = true;
  drawerLoading.value = true;
  activeDrawerTab.value = 'overview';
  selectedUser.value = null;
  
  try {
    const res = await admin_api.getUser(userId);
    selectedUser.value = res.data.user || res.data;
    editPayload.value = {
      firstName: selectedUser.value.firstName || '',
      lastName: selectedUser.value.lastName || '',
      phone: selectedUser.value.phoneNumber || selectedUser.value.phone || '',
      role: selectedUser.value.role || 'student'
    };
  } catch (e) {
    console.error('Failed to fetch user:', e);
    showToast({ title: 'Error', message: 'Failed to load user details', toastType: 'error' });
    drawerOpen.value = false;
  } finally {
    drawerLoading.value = false;
  }
};

const closeDrawer = () => {
  drawerOpen.value = false;
  selectedUser.value = null;
};

onMounted(fetchUsers);

const editPayload = ref({ firstName: '', lastName: '', phone: '', role: 'student' });
const updating = ref(false);

const handleUpdateUser = async () => {
  if (!selectedUser.value) return;
  updating.value = true;
  try {
    await admin_api.updateUser(selectedUser.value._id, editPayload.value);
    showToast({ title: 'Success', message: 'User updated successfully', toastType: 'success' });
    await fetchUsers();
    // Refresh user details
    const res = await admin_api.getUser(selectedUser.value._id);
    selectedUser.value = res.data.user || res.data;
  } catch (e) {
    console.error(e);
    showToast({ title: 'Error', message: 'Failed to update user', toastType: 'error' });
  } finally {
    updating.value = false;
  }
};

const initiateAction = (action: 'suspend' | 'activate', userId: string) => {
  confirmModal.value.userId = userId;
  confirmModal.value.actionType = action;
  confirmModal.value.isOpen = true;
  
  if (action === 'suspend') {
    confirmModal.value.title = 'Suspend User';
    confirmModal.value.message = 'Are you sure you want to suspend this user? They will not be able to log in.';
    confirmModal.value.type = 'danger';
    confirmModal.value.confirmText = 'Suspend';
  } else {
    confirmModal.value.title = 'Activate User';
    confirmModal.value.message = 'Are you sure you want to activate this user? They will regain access to the platform.';
    confirmModal.value.type = 'success';
    confirmModal.value.confirmText = 'Activate';
  }
};

const executeAction = async () => {
  try {
    confirmModal.value.isOpen = false;
    const { actionType, userId } = confirmModal.value;
    
    if (actionType === 'suspend') {
      await api.put(`/admin/users/${userId}/suspend`);
      showToast({ title: 'Success', message: 'User suspended successfully', toastType: 'success' });
    } else {
      await api.put(`/admin/users/${userId}/activate`);
      showToast({ title: 'Success', message: 'User activated successfully', toastType: 'success' });
    }
    
    await fetchUsers();
  } catch (e) {
    console.error(e);
  }
};

// Funding Logic
const fundModal = ref({
  isOpen: false,
  user: null as any,
  amount: null as number | null,
  description: '',
  loading: false
});

const openFundModal = (user: any) => {
  fundModal.value = {
    isOpen: true,
    user,
    amount: null,
    description: '',
    loading: false
  };
};

const executeFundUser = async () => {
  if (!fundModal.value.amount || fundModal.value.amount <= 0) return;
  fundModal.value.loading = true;
  try {
    await wallets_api.fundWalletByAdmin(
      fundModal.value.user._id, 
      fundModal.value.amount, 
      fundModal.value.description
    );
    showToast({ title: 'Success', message: 'Wallet funded successfully', toastType: 'success' });
    fundModal.value.isOpen = false;
    await fetchUsers(); // Refresh stats and list
  } catch (error: any) {
    showToast({ 
      title: 'Error', 
      message: error?.response?.data?.message || 'Failed to fund wallet', 
      toastType: 'error' 
    });
  } finally {
    fundModal.value.loading = false;
  }
};

const debitModal = ref({
  isOpen: false,
  user: null as any,
  amount: null as number | null,
  description: '',
  loading: false
});

const openDebitModal = (user: any) => {
  debitModal.value = {
    isOpen: true,
    user,
    amount: null,
    description: '',
    loading: false
  };
};

const executeDebitUser = async () => {
  if (!debitModal.value.amount || debitModal.value.amount <= 0) return;
  debitModal.value.loading = true;
  try {
    await wallets_api.debitWalletByAdmin(
      debitModal.value.user._id, 
      debitModal.value.amount, 
      debitModal.value.description
    );
    showToast({ title: 'Success', message: 'Wallet debited successfully', toastType: 'success' });
    debitModal.value.isOpen = false;
    await fetchUsers(); // Refresh stats and list
  } catch (error: any) {
    showToast({ 
      title: 'Error', 
      message: error?.response?.data?.message || 'Failed to debit wallet', 
      toastType: 'error' 
    });
  } finally {
    debitModal.value.loading = false;
  }
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.font-display {
  font-family: 'Roobert PRO', sans-serif;
}
</style>
