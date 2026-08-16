<template>
  <div class="bg-white p-5 rounded-xl border border-gray-100 shadow-sm w-full h-full flex flex-col">
    <div class="flex items-center justify-between mb-4 shrink-0">
      <div class="flex items-center gap-3">
        <div class="w-1.5 h-4 bg-[#FF5C1A] rounded-full"></div>
        <div>
          <h3 class="font-bold text-gray-900 text-sm">Revenue Overview</h3>
          <p class="text-xs font-medium text-gray-500">Past 30 days platform earnings</p>
        </div>
      </div>
      <div class="text-xs font-semibold text-[#FF5C1A] bg-[#FF5C1A]/10 px-3 py-1.5 rounded-lg border border-[#FF5C1A]/20">
        Last 30 Days
      </div>
    </div>
    
    <div class="flex-1 min-h-[300px] w-full">
      <ClientOnly>
        <apexchart 
          type="area" 
          height="100%" 
          :options="chartOptions" 
          :series="series"
        />
        <template #fallback>
          <div class="w-full h-full flex flex-col gap-2 items-center justify-center bg-gray-50/50 rounded-xl border border-gray-100 border-dashed">
            <Loader2 class="w-6 h-6 text-[#FF5C1A] animate-spin" />
            <span class="text-xs font-medium text-gray-500">Loading chart...</span>
          </div>
        </template>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Loader2 } from 'lucide-vue-next';

const props = defineProps<{
  data: any[]
}>();

const series = computed(() => [
  {
    name: 'Revenue',
    data: (props.data || []).map(d => d.revenue || 0)
  }
]);

const chartOptions = computed(() => ({
  chart: {
    type: 'area',
    fontFamily: 'inherit',
    toolbar: { show: false },
    zoom: { enabled: false },
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 800,
      animateGradually: { enabled: true, delay: 150 },
      dynamicAnimation: { enabled: true, speed: 350 }
    }
  },
  colors: ['#FF5C1A'],
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.4,
      opacityTo: 0.05,
      stops: [0, 100]
    }
  },
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: 2.5 },
  xaxis: {
    categories: (props.data || []).map(d => {
      const date = new Date(d.date);
      return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`;
    }),
    labels: {
      style: { colors: '#9CA3AF', fontSize: '10px', fontWeight: 500 }
    },
    axisBorder: { show: false },
    axisTicks: { show: false },
    tooltip: { enabled: false }
  },
  yaxis: {
    labels: {
      formatter: (value: number) => {
        return value >= 1000 ? `₦${(value / 1000).toFixed(1)}k` : `₦${value}`;
      },
      style: { colors: '#9CA3AF', fontSize: '10px', fontWeight: 500 }
    }
  },
  grid: {
    borderColor: '#F3F4F6',
    strokeDashArray: 4,
    xaxis: { lines: { show: true } },
    yaxis: { lines: { show: true } },
    padding: { top: 0, right: 0, bottom: 0, left: 10 }
  },
  tooltip: {
    theme: 'light',
    y: { formatter: (value: number) => `₦${value.toLocaleString()}` },
    style: { fontSize: '12px', fontFamily: 'inherit' }
  }
}));
</script>
