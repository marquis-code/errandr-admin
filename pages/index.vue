<template>
  <div class="min-h-screen bg-gray-50 font-sans text-gray-900 scroll-smooth selection:bg-parentPrimary/30">
    <!-- Navbar -->
    <nav class="fixed w-full z-50 bg-gray-50/90 backdrop-blur-md border-b border-gray-200 transition-all duration-300" :class="{'py-4': !scrolled, 'py-3 shadow-sm': scrolled}">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-2">
            <div class="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-sm border border-gray-700">
              <ShieldCheck class="w-5 h-5 text-emerald-400" />
            </div>
            <span class="text-2xl font-black text-gray-900 tracking-tighter">Errandr <span class="text-gray-400 font-medium text-lg ml-1">Admin Ops</span></span>
          </div>
          
          <div class="hidden md:flex items-center gap-8">
            <a href="#systems" class="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">Core Systems</a>
            <a href="#security" class="text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">Security</a>
          </div>

          <div class="flex items-center gap-4">
            <NuxtLink to="/auth/login" class="px-6 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2">
              <Lock class="w-4 h-4 text-gray-400" /> Secure Login
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white border-b border-gray-200">
      <!-- High-tech abstract grid background -->
      <div class="absolute inset-0 z-0 opacity-[0.03]" style="background-image: radial-gradient(circle at 1px 1px, black 1px, transparent 0); background-size: 32px 32px;"></div>
      <div class="absolute inset-0 z-0">
        <div class="absolute top-1/4 right-0 w-[600px] h-[600px] bg-parentPrimary/10 rounded-full blur-[100px] translate-x-1/2"></div>
      </div>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold uppercase tracking-widest mb-8 shadow-sm">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          System Operational
        </div>
        <h1 class="text-5xl lg:text-7xl font-black tracking-tighter leading-[1.1] mb-6 text-gray-900 max-w-4xl mx-auto">
          Central Command for the <br />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500">Errandr Ecosystem.</span>
        </h1>
        <p class="text-xl text-gray-500 font-medium mb-10 leading-relaxed max-w-2xl mx-auto">
          Monitor real-time network activity, manage vendors and riders, and access high-level analytics from a single, secure control panel.
        </p>
        
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <NuxtLink to="/auth/login" class="w-full sm:w-auto px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg shadow-xl hover:-translate-y-1 hover:shadow-2xl hover:bg-black transition-all flex items-center justify-center gap-2 group">
            <Terminal class="w-5 h-5 text-emerald-400" />
            Launch Dashboard
          </NuxtLink>
          <a href="#systems" class="w-full sm:w-auto px-8 py-4 bg-white border border-gray-200 text-gray-700 rounded-2xl font-bold text-lg shadow-sm hover:border-gray-300 transition-all text-center flex items-center justify-center gap-2">
            <Activity class="w-5 h-5 text-gray-400" />
            View Status
          </a>
        </div>
        
        <div class="mt-16 relative max-w-5xl mx-auto">
           <div class="absolute -inset-1 bg-gradient-to-b from-gray-200 to-transparent rounded-t-[2.5rem] blur-sm opacity-50"></div>
           <div class="relative bg-white border-t border-x border-gray-200 rounded-t-[2rem] p-2 shadow-2xl overflow-hidden pt-4 pb-0 h-48 md:h-80 lg:h-[400px]">
              <div class="absolute top-3 left-4 flex gap-1.5 z-20">
                 <div class="w-3 h-3 rounded-full bg-red-400"></div>
                 <div class="w-3 h-3 rounded-full bg-amber-400"></div>
                 <div class="w-3 h-3 rounded-full bg-emerald-400"></div>
              </div>
              <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop" class="w-full h-full object-cover rounded-t-xl object-top border border-gray-100" />
           </div>
        </div>
      </div>
    </section>

    <!-- Core Systems Grid -->
    <section id="systems" class="py-24 bg-gray-50 border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between mb-16">
          <div>
            <h2 class="text-3xl font-black text-gray-900 tracking-tight">System Modules</h2>
            <p class="text-gray-500 font-medium mt-2">Comprehensive control over all moving parts.</p>
          </div>
          <div class="hidden sm:flex items-center gap-2 text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
            <CheckCircle2 class="w-4 h-4" /> All Systems Go
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 hover:border-parentPrimary/50 transition-colors group">
            <div class="w-12 h-12 bg-parentPrimary/10 rounded-xl flex items-center justify-center text-parentPrimary mb-4 group-hover:scale-110 transition-transform">
              <Users class="w-6 h-6" />
            </div>
            <h3 class="font-bold text-gray-900 mb-2">User Directory</h3>
            <p class="text-sm text-gray-500 leading-relaxed">Manage students, verify IDs, handle bans, and review support tickets instantaneously.</p>
          </div>

          <div class="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 hover:border-emerald-500/50 transition-colors group">
            <div class="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
              <Store class="w-6 h-6" />
            </div>
            <h3 class="font-bold text-gray-900 mb-2">Vendor Ops</h3>
            <p class="text-sm text-gray-500 leading-relaxed">Approve new store applications, monitor active menus, and oversee payouts and balances.</p>
          </div>

          <div class="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 hover:border-amber-500/50 transition-colors group">
            <div class="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 mb-4 group-hover:scale-110 transition-transform">
              <Bike class="w-6 h-6" />
            </div>
            <h3 class="font-bold text-gray-900 mb-2">Logistics Control</h3>
            <p class="text-sm text-gray-500 leading-relaxed">Live map tracking, rider onboarding, dispute resolution, and delivery fleet optimization.</p>
          </div>

          <div class="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 hover:border-purple-500/50 transition-colors group">
            <div class="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition-transform">
              <LineChart class="w-6 h-6" />
            </div>
            <h3 class="font-bold text-gray-900 mb-2">Analytics & Auth</h3>
            <p class="text-sm text-gray-500 leading-relaxed">Financial reporting, total GMV tracking, and RBAC implementation for staff permissions.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Security Section -->
    <section id="security" class="py-24 bg-white relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div class="relative order-2 lg:order-1">
             <div class="absolute inset-0 bg-gray-900 rounded-[3rem] transform -rotate-3 blur-[2px] opacity-10"></div>
             <div class="relative bg-gray-900 p-8 rounded-[3rem] text-white shadow-2xl border border-gray-800">
               <div class="flex items-center justify-between mb-8 pb-8 border-b border-gray-800">
                 <div class="flex items-center gap-3">
                   <div class="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                      <Lock class="w-5 h-5 text-gray-400" />
                   </div>
                   <div>
                     <p class="font-bold">Security Audit Log</p>
                     <p class="text-xs text-emerald-400 font-mono">Real-time encryption</p>
                   </div>
                 </div>
                 <Server class="w-6 h-6 text-gray-600" />
               </div>
               
               <div class="space-y-4 font-mono text-xs">
                 <div class="flex items-center gap-3 text-emerald-400">
                   <span>[10:42:01]</span>
                   <span>Access Granted:</span>
                   <span>SuperAdmin_1</span>
                 </div>
                 <div class="flex items-center gap-3 text-gray-400">
                   <span>[10:41:55]</span>
                   <span>Data Backup:</span>
                   <span>Completed 120GB</span>
                 </div>
                 <div class="flex items-center gap-3 text-amber-400">
                   <span>[10:40:12]</span>
                   <span>Rate Limit Warn:</span>
                   <span>IP 192.168.1.1</span>
                 </div>
                 <div class="flex items-center gap-3 text-gray-400 opacity-50">
                   <span>[10:39:44]</span>
                   <span>Payout Sync:</span>
                   <span>Success (542 records)</span>
                 </div>
               </div>
             </div>
          </div>
          
          <div class="order-1 lg:order-2">
            <h2 class="text-4xl font-black text-gray-900 tracking-tight mb-6">Bank-Grade Security,<br/>Built In.</h2>
            <p class="text-lg text-gray-500 font-medium mb-8 leading-relaxed">
              We take platform integrity seriously. All internal tools are guarded behind strict Role-Based Access Controls (RBAC) and monitored via an immutable audit ledger.
            </p>
            <ul class="space-y-4 text-gray-700 font-medium">
              <li class="flex items-center gap-3"><CheckSquare class="w-5 h-5 text-emerald-500" /> End-to-end data encryption</li>
              <li class="flex items-center gap-3"><CheckSquare class="w-5 h-5 text-emerald-500" /> Strict IP whitelisting capabilities</li>
              <li class="flex items-center gap-3"><CheckSquare class="w-5 h-5 text-emerald-500" /> Mandated Multi-Factor Authentication (MFA)</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-100 py-12 border-t border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center shadow-lg border border-gray-800">
            <ShieldCheck class="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <span class="font-black text-gray-900 tracking-tighter block leading-tight">Errandr Ops</span>
            <span class="text-xs text-gray-500 font-medium uppercase tracking-widest">Confidential</span>
          </div>
        </div>
        
        <div class="flex items-center gap-6">
          <NuxtLink to="/about" class="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">About Staff</NuxtLink>
          <NuxtLink to="/contact" class="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">Internal Directory</NuxtLink>
          <NuxtLink to="/faq" class="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">Admin Docs</NuxtLink>
          <NuxtLink to="/terms" class="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">Security Policy</NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { 
  ShieldCheck, Lock, Terminal, Activity, CheckCircle2,
  Users, Store, Bike, LineChart, Server, CheckSquare
} from 'lucide-vue-next'

definePageMeta({
  layout: false
})

useHead({
  title: 'Errandr Admin | Operations Control Center',
  meta: [
    { name: 'description', content: 'Central command for the Errandr ecosystem. Authorized personnel only.' }
  ]
})

const scrolled = ref(false)

const handleScroll = () => {
  scrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
