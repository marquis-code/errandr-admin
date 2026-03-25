<template>
 <div class="space-y-4 animate-fade-in max-w-7xl mx-auto pb-10">
 <!-- Search Bar -->
 <div class="flex items-center justify-between gap-4 mb-4 mt-2">
 <div class="flex-1 relative max-w-2xl">
 <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
 <input 
 v-model="searchQuery"
 type="text" 
 placeholder="Search by ticket or subject" 
 class="w-full pl-11 pr-14 py-2.5 bg-gray-50/70 hover:bg-gray-100 transition-colors border-none rounded-xl text-sm font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-parentPrimary/20"
 />
 <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
 <kbd class="px-1.5 py-0.5 text-[10px] font-bold bg-white text-gray-400 rounded-md border border-gray-200">⌘</kbd>
 <kbd class="px-1.5 py-0.5 text-[10px] font-bold bg-white text-gray-400 rounded-md border border-gray-200">K</kbd>
 </div>
 </div>
 <div class="flex items-center gap-4">
 <span class="text-sm font-medium text-gray-500 hidden md:block">Total Reports: <strong class="text-gray-900">{{ reports.length }}</strong></span>
 </div>
 </div>

 <!-- Header & Filters -->
 <div class="mb-6">
 <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
 <div>
 <h1 class="text-2xl font-bold text-gray-900 tracking-tight font-display mb-1">Reports & Tickets</h1>
 <p class="text-gray-500 text-sm font-medium">Manage user feedback, support requests, and system flags.</p>
 </div>
 </div>
 
 <div class="flex items-center gap-4">
 <button class="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-full text-sm font-medium text-gray-700 transition-colors border border-gray-200">
 <ListFilter class="w-4 h-4" />
 Filters
 </button>
 <span class="text-sm font-medium text-gray-400">No filters applied</span>

 <div class="ml-auto flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
 <button 
 v-for="s in ['all', 'pending', 'resolved', 'rejected']" :key="s" 
 @click="statusFilter = s"
 class="px-4 py-1.5 rounded-full text-xs font-bold transition-all tracking-wider whitespace-nowrap"
 :class="statusFilter === s ? 'bg-parentPrimary text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100 bg-gray-50 border border-transparent'"
 >
 {{ s }}
 </button>
 </div>
 </div>
 </div>


 <!-- Reports Table -->
 <div v-if="filteredReports.length === 0">
 <EmptyState 
 title="No reports found" 
 description="All user reports and support tickets will appear here."
 />
 </div>

 <div v-else class="bg-white">
 <div class="overflow-x-auto pb-20">
 <table class="w-full text-left border-collapse">
 <thead>
 <tr class="border-b border-gray-100">
 <th class="py-4 px-2 font-medium text-gray-400 text-[11px] whitespace-nowrap">Ticket ID</th>
 <th class="py-4 px-2 font-medium text-gray-400 text-[11px] whitespace-nowrap">Reporter</th>
 <th class="py-4 px-2 font-medium text-gray-400 text-[11px] whitespace-nowrap">Subject</th>
 <th class="py-4 px-2 font-medium text-gray-400 text-[11px] whitespace-nowrap">Date</th>
 <th class="py-4 px-2 font-medium text-gray-400 text-[11px] whitespace-nowrap">Status</th>
 <th class="py-4 px-2 font-medium text-gray-400 text-[11px] whitespace-nowrap"></th>
 </tr>
 </thead>
 <tbody class="divide-y divide-gray-50/50">
 <tr v-for="report in filteredReports" :key="report._id" class="hover:bg-gray-50/80 transition-colors group cursor-pointer" @click="viewReport(report)">
 <td class="py-4 px-2">
 <span class="text-xs font-bold text-parentPrimary ">#{{ report._id.slice(-6) }}</span>
 </td>
 <td class="py-4 px-2 min-w-[200px]">
 <div class="flex items-center gap-3">
 <div class="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-[11px] font-bold shadow-sm flex-shrink-0">
 {{ report.reporter?.name?.charAt(0) || 'U' }}
 </div>
 <div>
 <p class="text-[13px] font-medium text-gray-900 leading-tight">{{ report.reporter?.name || 'Unknown' }}</p>
 </div>
 </div>
 </td>
 <td class="py-4 px-2 truncate max-w-[200px]">
 <p class="text-[13px] font-medium text-gray-700 truncate">{{ report.subject }}</p>
 </td>
 <td class="py-4 px-2">
 <p class="text-xs font-medium text-gray-900">{{ new Date(report.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}</p>
 </td>
 <td class="py-4 px-2">
 <span :class="statusBadge(report.status)" class="text-[11px] font-bold capitalize px-2.5 py-1 rounded-md border">
 {{ report.status }}
 </span>
 </td>
 <td class="py-4 px-2 text-right">
 <ChevronRight class="w-4 h-4 text-gray-300 group-hover:text-gray-600 transition-colors inline-block" />
 </td>
 </tr>
 </tbody>
 </table>
 </div>
 </div>

 <!-- SideDrawer for Report Details -->
 <SideDrawer :isOpen="!!selectedReport" @close="selectedReport = null">
 <template v-if="selectedReport">
 <div class="flex flex-col items-center justify-center py-6 border-b border-gray-100">
 <div class="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 border border-rose-100 shadow-sm mb-3">
 <AlertTriangle class="w-8 h-8" />
 </div>
 <h3 class="text-lg font-bold text-gray-900 text-center px-4">{{ selectedReport.subject }}</h3>
 
 <div class="flex flex-col items-center justify-center w-full mt-6 bg-gray-50 p-6 rounded-xl border border-gray-100/50">
 <span :class="statusBadge(selectedReport.status)" class="text-[11px] font-bold tracking-widest px-3 py-1.5 rounded-full border mb-3">
 {{ selectedReport.status }}
 </span>
 <p class="text-[10px] text-gray-400 font-bold tracking-wider">Ticket #{{ selectedReport._id.slice(-6).toUpperCase() }}</p>
 <p class="text-xs text-gray-500 font-medium mt-1">Submitted on {{ new Date(selectedReport.createdAt).toLocaleString() }}</p>
 </div>
 </div>

 <div class="py-6 space-y-6">
 <div class="grid grid-cols-2 gap-4">
 <div class="bg-gray-50 p-4 rounded-2xl border border-gray-100">
 <p class="text-[10px] font-bold tracking-widest text-gray-400 mb-2">Reporter</p>
 <div class="flex items-center gap-2 mb-1">
 <div class="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center text-white text-[9px] font-bold shadow-sm">
 {{ selectedReport.reporter?.name?.charAt(0) || 'U' }}
 </div>
 <p class="text-xs font-bold text-gray-900 truncate">{{ selectedReport.reporter?.name }}</p>
 </div>
 <p class="text-[10px] text-gray-500 truncate ml-8">{{ selectedReport.reporter?.email }}</p>
 </div>
 
 <div class="bg-gray-50 p-4 rounded-2xl border border-gray-100" v-if="selectedReport.orderId">
 <p class="text-[10px] font-bold tracking-widest text-gray-400 mb-2">Related Order</p>
 <p class="text-sm font-bold text-parentPrimary mb-1">#{{ selectedReport.orderId.slice(-8).toUpperCase() }}</p>
 <p class="text-[10px] text-gray-500 font-medium cursor-pointer hover:underline mb-1">View Transation</p>
 </div>
 </div>

 <div>
 <h4 class="text-[10px] font-bold tracking-widest text-gray-400 mb-2">Description</h4>
 <div class="bg-white p-4 rounded-2xl border border-gray-100 text-sm font-medium text-gray-700 leading-relaxed shadow-sm">
 {{ selectedReport.description }}
 </div>
 </div>

 <div class="pt-6 border-t border-gray-100">
 <h4 class="text-[10px] font-bold tracking-widest text-gray-400 mb-4">Resolution Note</h4>
 <textarea 
 v-model="adminNote" 
 rows="3" 
 class="w-full p-4 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-parentPrimary/20 focus:bg-white transition-colors" 
 placeholder="Add internal resolution note or response..."
 ></textarea>
 
 <div class="flex gap-3 mt-4">
 <button @click="updateStatus('resolved')" class="flex-1 py-3 px-4 rounded-xl text-white font-bold text-sm bg-emerald-500 hover:bg-emerald-600 transition-colors shadow-sm">Resolve & Close</button>
 <button @click="updateStatus('rejected')" class="flex-1 py-3 px-4 rounded-xl text-rose-500 font-bold text-sm bg-rose-50 hover:bg-rose-100 transition-colors border border-rose-100">Reject Ticket</button>
 </div>
 </div>
 </div>
 </template>
 </SideDrawer>
 </div>
</template>

<script setup lang="ts">
import { X, Search, ListFilter, ChevronRight, Copy, AlertTriangle } from 'lucide-vue-next';
import { ref, computed, onMounted } from 'vue';
import SideDrawer from '@/components/ui/SideDrawer.vue';
import EmptyState from '@/components/core/EmptyState.vue';

import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';

const reports = ref<any[]>([]);
const statusFilter = ref('all');
const selectedReport = ref<any>(null);
const adminNote = ref('');

const searchQuery = ref('');

const filteredReports = computed(() => {
 let list = reports.value;
 if (statusFilter.value !== 'all') {
 list = list.filter(r => r.status === statusFilter.value);
 }
 if (searchQuery.value) {
 const q = searchQuery.value.toLowerCase();
 list = list.filter(r => 
 r._id.toLowerCase().includes(q) || 
 r.subject?.toLowerCase().includes(q) ||
 r.reporter?.name?.toLowerCase().includes(q)
 );
 }
 return list;
});

const statusBadge = (status: string) => {
 if (status === 'pending') return 'bg-orange-50 text-orange-600 border-orange-100';
 if (status === 'resolved') return 'bg-emerald-50 text-emerald-600 border-emerald-100';
 if (status === 'rejected') return 'bg-rose-50 text-rose-600 border-rose-100';
 return 'bg-gray-50 text-gray-600 border-gray-100';
};

const viewReport = (report: any) => {
 selectedReport.value = report;
 adminNote.value = report.adminNote || '';
};

const updateStatus = async (status: string) => {
 try {
 const res = await api.put(`/reports/${selectedReport.value._id}/status`, {
 status,
 adminNote: adminNote.value
 });
 // Update local list
 const index = reports.value.findIndex(r => r._id === selectedReport.value._id);
 if (index !== -1) reports.value[index] = res.data;
 selectedReport.value = null;
 } catch (e) { console.error(e); }
};

onMounted(async () => {
 try {
 const res = await api.get('/reports');
 reports.value = res.data;
 } catch (e) { console.error(e); }
});

useHead({ title: 'Manage Reports - Admin Board' });

definePageMeta({
 layout: 'admin'
});
</script>

