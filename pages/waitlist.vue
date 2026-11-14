<template>
  <div class="container mx-auto space-y-6 pb-20 font-sans animate-fade-in">
    <div class="flex flex-col justify-between gap-4 pb-2 md:flex-row md:items-end">
      <div class="space-y-1">
        <h1 class="font-heading text-2xl font-bold tracking-tight text-gray-900">Waitlist Analytics</h1>
        <p class="text-sm font-medium text-gray-500">
          Every waitlist form across the platform, with how many people opened it and how many joined.
        </p>
      </div>
      <button
        type="button"
        class="flex cursor-pointer items-center gap-1.5 rounded-xl bg-gray-100 px-3.5 py-2.5 text-xs font-bold text-gray-700 transition hover:bg-gray-200"
        @click="load"
      >
        <RefreshCw class="h-3.5 w-3.5" :class="{ 'animate-spin': loading }" />
        Refresh
      </button>
    </div>

    <!-- Totals -->
    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="card in cards" :key="card.label" class="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <p class="text-[10px] font-black uppercase tracking-wider text-gray-400">{{ card.label }}</p>
        <p class="mt-1 text-2xl font-black text-gray-900">{{ card.value }}</p>
        <p class="text-[11px] text-gray-500">{{ card.hint }}</p>
      </div>
    </div>

    <!-- Chart -->
    <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-sm font-black text-gray-900">Views against responses</h2>
          <p class="text-[11px] text-gray-500">Bar height is views; the filled part is people who actually joined.</p>
        </div>
      </div>

      <div v-if="!rows.length" class="py-10 text-center text-xs text-gray-400">Nothing to show yet.</div>

      <div v-else class="mt-5 flex h-48 items-end gap-2 overflow-x-auto">
        <div v-for="r in chartRows" :key="'bar-' + r.formId" class="flex min-w-[52px] flex-1 flex-col items-center justify-end gap-1">
          <div class="relative flex w-full max-w-[46px] flex-col justify-end" :style="{ height: '150px' }">
            <div class="w-full rounded-t-md bg-gray-100" :style="{ height: barHeight(r.views) }">
              <div class="absolute bottom-0 w-full rounded-t-md bg-[#FF5C1A]" :style="{ height: barHeight(r.responses) }" />
            </div>
          </div>
          <p class="w-full truncate text-center text-[9px] font-bold text-gray-500" :title="r.title">{{ shortTitle(r.title) }}</p>
        </div>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="border-b border-gray-100 bg-gray-50/70">
            <tr class="text-[10px] font-black uppercase tracking-wider text-gray-500">
              <th class="px-4 py-3">Store</th>
              <th class="px-4 py-3">Form</th>
              <th class="px-4 py-3 text-right">Views</th>
              <th class="px-4 py-3 text-right">Responses</th>
              <th class="px-4 py-3 text-right">Conversion</th>
              <th class="px-4 py-3">Last view</th>
              <th class="px-4 py-3">State</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in rows" :key="r.formId" class="border-b border-gray-50 last:border-0 hover:bg-gray-50/60">
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <div class="h-7 w-7 overflow-hidden rounded-lg bg-gray-100">
                    <img v-if="r.logo" :src="r.logo" class="h-full w-full object-cover" />
                  </div>
                  <span class="truncate font-bold text-gray-900">{{ r.storeName }}</span>
                </div>
              </td>
              <td class="max-w-[260px] truncate px-4 py-3 text-gray-700" :title="r.title">{{ r.title }}</td>
              <td class="px-4 py-3 text-right font-bold text-gray-900">{{ r.views.toLocaleString() }}</td>
              <td class="px-4 py-3 text-right font-bold text-gray-900">{{ r.responses.toLocaleString() }}</td>
              <td class="px-4 py-3 text-right">
                <span
                  class="rounded-full px-2 py-0.5 text-[10px] font-bold"
                  :class="r.conversion >= 20 ? 'bg-emerald-50 text-emerald-700' : r.conversion >= 10 ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-600'"
                >
                  {{ r.views ? r.conversion + '%' : '—' }}
                </span>
              </td>
              <td class="whitespace-nowrap px-4 py-3 text-gray-500">{{ r.lastViewedAt ? timeAgo(r.lastViewedAt) : 'never' }}</td>
              <td class="px-4 py-3">
                <span
                  class="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase"
                  :class="r.isPublished ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'"
                >
                  {{ r.isPublished ? 'published' : 'closed' }}
                </span>
              </td>
            </tr>
            <tr v-if="!rows.length && !loading">
              <td colspan="7" class="px-4 py-10 text-center text-xs text-gray-400">No waitlist forms yet.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { RefreshCw } from 'lucide-vue-next';
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';
import { useCustomToast } from '@/composables/core/useCustomToast';

definePageMeta({ layout: 'admin' });

const { showToast } = useCustomToast();

const loading = ref(false);
const rows = ref<any[]>([]);
const totals = ref({ views: 0, responses: 0, forms: 0, conversion: 0 });

const cards = computed(() => [
  { label: 'Forms', value: totals.value.forms, hint: 'across all stores' },
  { label: 'Views', value: totals.value.views.toLocaleString(), hint: 'times a form was opened' },
  { label: 'Responses', value: totals.value.responses.toLocaleString(), hint: 'people who joined' },
  { label: 'Conversion', value: totals.value.views ? totals.value.conversion + '%' : '—', hint: 'views that became responses' },
]);

// Only the busiest forms fit in a readable chart; the table carries the rest.
const chartRows = computed(() => [...rows.value].sort((a, b) => b.views - a.views).slice(0, 12));

const maxViews = computed(() => Math.max(1, ...chartRows.value.map((r: any) => r.views)));

const barHeight = (value: number) => `${Math.max(2, Math.round((value / maxViews.value) * 150))}px`;

const shortTitle = (t: string) => (t || '').length > 12 ? (t || '').slice(0, 11) + '…' : (t || '');

const timeAgo = (stamp: string) => {
  const m = Math.floor((Date.now() - new Date(stamp).getTime()) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  return h < 24 ? `${h}h ago` : `${Math.floor(h / 24)}d ago`;
};

const load = async () => {
  loading.value = true;
  try {
    const res = await api.get('/admin/waitlist/overview');
    rows.value = res.data?.rows || [];
    totals.value = res.data?.totals || { views: 0, responses: 0, forms: 0, conversion: 0 };
  } catch (e: any) {
    showToast({ title: 'Error', message: e?.response?.data?.message || 'Could not load analytics', toastType: 'error' } as any);
  } finally {
    loading.value = false;
  }
};

onMounted(load);
</script>
