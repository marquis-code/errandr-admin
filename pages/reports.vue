<template>
 <div class="space-y-12 animate-fade-in max-w-7xl mx-auto pb-20">
 <!-- Header Strategy -->
 <div class="flex flex-col md:flex-row md:items-end justify-between gap-10">
 <div class="space-y-2">
 <h1 class="text-4xl font-black text-gray-900 tracking-tighter font-display text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-[#065fdb] to-indigo-600">Intelligence & Reports</h1>
 <p class="text-xs font-bold text-gray-400 tracking-[0.2em] leading-none">Monitor platform health index and orchestrate dispute resolutions.</p>
 </div>

 <div class="flex items-center gap-2 p-1.5 bg-white border border-gray-100 rounded-[1.75rem] shadow-sm overflow-x-auto max-w-full">
 <button
 v-for="tab in tabs"
 :key="tab.key"
 @click="activeTab = tab.key"
 class="text-[10px] py-3 px-6 rounded-2xl transition-all font-black tracking-[0.2em] whitespace-nowrap"
 :class="activeTab === tab.key ? 'bg-[#065fdb] text-white shadow-xl shadow-[#065fdb]/20' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'"
 >
 {{ tab.label }}
 </button>
 </div>
 </div>

 <!-- Loading State -->
 <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 gap-8">
 <div v-for="i in 4" :key="i" class="bg-white rounded-[2.5rem] p-10 border border-gray-100 animate-pulse h-56" />
 </div>

 <!-- Content Architecture -->
 <div v-else-if="filteredReports.length === 0" class="py-40 bg-white rounded-[3rem] border border-gray-50 shadow-sm">
 <EmptyState 
 title="Operational Integrity Maintained" 
 :description="`No active ${activeTab === 'all' ? '' : activeTab} reports require intervention at this timestamp.`"
 />
 </div>

 <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-8">
 <div
 v-for="report in filteredReports"
 :key="report._id"
 class="bg-white rounded-[2.5rem] p-10 border border-gray-50 shadow-sm hover:shadow-2xl hover:shadow-[#065fdb]/5 transition-all duration-500 cursor-pointer group relative overflow-hidden flex flex-col border-l-4"
 :style="{ borderLeftColor: getCatColor(report.category) }"
 @click="selectedReport = report"
 >
 <!-- Status Indicator -->
 <div class="absolute top-8 right-8">
 <StatusBadge :status="report.status" class="scale-100" />
 </div>

 <div class="flex items-start gap-6 mb-8 mt-2">
 <div class="w-16 h-16 rounded-[1.5rem] bg-gray-50 flex items-center justify-center text-3xl shadow-inner border border-gray-100 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shrink-0">
 {{ catEmoji(report.category) }}
 </div>
 <div class="min-w-0 flex-1 pt-1">
 <p class="text-[9px] font-black tracking-[0.3em] mb-1" :style="{ color: getCatColor(report.category) }">{{ report.category?.replace('_', ' ') }}</p>
 <h3 class="font-black text-gray-900 text-xl tracking-tighter pr-20 leading-none truncate group-hover:text-[#065fdb] transition-colors">{{ report.title }}</h3>
 </div>
 </div>
 
 <p class="text-xs text-gray-500 line-clamp-2 mb-8 font-bold leading-relaxed flex-1 opacity-80 tracking-tight">{{ report.description }}</p>
 
 <div class="flex items-center justify-between pt-8 border-t border-gray-50">
 <div class="flex items-center gap-3">
 <div class="w-8 h-8 rounded-xl bg-[#065fdb]/10 flex items-center justify-center text-[#065fdb] text-[10px] font-black">
 {{ report.reporter?.firstName?.[0] }}
 </div>
 <span class="text-[10px] font-black text-gray-400 tracking-widest leading-none">{{ report.reporter?.firstName }} {{ report.reporter?.lastName }}</span>
 </div>
 <div class="flex items-center gap-2 text-[10px] font-black text-gray-400 tracking-widest leading-none">
 <Clock class="w-3.5 h-3.5" />
 {{ new Date(report.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }}
 </div>
 </div>
 
 <!-- Hover Disclosure -->
 <div class="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all">
 <button class="w-10 h-10 bg-[#065fdb] rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#065fdb]/20">
 <ChevronRight class="w-5 h-5" />
 </button>
 </div>
 </div>
 </div>

 <!-- Redesigned Case Resolution Modal -->
 <Transition name="fade">
 <div v-if="selectedReport" class="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-md flex items-center justify-center p-6 transition-all" @click.self="selectedReport = null">
 <div class="bg-white rounded-[3rem] p-0 w-full max-w-2xl shadow-2xl relative animate-scale-in flex flex-col max-h-[90vh] overflow-hidden border border-gray-100">
 <!-- Modal Header -->
 <div class="p-10 border-b border-gray-50 flex items-center justify-between bg-white relative">
 <div class="absolute inset-0 bg-gradient-to-r from-gray-50/50 to-transparent pointer-events-none" />
 <div class="flex items-center gap-6 relative z-10">
 <div class="w-16 h-16 rounded-[1.75rem] bg-gray-50 flex items-center justify-center text-4xl shadow-inner border border-gray-100">
 {{ catEmoji(selectedReport.category) }}
 </div>
 <div class="space-y-1">
 <div class="flex items-center gap-3">
 <h2 class="text-2xl font-black text-gray-900 tracking-tighter font-display leading-none">{{ selectedReport.title }}</h2>
 </div>
 <p class="text-[10px] font-black text-[#065fdb] tracking-[0.3em] leading-none">{{ selectedReport.category?.replace('_', ' ') }}</p>
 </div>
 </div>
 <button @click="selectedReport = null" class="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-rose-50 hover:text-rose-500 transition-all border border-gray-100 hover:border-rose-100 active:scale-90 relative z-10">✕</button>
 </div>
 
 <!-- Modal Body -->
 <div class="overflow-y-auto p-10 space-y-10 flex-1 custom-scrollbar bg-white">
 <div class="space-y-6">
 <h4 class="text-[11px] font-black tracking-[0.3em] text-gray-400 flex items-center gap-3 leading-none">
 <div class="w-1 h-3 bg-gray-200 rounded-full"></div> Issue Documentation
 </h4>
 <div class="text-xs text-gray-700 leading-relaxed font-bold bg-gray-50/50 p-8 rounded-[2rem] border border-gray-100 shadow-inner tracking-tight">
 {{ selectedReport.description }}
 </div>
 </div>

 <div v-if="selectedReport.thread?.length" class="space-y-6">
 <h4 class="text-[11px] font-black tracking-[0.3em] text-gray-400 flex items-center gap-3 leading-none">
 <div class="w-1 h-3 bg-gray-200 rounded-full"></div> Protocol Log (History)
 </h4>
 <div class="space-y-6">
 <div v-for="msg in selectedReport.thread" :key="msg.timestamp" class="flex flex-col" :class="msg.isAdmin ? 'items-end' : 'items-start'">
 <div :class="msg.isAdmin ? 'bg-gray-900 text-white rounded-tr-none border-gray-800' : 'bg-[#065fdb]/5 text-gray-900 rounded-tl-none border-[#065fdb]/10'" class="max-w-[85%] px-6 py-4 rounded-[1.5rem] border shadow-sm">
 <p class="text-xs font-bold leading-relaxed tracking-tight">{{ msg.message }}</p>
 </div>
 <div class="flex items-center gap-2 mt-2 px-1">
 <span class="text-[9px] text-gray-400 font-black tracking-[0.2em]">{{ msg.isAdmin ? 'Command Center' : 'Node Participant' }}</span>
 <div class="w-1 h-1 rounded-full bg-gray-200" />
 <span class="text-[8px] text-gray-300 font-bold ">{{ new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}</span>
 </div>
 </div>
 </div>
 </div>
 </div>

 <!-- Admin Strategy Area -->
 <div class="p-10 bg-gray-50/50 border-t border-gray-100 space-y-6">
 <div class="relative group">
 <textarea 
 v-model="adminMessage" 
 placeholder="Declare system resolution response..." 
 class="w-full h-32 p-6 rounded-[2rem] bg-white border border-gray-100 focus:ring-4 focus:ring-[#065fdb]/5 focus:border-[#065fdb]/20 transition-all text-xs font-black resize-none tracking-tight placeholder:text-gray-300 shadow-sm" 
 />
 </div>
 <div class="flex gap-4">
 <button 
 @click="handleReply" 
 :disabled="!adminMessage.trim()"
 class="flex-1 py-5 bg-[#065fdb] text-white rounded-[1.5rem] font-black text-[11px] tracking-[0.2em] shadow-xl shadow-[#065fdb]/20 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] flex items-center justify-center gap-3"
 >
 Inject Resolution Message
 </button>
 <button 
 v-if="selectedReport.status !== 'resolved'"
 @click="handleResolve('resolved')" 
 class="px-10 py-5 bg-emerald-500 text-white rounded-[1.5rem] font-black text-[11px] tracking-[0.2em] hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/10 active:scale-[0.98]"
 >
 Finalize Case
 </button>
 </div>
 </div>
 </div>
 </div>
 </Transition>
 </div>
</template>

<script setup lang="ts">
import { useAdminReports } from '@/composables/modules/admin';
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';
import { Clock, ChevronRight } from 'lucide-vue-next';
import { onMounted, ref, computed } from 'vue';

definePageMeta({
 layout: 'admin'
})

useHead({ title: 'System Reports - Errandr Admin' });

const { reports, loading, fetchReports } = useAdminReports();
const activeTab = ref('all');
const selectedReport = ref<any>(null);
const adminMessage = ref('');

const getCatColor = (c: string) => ({ 
 food_quality: '#065fdb', 
 late_delivery: '#f59e0b', 
 wrong_order: '#ef4444', 
 rude_behavior: '#8b5cf6', 
 overcharging: '#10b981', 
 hygiene: '#ec4899' 
}[c] || '#6b7280');

const tabs = [
 { key: 'all', label: 'All Cases' },
 { key: 'pending', label: 'Open' },
 { key: 'investigating', label: 'Under Review' },
 { key: 'resolved', label: 'Resolved' },
];

const filteredReports = computed(() => {
 if (activeTab.value === 'all') return reports.value;
 return reports.value.filter((r) => r.status === activeTab.value);
});

const catEmoji = (c: string) => ({ 
 food_quality: '🍽️', 
 late_delivery: '⏰', 
 wrong_order: '❌', 
 rude_behavior: '😤', 
 overcharging: '💰', 
 hygiene: '🧹' 
}[c] || '📋');

const handleReply = async () => {
 if (!adminMessage.value.trim() || !selectedReport.value) return;
 try {
 const res = await api.post(`/reports/${selectedReport.value._id}/message`, { message: adminMessage.value });
 selectedReport.value = res.data;
 adminMessage.value = '';
 await fetchReports();
 } catch (e) {
 console.error(e);
 }
};

const handleResolve = async (status: string) => {
 try {
 await api.put(`/reports/${selectedReport.value._id}/status`, { status, adminNote: adminMessage.value });
 selectedReport.value = null;
 adminMessage.value = '';
 await fetchReports();
 } catch (e) {
 console.error(e);
 }
};

onMounted(fetchReports);
</script>

<style scoped>
.animate-fade-in {
 animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeIn {
 from { opacity: 0; transform: translateY(20px); }
 to { opacity: 1; transform: translateY(0); }
}

.animate-scale-in {
 animation: scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes scaleIn {
 from { opacity: 0; transform: scale(0.95) translateY(10px); }
 to { opacity: 1; transform: scale(1) translateY(0); }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.font-display {
 font-family: 'Roobert PRO', sans-serif;
}

.custom-scrollbar::-webkit-scrollbar {
 width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
 background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
 background: #f1f1f1;
 border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
 background: #e5e5e5;
}
</style>
