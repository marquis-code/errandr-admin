<template>
 <div class="space-y-10 animate-fade-in max-w-7xl mx-auto pb-20">
 <!-- Search & Quick Stats -->
 <div class="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-4">
 <div class="flex-1 relative max-w-2xl group">
 <Search class="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#065fdb] transition-colors" />
 <input 
 v-model="searchQuery"
 type="text" 
 placeholder="Search identity or email..." 
 class="w-full pl-14 pr-14 py-4 bg-white hover:bg-gray-50/50 transition-all border border-gray-100 rounded-2xl text-sm font-black focus:outline-none focus:ring-4 focus:ring-[#065fdb]/5 focus:border-[#065fdb]/20 placeholder:text-gray-300 placeholder:font-bold"
 />
 <div class="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 opacity-40 group-focus-within:opacity-100 transition-opacity">
 <kbd class="px-2 py-1 text-[10px] font-black bg-gray-50 text-gray-500 rounded-lg border border-gray-200">⌘</kbd>
 <kbd class="px-2 py-1 text-[10px] font-black bg-gray-50 text-gray-500 rounded-lg border border-gray-200">K</kbd>
 </div>
 </div>
 
 <div class="flex items-center gap-4 px-6 py-3 bg-white rounded-2xl border border-gray-100 shadow-sm shrink-0">
 <div class="w-10 h-10 rounded-xl bg-[#065fdb]/5 flex items-center justify-center">
 <Users class="w-5 h-5 text-[#065fdb]" />
 </div>
 <div class="flex flex-col">
 <span class="text-[10px] font-black text-gray-400 tracking-widest">Total Population</span>
 <span class="text-lg font-black text-gray-900 leading-none">{{ users.length }} Users</span>
 </div>
 </div>
 </div>

 <!-- Header & Filters Header -->
 <div class="space-y-8">
 <div class="flex flex-col md:flex-row md:items-end justify-between gap-6">
 <div class="space-y-1">
 <h1 class="text-4xl font-black text-gray-900 tracking-tighter font-display">User Directory</h1>
 <p class="text-xs font-bold text-gray-400 tracking-widest">Manage platform identity and access levels.</p>
 </div>
 
 <div class="flex items-center gap-3">
 <button class="flex items-center gap-2.5 px-6 py-3.5 bg-white hover:bg-gray-50 rounded-2xl text-[11px] font-black text-gray-900 transition-all border border-gray-100 tracking-[0.1em] shadow-sm">
 <ListFilter class="w-4 h-4" />
 Advanced Filters
 </button>
 </div>
 </div>
 
 <div class="flex overflow-x-auto pb-4 hide-scrollbar gap-2">
 <button 
 v-for="role in roles" 
 :key="role"
 @click="selectedRole = role"
 class="px-6 py-2.5 rounded-xl text-[10px] font-black transition-all tracking-[0.2em] whitespace-nowrap border"
 :class="selectedRole === role ? 'bg-[#065fdb] text-white border-[#065fdb] shadow-lg shadow-[#065fdb]/20' : 'text-gray-400 hover:text-gray-900 bg-white border-gray-100'"
 >
 {{ role }}
 </button>
 </div>
 </div>

 <!-- Table Section -->
 <div class="bg-white rounded-[2.5rem] border border-gray-50 shadow-sm overflow-hidden">
 <div v-if="loading" class="p-4">
 <SkeletonTable :rows="8" :cols="5" />
 </div>

 <div v-else-if="filteredUsers.length === 0" class="py-32">
 <EmptyState 
 title="No identities found" 
 :description="emptyStateDescription"
 />
 </div>

 <div v-else class="overflow-x-auto">
 <table class="w-full text-left border-collapse">
 <thead>
 <tr class="border-b border-gray-50 bg-gray-50/30">
 <th class="py-6 px-8 font-black text-gray-400 text-[10px] tracking-[0.2em] whitespace-nowrap">Identity Profile</th>
 <th class="py-6 px-4 font-black text-gray-400 text-[10px] tracking-[0.2em] whitespace-nowrap text-center">Protocol Role</th>
 <th class="py-6 px-4 font-black text-gray-400 text-[10px] tracking-[0.2em] whitespace-nowrap text-center">Status</th>
 <th class="py-6 px-4 font-black text-gray-400 text-[10px] tracking-[0.2em] whitespace-nowrap">Onboarding Date</th>
 <th class="py-6 px-8 font-black text-gray-400 text-[10px] tracking-[0.2em] whitespace-nowrap text-right">Actions</th>
 </tr>
 </thead>
 <tbody class="divide-y divide-gray-50/50">
 <tr v-for="user in filteredUsers" :key="user._id" class="hover:bg-gray-50/50 transition-all group cursor-pointer" @click="selectedUser = user">
 <td class="py-6 px-8 min-w-[300px]">
 <div class="flex items-center gap-5">
 <div class="relative">
 <div class="w-12 h-12 rounded-2xl bg-[#065fdb]/10 flex items-center justify-center text-[#065fdb] text-xs font-black shadow-inner border border-[#065fdb]/5 group-hover:rotate-6 transition-transform">
 {{ user.firstName[0] }}{{ user.lastName[0] }}
 </div>
 <div class="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-lg border-2 border-white shadow-sm" />
 </div>
 <div class="min-w-0">
 <p class="text-base font-black text-gray-900 leading-none mb-1">{{ user.firstName }} {{ user.lastName }}</p>
 <p class="text-[11px] font-bold text-gray-400 tracking-tight truncate">{{ user.email }}</p>
 </div>
 </div>
 </td>
 <td class="py-6 px-4 text-center">
 <span class="text-[9px] font-black text-[#065fdb] tracking-[0.2em] bg-[#065fdb]/5 px-3 py-1.5 rounded-xl border border-[#065fdb]/10">
 {{ user.role }}
 </span>
 </td>
 <td class="py-6 px-4 text-center">
 <div class="flex justify-center">
 <StatusBadge :status="user.isActive ? 'active' : 'suspended'" class="scale-90" />
 </div>
 </td>
 <td class="py-6 px-4">
 <div class="flex flex-col">
 <p class="text-sm font-black text-gray-900 tracking-tight">{{ new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}</p>
 <span class="text-[9px] font-bold text-gray-400 tracking-widest mt-0.5">Verified System Entry</span>
 </div>
 </td>
 <td class="py-6 px-8 text-right">
 <div class="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 text-gray-400 group-hover:bg-[#065fdb] group-hover:text-white transition-all">
 <span class="text-[10px] font-black tracking-widest mr-1 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all">View Core</span>
 <ChevronRight class="w-4 h-4" />
 </div>
 </td>
 </tr>
 </tbody>
 </table>
 </div>
 </div>

 <!-- SideDrawer Redesign -->
 <SideDrawer :isOpen="!!selectedUser" @close="selectedUser = null">
 <template v-if="selectedUser">
 <div class="flex flex-col items-center justify-center pt-12 pb-10 border-b border-gray-50 relative overflow-hidden">
 <div class="absolute inset-0 bg-gradient-to-b from-[#065fdb]/5 to-transparent opacity-50" />
 <div class="relative mb-6">
 <div class="w-24 h-24 rounded-[2rem] bg-[#065fdb] flex items-center justify-center text-white text-3xl font-black shadow-2xl shadow-[#065fdb]/30 rotate-3 group-hover:rotate-6 transition-transform">
 {{ selectedUser.firstName[0] }}{{ selectedUser.lastName[0] }}
 </div>
 <div class="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-2xl border-4 border-white shadow-lg" />
 </div>
 
 <h3 class="text-2xl font-black text-gray-900 tracking-tighter font-display leading-none">{{ selectedUser.firstName }} {{ selectedUser.lastName }}</h3>
 <p class="text-sm font-bold text-gray-400 mt-2 mb-6 tracking-widest">{{ selectedUser.email }}</p>
 
 <span class="text-[10px] font-black text-[#065fdb] tracking-[0.3em] bg-[#065fdb]/5 px-5 py-2 rounded-xl border border-[#065fdb]/10">
 Protocol: {{ selectedUser.role }}
 </span>
 </div>

 <div class="p-10 space-y-12">
 <div class="space-y-6">
 <h4 class="text-[11px] font-black tracking-[0.3em] text-gray-400 mb-6 flex items-center gap-3">
 <div class="w-1 h-3 bg-gray-200 rounded-full"></div> Core Identity Information
 </h4>
 <div class="space-y-4">
 <div class="flex justify-between items-center bg-gray-50/50 p-4 rounded-2xl border border-gray-50">
 <span class="text-[10px] font-black text-gray-400 tracking-widest leading-none">Registered At</span>
 <span class="text-sm font-black text-gray-900 tracking-tight">{{ new Date(selectedUser.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}</span>
 </div>
 <div class="flex justify-between items-center bg-gray-50/50 p-4 rounded-2xl border border-gray-50">
 <span class="text-[10px] font-black text-gray-400 tracking-widest leading-none">Security Status</span>
 <StatusBadge :status="selectedUser.isActive ? 'active' : 'suspended'" class="scale-90 origin-right transition-transform" />
 </div>
 <div class="bg-[#065fdb]/5 p-6 rounded-[2rem] border border-[#065fdb]/10 group transition-all hover:bg-[#065fdb]/10">
 <div class="flex items-center justify-between mb-2">
 <span class="text-[10px] font-black text-[#065fdb] tracking-widest leading-none">System ID Mapping</span>
 <Copy class="w-4 h-4 text-[#065fdb]/40 cursor-pointer hover:text-[#065fdb] transition-colors" />
 </div>
 <span class="text-base font-black text-[#065fdb] font-mono tracking-tighter break-all">{{ selectedUser._id.toUpperCase() }}</span>
 </div>
 </div>
 </div>

 <div class="pt-8 space-y-4">
 <h4 class="text-[11px] font-black tracking-[0.3em] text-rose-400 mb-6 flex items-center gap-3">
 <div class="w-1 h-3 bg-rose-200 rounded-full"></div> Access Control Panel
 </h4>
 <div class="grid grid-cols-1 gap-4">
 <button 
 v-if="selectedUser.isActive" 
 @click="handleSuspend(selectedUser._id)" 
 class="group w-full py-5 px-6 rounded-[1.5rem] text-rose-500 font-black text-[11px] tracking-widest bg-rose-50 hover:bg-rose-100 transition-all border border-rose-100 flex items-center justify-center gap-3"
 >
 <UserX2 class="w-5 h-5 group-hover:rotate-12 transition-transform" /> 
 Suspend Protocol Access
 </button>
 <button 
 v-else 
 @click="handleActivate(selectedUser._id)" 
 class="group w-full py-5 px-6 rounded-[1.5rem] text-white font-black text-[11px] tracking-widest bg-emerald-500 hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 active:scale-95"
 >
 <UserCheck2 class="w-5 h-5 group-hover:scale-110 transition-transform" /> 
 Authorize Protocol Access
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
