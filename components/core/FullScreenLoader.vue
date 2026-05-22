<template>
  <div v-if="loading" class="fixed inset-0 z-[9999] bg-white/80 backdrop-blur-sm flex items-center justify-center">
    <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF5C1A]"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const loading = ref(false);
</script>
