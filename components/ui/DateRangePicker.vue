<template>
  <div class="relative" ref="pickerContainer">
    <!-- Trigger Button -->
    <button 
      @click="isOpen = !isOpen"
      class="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm text-sm font-medium text-gray-700 min-w-[240px] justify-between"
    >
      <div class="flex items-center gap-2">
        <Calendar class="w-4 h-4 text-gray-500" />
        <span>{{ displayRange }}</span>
      </div>
      <ChevronDown class="w-4 h-4 text-gray-400" :class="{ 'rotate-180': isOpen }" />
    </button>

    <!-- Popover -->
    <div v-if="isOpen" class="absolute right-0 mt-2 bg-white border border-gray-100 shadow-2xl rounded-2xl z-50 overflow-hidden min-w-[640px] animate-in fade-in slide-in-from-top-2 p-6">
      
      <!-- Calendars Container -->
      <div class="flex gap-8">
        
        <!-- Left Calendar -->
        <div class="flex-1">
          <!-- Header -->
          <div class="flex items-center justify-between mb-4">
            <div class="font-bold text-gray-900">{{ formatMonthYear(currentMonth) }}</div>
            <div class="flex gap-1">
              <button @click="prevMonth" class="p-1 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors">
                <ChevronLeft class="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <!-- Days Header -->
          <div class="grid grid-cols-7 mb-2">
            <div v-for="day in ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']" :key="day" class="text-center text-xs font-semibold text-gray-400 py-1">
              {{ day }}
            </div>
          </div>
          
          <!-- Days Grid -->
          <div class="grid grid-cols-7 gap-y-1">
            <div v-for="(day, idx) in leftMonthDays" :key="idx" class="relative flex justify-center">
              <div v-if="day.isInRange" class="absolute inset-y-0 -mx-0.5" 
                   :class="[day.isStart ? 'left-1/2 right-0' : '', day.isEnd ? 'right-1/2 left-0' : '', !day.isStart && !day.isEnd ? 'inset-x-0 bg-blue-50' : 'bg-blue-50']">
              </div>
              <button 
                v-if="day.date"
                @click="selectDate(day.date)"
                @mouseenter="hoverDate = day.date"
                :class="[ 
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm relative z-10 transition-colors',
                  day.isCurrentMonth ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300',
                  day.isStart || day.isEnd ? 'bg-gray-900 text-white hover:bg-gray-800' : ''
                ]"
              >
                {{ day.dayNum }}
              </button>
            </div>
          </div>
        </div>

        <!-- Right Calendar -->
        <div class="flex-1">
          <!-- Header -->
          <div class="flex items-center justify-between mb-4">
            <div class="font-bold text-gray-900">{{ formatMonthYear(nextMonth) }}</div>
            <div class="flex gap-1">
              <button @click="goNextMonth" class="p-1 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors">
                <ChevronRight class="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <!-- Days Header -->
          <div class="grid grid-cols-7 mb-2">
            <div v-for="day in ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']" :key="day" class="text-center text-xs font-semibold text-gray-400 py-1">
              {{ day }}
            </div>
          </div>
          
          <!-- Days Grid -->
          <div class="grid grid-cols-7 gap-y-1">
            <div v-for="(day, idx) in rightMonthDays" :key="idx" class="relative flex justify-center">
              <div v-if="day.isInRange" class="absolute inset-y-0 -mx-0.5" 
                   :class="[day.isStart ? 'left-1/2 right-0' : '', day.isEnd ? 'right-1/2 left-0' : '', !day.isStart && !day.isEnd ? 'inset-x-0 bg-blue-50' : 'bg-blue-50']">
              </div>
              <button 
                v-if="day.date"
                @click="selectDate(day.date)"
                @mouseenter="hoverDate = day.date"
                :class="[ 
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm relative z-10 transition-colors',
                  day.isCurrentMonth ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-300',
                  day.isStart || day.isEnd ? 'bg-gray-900 text-white hover:bg-gray-800' : ''
                ]"
              >
                {{ day.dayNum }}
              </button>
            </div>
          </div>
        </div>

      </div>

      <div class="h-px bg-gray-100 w-full my-6"></div>

      <!-- Time Customization (Mock per design) -->
      <div class="flex items-center justify-between mb-4">
        <div>
          <h4 class="text-sm font-bold text-gray-900">Customize by hours</h4>
          <p class="text-xs text-gray-500">The default closing interval is set like full day</p>
        </div>
        <button class="w-10 h-6 bg-gray-900 rounded-full relative">
          <div class="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div>
        </button>
      </div>

      <!-- Footer Buttons -->
      <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
        <button @click="clearDates" class="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">Clear</button>
        <button @click="applyDates" class="px-6 py-2 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 rounded-xl transition-colors">Apply</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Calendar, ChevronDown, ChevronLeft, ChevronRight, XCircle } from 'lucide-vue-next';

