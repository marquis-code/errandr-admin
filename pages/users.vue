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
            class="w-full pl-14 pr-14 py-3.5 bg-white hover:bg-gray-50 transition-colors border border-gray-100 rounded-xl text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-[#FF5C1A]/5 focus:border-[#FF5C1A]/20 placeholder:text-gray-400 shadow-sm"
          />
        </div>
        
        <div class="flex items-center gap-4 px-5 py-3 bg-white rounded-xl border border-gray-100 shadow-sm shrink-0">
          <div class="w-10 h-10 rounded-xl bg-[#FF5C1A]/10 flex items-center justify-center">
            <UsersIcon class="w-5 h-5 text-[#FF5C1A]" />
          </div>
          <div class="flex flex-col">
            <span class="text-sm font-semibold text-gray-500">Total Users</span>
            <span class="text-lg font-bold text-gray-900 leading-none">{{ users.length }}</span>
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
        
        <div class="flex overflow-x-auto pb-2 hide-scrollbar gap-2">
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
      </div>

      <!-- Table Section -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div v-if="loading" class="p-4">
          <SkeletonTable :rows="8" :cols="5" />
        </div>

        <div v-else-if="filteredUsers.length === 0" class="py-20">
          <EmptyState 
            title="No users found" 
            :description="emptyStateDescription"
          />
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-gray-100 bg-white">
                <th class="py-4 px-6 font-semibold text-gray-600 text-sm whitespace-nowrap">User</th>
                <th class="py-4 px-4 font-semibold text-gray-600 text-sm whitespace-nowrap text-center">Role</th>
                <th class="py-4 px-4 font-semibold text-gray-600 text-sm whitespace-nowrap text-center">Status</th>
                <th class="py-4 px-4 font-semibold text-gray-600 text-sm whitespace-nowrap">Joined Date</th>
                <th class="py-4 px-6 font-semibold text-gray-600 text-sm whitespace-nowrap text-right">Actions</th>
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
                      class="p-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
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
              <div class="space-y-3">
                <div class="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-100">
                  <span class="text-sm font-medium text-gray-500">Full Name</span>
                  <span class="text-sm font-bold text-gray-900">{{ selectedUser.firstName }} {{ selectedUser.lastName }}</span>
                </div>
                <div class="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-100">
                  <span class="text-sm font-medium text-gray-500">Email</span>
                  <span class="text-sm font-bold text-gray-900 truncate ml-4">{{ selectedUser.email }}</span>
                </div>
                <div class="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-100">
                  <span class="text-sm font-medium text-gray-500">Phone</span>
                  <span class="text-sm font-bold text-gray-900">{{ selectedUser.phoneNumber || selectedUser.phone || 'N/A' }}</span>
                </div>
                <div class="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-100">
                  <span class="text-sm font-medium text-gray-500">Role</span>
                  <span class="text-xs font-semibold text-[#FF5C1A] bg-[#FF5C1A]/10 px-3 py-1 rounded-lg capitalize">{{ selectedUser.role }}</span>
                </div>
                <div class="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-100">
                  <span class="text-sm font-medium text-gray-500">Status</span>
                  <StatusBadge :status="selectedUser.isActive ? 'active' : 'suspended'" class="scale-90" />
                </div>
              </div>
            </template>

            <!-- Account Tab -->
            <template v-if="activeDrawerTab === 'account'">
              <div class="space-y-3">
                <div class="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-100">
                  <span class="text-sm font-medium text-gray-500">User ID</span>
                  <span class="text-xs font-mono font-semibold text-gray-700 bg-gray-50 px-2 py-1 rounded">{{ selectedUser._id }}</span>
                </div>
                <div class="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-100">
                  <span class="text-sm font-medium text-gray-500">Joined</span>
                  <span class="text-sm font-bold text-gray-900">{{ new Date(selectedUser.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) }}</span>
                </div>
                <div class="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-100">
                  <span class="text-sm font-medium text-gray-500">Last Updated</span>
                  <span class="text-sm font-bold text-gray-900">{{ selectedUser.updatedAt ? new Date(selectedUser.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A' }}</span>
                </div>
                <div class="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-100">
                  <span class="text-sm font-medium text-gray-500">Email Verified</span>
                  <span class="text-sm font-bold" :class="selectedUser.emailVerified || selectedUser.isEmailVerified ? 'text-emerald-600' : 'text-rose-500'">
                    {{ selectedUser.emailVerified || selectedUser.isEmailVerified ? 'Yes' : 'No' }}
                  </span>
                </div>
                <div v-if="selectedUser.address || selectedUser.location" class="flex justify-between items-start p-4 bg-white rounded-xl border border-gray-100">
                  <span class="text-sm font-medium text-gray-500">Address</span>
                  <span class="text-sm font-bold text-gray-900 text-right ml-4">{{ selectedUser.address || selectedUser.location || 'N/A' }}</span>
                </div>
              </div>
            </template>

            <!-- Activity Tab -->
            <template v-if="activeDrawerTab === 'activity'">
              <div class="space-y-3">
                <div class="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-100">
                  <span class="text-sm font-medium text-gray-500">Total Orders</span>
                  <span class="text-sm font-bold text-gray-900">{{ selectedUser.ordersCount || selectedUser.orders?.length || 0 }}</span>
                </div>
                <div class="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-100">
                  <span class="text-sm font-medium text-gray-500">Wallet Balance</span>
                  <span class="text-sm font-bold text-gray-900">₦{{ Number(selectedUser.walletBalance || selectedUser.wallet?.balance || 0).toLocaleString() }}</span>
                </div>
                <div class="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-100">
                  <span class="text-sm font-medium text-gray-500">Account Created</span>
                  <span class="text-sm font-bold text-gray-900">{{ timeAgo(selectedUser.createdAt) }}</span>
                </div>
              </div>
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
              class="flex-1 py-3 px-4 rounded-xl text-emerald-600 font-semibold text-sm bg-emerald-50 hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2"
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
  </div>
</template>

<script setup lang="ts">
import { useAdminUsers } from '@/composables/modules/admin';
import { admin_api } from '@/api_factory/modules/admin';
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';
import { Search, Eye, Users as UsersIcon, UserX2, UserCheck2 } from 'lucide-vue-next';
import { onMounted, ref, computed } from 'vue';
import EmptyState from '@/components/core/EmptyState.vue';
import ConfirmationModal from '@/components/ui/ConfirmationModal.vue';
import SkeletonTable from '@/components/ui/SkeletonTable.vue';
import StatusBadge from '@/components/ui/StatusBadge.vue';
import SideDrawer from '@/components/ui/SideDrawer.vue';
import { useCustomToast } from '@/composables/core/useCustomToast';

definePageMeta({
  layout: 'admin'
})

useHead({ title: 'Users - Errander Admin' });

const { showToast } = useCustomToast();
const { users, loading, fetchUsers } = useAdminUsers();
const searchQuery = ref('');
const selectedRole = ref('all');
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

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchesSearch = !searchQuery.value || 
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase());
    
    const matchesRole = selectedRole.value === 'all' || user.role === selectedRole.value;
    
    return matchesSearch && matchesRole;
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
