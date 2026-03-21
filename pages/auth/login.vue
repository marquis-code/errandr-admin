<template>
  <div class="min-h-screen w-full flex flex-col md:flex-row bg-white overflow-hidden">
    <!-- Left Side: Image Panel -->
    <div class="hidden md:block w-1/2 relative overflow-hidden">
      <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=1600&fit=crop" alt="Operations center analytics" class="absolute inset-0 w-full h-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-b from-gray-900/90 via-gray-900/80 to-black/90"></div>
      <div class="relative z-10 flex flex-col justify-between h-full p-12 lg:p-16">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
            <ShieldCheck class="w-5 h-5 text-emerald-400" />
          </div>
          <span class="text-xl font-black text-white tracking-tighter">Errandr <span class="text-gray-500 font-medium text-sm ml-1">Ops</span></span>
        </div>
        <div class="max-w-md">
          <h2 class="text-5xl font-black text-white leading-[1.1] tracking-tighter mb-6">Central Command.</h2>
          <p class="text-white/60 text-lg font-medium leading-relaxed font-mono">Authorized personnel only. All sessions are recorded and monitored.</p>
          <div class="flex items-center gap-2 mt-6 text-emerald-400 text-sm font-bold">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            System Operational
          </div>
        </div>
      </div>
    </div>

    <!-- Right Side: Form -->
    <div class="w-full md:w-1/2 flex flex-col justify-center px-6 sm:px-12 md:px-20 lg:px-28 py-12 relative z-10">
      <div class="mb-12">
        <div class="flex items-center gap-2 mb-8 md:hidden">
          <div class="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center"><ShieldCheck class="w-4 h-4 text-emerald-400" /></div>
          <span class="text-xl font-bold text-gray-900 tracking-tight">Errandr Ops</span>
        </div>
        <h1 class="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Admin Login</h1>
        <p class="text-gray-500 text-lg">Access the Errandr operations dashboard</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6 max-w-md">
        <UiAnimatedInput v-model="email" type="email" label="Email" required />
        <UiAnimatedInput v-model="password" type="password" label="Password" required />

        <p v-if="error" class="text-red-500 text-sm font-medium">{{ error }}</p>

        <button type="submit" :disabled="loading"
          class="w-full py-3 bg-gray-900 hover:bg-black text-white rounded-xl font-bold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md">
          <Loader2 v-if="loading" class="animate-spin w-6 h-6" />
          <Lock v-if="!loading" class="w-5 h-5 text-gray-400" />
          {{ loading ? 'Authenticating...' : 'Secure Login' }}
        </button>
      </form>

      <div class="mt-auto pt-12 flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-400 font-medium">
        <p>&copy; {{ new Date().getFullYear() }} Errandr Ops</p>
        <span>Confidential</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Loader2, ShieldCheck, Lock } from 'lucide-vue-next'
import { ref } from 'vue'
import { useAuth } from '@/composables/modules/auth'
definePageMeta({ layout: false })
const { login, loading } = useAuth()
const email = ref('')
const password = ref('')
const error = ref('')
const handleLogin = async () => {
  error.value = ''
  try { await login({ email: email.value, password: password.value }) }
  catch (e: any) { error.value = e.data?.message || 'Invalid credentials' }
}
useHead({ title: 'Admin Login - Errandr Ops' })
</script>
