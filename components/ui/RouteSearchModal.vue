<template>
  <Transition
    enter-active-class="transition ease-out duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-150"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[110] flex items-start justify-center bg-gray-900/40 backdrop-blur-sm pt-20 px-4"
      @click.self="closeModal"
    >
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 scale-95 -translate-y-4"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 -translate-y-4"
      >
        <div
          v-if="isOpen"
          class="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-gray-100"
        >
          <!-- Search Input -->
          <div class="relative border-b border-gray-100">
            <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              ref="searchInput"
              v-model="searchQuery"
              type="text"
              placeholder="Search for routes or pages..."
              class="w-full pl-12 pr-4 py-4 bg-transparent text-sm font-semibold text-gray-900 focus:outline-none placeholder:text-gray-400"
              @keydown.down.prevent="selectNext"
              @keydown.up.prevent="selectPrev"
              @keydown.enter.prevent="navigate"
              @keydown.esc.prevent="closeModal"
            />
            <button @click="closeModal" class="absolute right-4 top-1/2 -translate-y-1/2 p-1 bg-gray-100 text-gray-500 rounded-md text-[10px] font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors">
              ESC
            </button>
          </div>

          <!-- Results -->
          <div class="max-h-80 overflow-y-auto p-2" v-if="filteredRoutes.length > 0">
            <div
              v-for="(route, index) in filteredRoutes"
              :key="route.path"
              @click="navigateRoute(route.path)"
              @mouseenter="selectedIndex = index"
              class="flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-colors"
              :class="selectedIndex === index ? 'bg-gray-50 text-gray-900' : 'text-gray-600'"
            >
              <component :is="route.icon" class="w-5 h-5" :class="selectedIndex === index ? 'text-[#FF5C1A]' : 'text-gray-400'" />
              <div class="flex-1">
                <p class="text-sm font-bold">{{ route.label }}</p>
                <p class="text-[11px] font-medium text-gray-400">{{ route.path }}</p>
              </div>
              <ChevronRight v-if="selectedIndex === index" class="w-4 h-4 text-gray-400" />
            </div>
          </div>
          
          <!-- Empty State -->
          <div v-else class="px-6 py-8 text-center text-gray-500 text-sm">
            No routes found matching "<span class="font-semibold text-gray-900">{{ searchQuery }}</span>".
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { 
  Search, 
  LayoutDashboard, 
  Users, 
  Store, 
  Package, 
  Wallet, 
  FileText,
  ChevronRight
} from 'lucide-vue-next';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['close']);
const router = useRouter();

const searchInput = ref<HTMLInputElement | null>(null);
const searchQuery = ref('');
const selectedIndex = ref(0);

const routes = [
  { path: '/dashboard', label: 'Admin Overview', icon: LayoutDashboard },
  { path: '/users', label: 'User Management', icon: Users },
  { path: '/vendors', label: 'Vendor Management', icon: Store },
  { path: '/orders', label: 'Order Management', icon: Package },
  { path: '/finances', label: 'Finances & Transactions', icon: Wallet },
  { path: '/reports', label: 'Platform Reports', icon: FileText }
];

const filteredRoutes = computed(() => {
  if (!searchQuery.value) return routes;
  const q = searchQuery.value.toLowerCase();
  return routes.filter(r => 
    r.label.toLowerCase().includes(q) || r.path.toLowerCase().includes(q)
  );
});

watch(filteredRoutes, () => {
  selectedIndex.value = 0;
});

watch(() => props.isOpen, async (newVal) => {
  if (newVal) {
    searchQuery.value = '';
    selectedIndex.value = 0;
    await nextTick();
    searchInput.value?.focus();
  }
});

const selectNext = () => {
  if (selectedIndex.value < filteredRoutes.value.length - 1) {
    selectedIndex.value++;
  } else {
    selectedIndex.value = 0;
  }
};

const selectPrev = () => {
  if (selectedIndex.value > 0) {
    selectedIndex.value--;
  } else {
    selectedIndex.value = filteredRoutes.value.length - 1;
  }
};

const navigate = () => {
  if (filteredRoutes.value.length > 0) {
    navigateRoute(filteredRoutes.value[selectedIndex.value].path);
  }
};

const navigateRoute = (path: string) => {
  emit('close');
  router.push(path);
};

const closeModal = () => {
  emit('close');
};
</script>