const props = defineProps<{
  start: string;
  end: string;
}>();

const emit = defineEmits<{
  (e: 'update:start', val: string): void;
  (e: 'update:end', val: string): void;
}>();

const isOpen = ref(false);
const pickerContainer = ref<HTMLElement | null>(null);

const internalStart = ref<Date | null>(props.start ? new Date(props.start) : null);
const internalEnd = ref<Date | null>(props.end ? new Date(props.end) : null);
const hoverDate = ref<Date | null>(null);

// Currently viewed month (left calendar)
const currentMonth = ref(new Date());

const nextMonth = computed(() => {
  const d = new Date(currentMonth.value);
  d.setMonth(d.getMonth() + 1);
  return d;
});

const formatMonthYear = (date: Date) => {
  return date.toLocaleString('default', { month: 'long', year: 'numeric' });
};

const formatDateForDisplay = (date: Date | null) => {
  if (!date) return '';
  return date.toLocaleDateString('default', { month: 'short', day: 'numeric', year: 'numeric' });
};

const displayRange = computed(() => {
  if (internalStart.value && internalEnd.value) {
    return `${formatDateForDisplay(internalStart.value)} - ${formatDateForDisplay(internalEnd.value)}`;
  } else if (internalStart.value) {
    return formatDateForDisplay(internalStart.value);
  }
  return 'Select dates';
});

const prevMonth = () => {
  currentMonth.value = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() - 1, 1);
};

const goNextMonth = () => {
  currentMonth.value = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() + 1, 1);
};

// Generates days for a given month, accounting for padding from previous/next months to fit grid
const generateDays = (baseDate: Date) => {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  
  const days = [];
  
  // JS getDay(): Sun=0, Mon=1. We want Mon=0, Sun=6
  let startingDayOfWeek = firstDay.getDay() - 1;
  if (startingDayOfWeek === -1) startingDayOfWeek = 6;
  
  // Previous month padding
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, prevMonthLastDay - i);
    days.push(createDayObject(d, false));
  }
  
  // Current month days
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const d = new Date(year, month, i);
    days.push(createDayObject(d, true));
  }
  
  // Next month padding to complete the 6x7 grid (42 cells)
  const remainingCells = 42 - days.length;
  for (let i = 1; i <= remainingCells; i++) {
    const d = new Date(year, month + 1, i);
    days.push(createDayObject(d, false));
  }
  
  return days;
};

const isSameDay = (d1: Date | null, d2: Date | null) => {
  if (!d1 || !d2) return false;
  return d1.getDate() === d2.getDate() && 
         d1.getMonth() === d2.getMonth() && 
         d1.getFullYear() === d2.getFullYear();
};

const isDateInRange = (date: Date) => {
  if (internalStart.value && internalEnd.value) {
    return date > internalStart.value && date < internalEnd.value;
  }
  if (internalStart.value && !internalEnd.value && hoverDate.value) {
    return (date > internalStart.value && date < hoverDate.value) || 
           (date < internalStart.value && date > hoverDate.value);
  }
  return false;
};

const createDayObject = (date: Date, isCurrentMonth: boolean) => {
  const isStart = isSameDay(date, internalStart.value);
  const isEnd = isSameDay(date, internalEnd.value);
  
  return {
    date,
    dayNum: date.getDate(),
    isCurrentMonth,
    isStart,
    isEnd,
    isInRange: isStart || isEnd || isDateInRange(date)
  };
};

const leftMonthDays = computed(() => generateDays(currentMonth.value));
const rightMonthDays = computed(() => generateDays(nextMonth.value));

const selectDate = (date: Date) => {
  if (!internalStart.value || (internalStart.value && internalEnd.value)) {
    // Start new selection
    internalStart.value = date;
    internalEnd.value = null;
  } else if (internalStart.value && !internalEnd.value) {
    // Complete selection
    if (date < internalStart.value) {
      internalEnd.value = internalStart.value;
      internalStart.value = date;
    } else {
      internalEnd.value = date;
    }
  }
};

const formatDateForAPI = (date: Date | null) => {
  if (!date) return '';
  return date.toISOString().split('T')[0];
};

const applyDates = () => {
  emit('update:start', formatDateForAPI(internalStart.value));
  emit('update:end', formatDateForAPI(internalEnd.value));
  isOpen.value = false;
};

const clearDates = () => {
  internalStart.value = null;
  internalEnd.value = null;
  emit('update:start', '');
  emit('update:end', '');
};

// Close when clicking outside
const handleClickOutside = (e: MouseEvent) => {
  if (pickerContainer.value && !pickerContainer.value.contains(e.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});
onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});
</script>
