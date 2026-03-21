<template>
  <div class="space-y-4 animate-fade-in max-w-7xl mx-auto pb-10">
    <!-- Search Bar -->
    <div class="flex items-center justify-between gap-4 mb-4 mt-2">
      <div class="flex-1 relative max-w-2xl">
        <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Search or jump to" 
          class="w-full pl-11 pr-14 py-2.5 bg-gray-50/70 hover:bg-gray-100 transition-colors border-none rounded-xl text-sm font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-parentPrimary/20"
        />
        <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <kbd class="px-1.5 py-0.5 text-[10px] font-bold bg-white text-gray-400 rounded-md border border-gray-200">⌘</kbd>
          <kbd class="px-1.5 py-0.5 text-[10px] font-bold bg-white text-gray-400 rounded-md border border-gray-200">K</kbd>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <span class="text-sm font-medium text-gray-500 hidden md:block">Total Users: <strong class="text-gray-900">{{ users.length }}</strong></span>
      </div>
    </div>

    <!-- Header & Filters -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 tracking-tight font-display mb-6">Users</h1>
      
      <div class="flex items-center gap-4">
        <button class="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-full text-sm font-medium text-gray-700 transition-colors border border-gray-200">
          <ListFilter class="w-4 h-4" />
          Filters
        </button>
        <span class="text-sm font-medium text-gray-400">No filters applied</span>
        
        <div class="ml-auto flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          <button 
            v-for="role in roles" 
            :key="role"
            @click="selectedRole = role"
            class="px-4 py-1.5 rounded-full text-xs font-bold transition-all uppercase tracking-wider whitespace-nowrap"
            :class="selectedRole === role ? 'bg-parentPrimary text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100 bg-gray-50 border border-transparent'"
          >
            {{ role }}
          </button>
        </div>
      </div>
    </div>

    <!-- Content Area -->
    <div v-if="loading">
      <SkeletonTable :rows="8" :cols="5" />
    </div>

    <div v-else-if="filteredUsers.length === 0">
      <EmptyState 
        title="No users found" 
        :description="emptyStateDescription"
      />
    </div>

    <div v-else class="bg-white">
      <div class="overflow-x-auto pb-20">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-100">
              <th class="py-4 px-2 font-medium text-gray-400 text-[11px] whitespace-nowrap">User Profile</th>
              <th class="py-4 px-2 font-medium text-gray-400 text-[11px] whitespace-nowrap">Role</th>
              <th class="py-4 px-2 font-medium text-gray-400 text-[11px] whitespace-nowrap">Status</th>
              <th class="py-4 px-2 font-medium text-gray-400 text-[11px] whitespace-nowrap">Joined Date</th>
              <th class="py-4 px-2 font-medium text-gray-400 text-[11px] whitespace-nowrap"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50/50">
            <tr v-for="user in filteredUsers" :key="user._id" class="hover:bg-gray-50/80 transition-colors group cursor-pointer" @click="selectedUser = user">
              <td class="py-4 px-2 min-w-[250px]">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-[11px] font-bold shadow-sm flex-shrink-0">
                    {{ user.firstName[0] }}{{ user.lastName[0] }}
                  </div>
                  <div class="min-w-0">
                    <p class="text-[13px] font-medium text-gray-900 leading-tight truncate">{{ user.firstName }} {{ user.lastName }}</p>
                    <p class="text-[11px] text-gray-500 truncate">{{ user.email }}</p>
                  </div>
                </div>
              </td>
              <td class="py-4 px-2">
                <span class="text-[11px] font-bold text-gray-600 capitalize bg-gray-100/80 px-2.5 py-1 rounded-md border border-gray-200/50">
                  {{ user.role }}
                </span>
              </td>
              <td class="py-4 px-2">
                <StatusBadge :status="user.isActive ? 'active' : 'suspended'" class="scale-90 origin-left" />
              </td>
              <td class="py-4 px-2">
                 <p class="text-xs font-medium text-gray-900">{{ new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}</p>
              </td>
              <td class="py-4 px-2 text-right">
                <ChevronRight class="w-4 h-4 text-gray-300 group-hover:text-gray-600 transition-colors inline-block" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- SideDrawer for User Details -->
    <SideDrawer :isOpen="!!selectedUser" @close="selectedUser = null">
      <template v-if="selectedUser">
        <div class="flex flex-col items-center justify-center py-8 border-b border-gray-100">
           <div class="w-20 h-20 rounded-full bg-violet-600 flex items-center justify-center text-white text-2xl font-bold shadow-sm mb-4">
             {{ selectedUser.firstName[0] }}{{ selectedUser.lastName[0] }}
           </div>
           <h3 class="text-xl font-bold text-gray-900">{{ selectedUser.firstName }} {{ selectedUser.lastName }}</h3>
           <p class="text-sm text-gray-500 mb-2">{{ selectedUser.email }}</p>
           <span class="text-[10px] font-bold text-parentPrimary uppercase tracking-widest bg-parentPrimary/10 px-3 py-1 rounded-full">
             {{ selectedUser.role }}
           </span>
        </div>

        <div class="py-8 space-y-8">
          <div>
            <h4 class="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-4">Account Information</h4>
            <div class="space-y-4">
               <div class="flex justify-between items-center text-sm">
                 <span class="text-gray-500 font-medium">Joined Date</span>
                 <span class="text-gray-900 font-medium">{{ new Date(selectedUser.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}</span>
               </div>
               <div class="flex justify-between items-center text-sm">
                 <span class="text-gray-500 font-medium">Account Status</span>
                 <StatusBadge :status="selectedUser.isActive ? 'active' : 'suspended'" class="scale-90 origin-right transition-transform" />
               </div>
               <div class="flex justify-between items-center text-sm">
                 <span class="text-gray-500 font-medium">User ID</span>
                 <span class="text-parentPrimary font-medium font-mono flex items-center gap-1.5">{{ selectedUser._id.toUpperCase() }} <Copy class="w-3.5 h-3.5 cursor-pointer hover:text-green-600 transition-colors" /></span>
               </div>
            </div>
          </div>

          <div class="pt-8 border-t border-gray-100">
            <h4 class="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-4">Administrative Actions</h4>
            <div class="space-y-3">
              <button 
                v-if="selectedUser.isActive" 
                @click="handleSuspend(selectedUser._id)" 
                class="w-full py-3.5 px-4 rounded-xl text-rose-500 font-bold text-sm bg-rose-50 hover:bg-rose-100 transition-colors border border-rose-100 flex items-center justify-center gap-2"
              >
                <UserX2 class="w-4 h-4" /> Suspend Account
              </button>
              <button 
                v-else 
                @click="handleActivate(selectedUser._id)" 
                class="w-full py-3.5 px-4 rounded-xl text-white font-bold text-sm bg-emerald-500 hover:bg-emerald-600 transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <UserCheck2 class="w-4 h-4" /> Reactivate Account
              </button>
            </div>
          </div>
        </div>
      </template>
    </SideDrawer>
  </div>
</template>

<script setup lang="ts">
import { useAdminUsers } from '@/composables/modules/admin';
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';
import { Search, ListFilter, ChevronRight, Copy, UserX2, UserCheck2 } from 'lucide-vue-next';
import { onMounted, ref, computed } from 'vue';
import SideDrawer from '@/components/ui/SideDrawer.vue';
import EmptyState from '@/components/core/EmptyState.vue';

definePageMeta({
  layout: 'admin'
})

useHead({ title: 'User Management - Errandr Admin' });

const { users, loading, fetchUsers } = useAdminUsers();
const searchQuery = ref('');
const selectedRole = ref('all');
const roles = ['all', 'admin', 'vendor', 'student'];
const selectedUser = ref<any>(null);

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
    return `No results for "${searchQuery.value}" in ${selectedRole.value} category.`;
  }
  return `There are currently no users in the ${selectedRole.value} category.`;
});

const handleSuspend = async (id: string) => {
  if (!confirm('Are you sure you want to suspend this user?')) return;
  try {
    await api.put(`/admin/users/${id}/suspend`);
    await fetchUsers();
  } catch (e) {
    console.error(e);
  }
};

const handleActivate = async (id: string) => {
  try {
    await api.put(`/admin/users/${id}/activate`);
    await fetchUsers();
  } catch (e) {
    console.error(e);
  }
};

onMounted(fetchUsers);
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
