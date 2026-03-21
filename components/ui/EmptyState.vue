<template>
  <div class="flex flex-col items-center justify-center py-20 px-6 text-center animate-fade-in group">
    <div class="w-24 h-24 mb-6 rounded-3xl bg-gray-50 flex items-center justify-center text-4xl shadow-inner group-hover:scale-110 transition-transform duration-500 grayscale opacity-40">
      {{ icon }}
    </div>
    <h3 class="text-xl font-display font-bold text-gray-900 tracking-tight mb-2">{{ title }}</h3>
    <p class="text-sm text-gray-500 max-w-xs font-medium leading-relaxed">{{ description }}</p>
    <slot name="action" />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  description?: string
  icon?: string
}>(), {
  description: "No data available at the moment. Check back later.",
  icon: "📦"
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
