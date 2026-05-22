<template>
  <div class="min-h-screen w-full bg-white flex items-center justify-center p-6 relative overflow-hidden">
    <!-- Pure White Background -->
    <div class="w-full max-w-[420px] relative z-10">
      <!-- Main Content -->
      <div class="w-full">
        <!-- Header -->
        <div class="text-center mb-10">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-[1.5rem] bg-gray-900/10 text-gray-900 mb-6 shadow-inner border border-gray-200">
            <ShieldCheck class="w-8 h-8" />
          </div>
          <h1 class="text-3xl font-black text-gray-900 tracking-tight mb-2">Admin Login</h1>
          <p class="text-gray-500 font-medium text-sm">Access the Errandr operations dashboard</p>
          <div class="flex items-center justify-center gap-2 mt-4 text-emerald-600 text-sm font-bold bg-emerald-50 py-1 px-3 rounded-full border border-emerald-100 max-w-max mx-auto">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            System Operational
          </div>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <UiAnimatedInput 
            v-model="email" 
            type="email" 
            label="Admin Email" 
            :hasError="!!validationErrors.email"
            :errorMessage="validationErrors.email"
            @input="validationErrors.email = ''" 
          />
          
          <UiAnimatedInput 
            v-model="password" 
            type="password" 
            label="Password" 
            :hasError="!!validationErrors.password"
            :errorMessage="validationErrors.password"
            @input="validationErrors.password = ''" 
          />

          <transition name="fade">
            <div v-if="error" class="flex items-center gap-2 p-4 bg-red-50 border border-red-100 rounded-2xl text-[13px] font-bold text-red-600">
              <AlertCircle class="w-4 h-4 shrink-0" />
              {{ error }}
            </div>
          </transition>

          <button type="submit" :disabled="loading"
            class="w-full py-4 bg-gray-900 hover:bg-black text-white rounded-2xl font-black text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-xl shadow-gray-900/20 group active:scale-[0.98]">
            <Loader2 v-if="loading" class="animate-spin w-5 h-5" />
            <span v-else>Secure Login</span>
            <Lock v-if="!loading" class="w-4 h-4 group-hover:text-emerald-400 transition-colors" />
          </button>
        </form>

        <!-- Footer -->
        <div class="mt-10 text-center pt-8 border-t border-gray-200">
          <p class="text-xs font-mono text-gray-400 font-medium uppercase tracking-wider">
            Authorized personnel only. Sessions are monitored.
          </p>
        </div>
      </div>
      
      <div class="mt-8 text-center flex items-center justify-center gap-4 text-sm font-bold text-gray-400">
        <p>&copy; {{ new Date().getFullYear() }} Errandr Ops</p>
        <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
        <span>Confidential</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ShieldCheck, Lock, Loader2, AlertCircle } from 'lucide-vue-next'
import { useAuth } from '@/composables/modules/auth'
import { useUser } from '@/composables/modules/auth/user'

definePageMeta({ layout: false })
useHead({ title: 'Admin Login - Errandr Ops' })

const { login, loading } = useAuth()
const { isLoggedIn } = useUser()
const email = ref('')
const password = ref('')
const error = ref('')

onMounted(() => {
  if (isLoggedIn.value) {
    navigateTo('/dashboard')
  }
})

const validationErrors = reactive({
  email: '',
  password: ''
})

const validate = () => {
  let isValid = true
  validationErrors.email = ''
  validationErrors.password = ''

  if (!email.value) {
    validationErrors.email = 'Email address is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    validationErrors.email = 'Please enter a valid email'
    isValid = false
  }

  if (!password.value) {
    validationErrors.password = 'Password is required'
    isValid = false
  }

  return isValid
}

const handleLogin = async () => {
  error.value = ''
  if (!validate()) return

  try { 
    await login({ email: email.value, password: password.value }) 
  }
  catch (e: any) { 
    error.value = e.data?.message || e.response?.data?.message || 'Invalid credentials' 
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
