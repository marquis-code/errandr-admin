<template>
  <div class="flex flex-col items-center justify-center py-20 px-6 text-center animate-fade-in w-full h-[60vh] min-h-[400px]">
    <div class="w-14 h-14 mb-5 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-500 border border-gray-100 shadow-sm">
      <slot name="icon">
        <span v-if="!$slots.icon" class="text-xl">{{ icon || '📋' }}</span>
      </slot>
    </div>
    <h3 class="text-base font-bold text-gray-900 mb-2 tracking-tight">{{ title }}</h3>
    <p class="text-gray-500 max-w-[280px] mx-auto mb-8 text-[13px] leading-relaxed font-medium">
      {{ description }}
    </p>
    <button v-if="actionLabel" @click="$emit('action')" class="px-6 py-2.5 rounded-full bg-parentPrimary hover:bg-parentPrimary/90 text-white font-medium text-sm transition-all shadow-sm active:scale-95">
      {{ actionLabel }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon?: string;
  title: string;
  description: string;
  actionLabel?: string;
}>();

defineEmits(['action']);
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
