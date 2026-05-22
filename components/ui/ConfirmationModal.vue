<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition ease-in duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      @click.self="$emit('cancel')"
    >
      <Transition
        enter-active-class="transition ease-out duration-300"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition ease-in duration-200"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="isOpen"
          class="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 flex flex-col items-center text-center space-y-4"
        >
          <div class="w-12 h-12 rounded-full flex items-center justify-center" :class="type === 'danger' ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'">
            <component :is="icon" class="w-6 h-6" />
          </div>

          <div class="space-y-1">
            <h3 class="text-lg font-bold text-gray-900">{{ title }}</h3>
            <p class="text-sm text-gray-500">{{ message }}</p>
          </div>

          <div class="flex gap-3 w-full pt-2">
            <button
              @click="$emit('cancel')"
              class="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100"
            >
              {{ cancelText }}
            </button>
            <button
              @click="$emit('confirm')"
              class="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
              :class="type === 'danger' ? 'bg-rose-500 hover:bg-rose-600' : 'bg-emerald-500 hover:bg-emerald-600'"
            >
              {{ confirmText }}
            </button>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-vue-next';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  type: {
    type: String,
    default: 'danger', // 'danger' or 'success' or 'info'
  }
});

defineEmits(['confirm', 'cancel']);

const icon = computed(() => {
  if (props.type === 'danger') return AlertTriangle;
  if (props.type === 'success') return CheckCircle;
  return Info;
});
</script>
