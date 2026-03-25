<template>
 <FullScreenLoader />
 <div class="min-h-screen bg-[#fafafa]">
 <!-- Desktop Sidebar -->
 <aside class="hidden lg:block w-72 bg-white border-r border-gray-100 min-h-screen fixed left-0 top-0 z-50 transition-all duration-300">
 <!-- Logo Section -->
 <div class="h-20 flex items-center px-8 border-b border-gray-50/50">
  <div class="flex items-center gap-3 group cursor-pointer">
  <img src="@/assets/img/logo.png" alt="Errandr Logo" class="h-9 w-auto object-contain transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3" />
  <span class="text-xl font-black text-gray-900 tracking-tighter leading-none">Admin</span>
  </div>
 </div>
 
 <!-- User Quick Info -->
 <div class="px-6 py-8">
 <div class="p-4 bg-gray-50/50 rounded-2xl border border-gray-100/50 flex items-center gap-3 mb-6">
 <div class="w-10 h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-[#065fdb] font-bold">
 {{ userInitials }}
 </div>
 <div class="flex flex-col min-w-0">
 <span class="text-sm font-black text-gray-900 truncate">{{ userDisplayName }}</span>
 <span class="text-[10px] font-bold text-gray-400 tracking-wider">Super Administrator</span>
 </div>
 </div>

 <!-- Navigation -->
 <nav class="space-y-1.5">
 <div class="px-2 pb-2">
 <p class="text-[10px] font-black text-gray-400 tracking-[0.2em] ml-1">Main Menu</p>
 </div>
 <NuxtLink
 v-for="item in navItems"
 :key="item.path"
 :to="item.path"
 class="flex items-center px-4 py-3.5 text-sm font-bold rounded-2xl transition-all duration-300 group"
 :class="isActive(item.path) 
 ? 'bg-[#065fdb] text-white shadow-xl shadow-[#065fdb]/20 translate-x-1' 
 : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'"
 >
 <component :is="item.icon" class="w-5 h-5 mr-3 transition-transform duration-500 group-hover:scale-110" :class="isActive(item.path) ? 'text-white' : 'text-gray-400 group-hover:text-[#065fdb]'" />
 <span class="tracking-tight">{{ item.label }}</span>
 <ChevronRight v-if="isActive(item.path)" class="w-4 h-4 ml-auto opacity-50" />
 </NuxtLink>
 </nav>
 </div>

 <!-- Logout Button -->
 <div class="absolute bottom-6 left-6 right-6">
 <button
 @click="handleLogoutClick"
 class="flex items-center w-full px-5 py-4 text-sm font-black text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all duration-300 group"
 >
 <LogOut class="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
 <span class=" tracking-widest text-[11px]">Logout Session</span>
 </button>
 </div>
 </aside>

 <!-- Mobile Header -->
 <header class="lg:hidden bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
 <div class="flex items-center justify-between px-6 py-4">
 <div class="flex items-center gap-2">
 <img src="@/assets/img/logo.png" alt="Errandr Logo" class="h-8 w-auto object-contain" />
 <span class="text-xl font-black text-gray-900 tracking-tighter">Admin</span>
 </div>
 <button
 @click="showMobileMenu = !showMobileMenu"
 class="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-900 hover:bg-gray-100 transition-colors"
 >
 <Menu v-if="!showMobileMenu" class="w-6 h-6" />
 <X v-else class="w-6 h-6" />
 </button>
 </div>
 </header>

 <!-- Mobile Menu Overlay -->
 <Transition name="fade">
 <div
 v-if="showMobileMenu"
 class="lg:hidden fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40"
 @click="showMobileMenu = false"
 ></div>
 </Transition>

 <!-- Mobile Sidebar -->
 <Transition name="slide">
 <aside
 v-if="showMobileMenu"
 class="lg:hidden w-80 bg-white min-h-screen fixed left-0 top-0 z-50 shadow-2xl overflow-y-auto"
 >
 <div class="p-6 border-b border-gray-50 flex items-center justify-between">
 <div class="flex items-center gap-3">
 <img src="@/assets/img/logo.png" alt="Errandr Logo" class="h-9 w-auto object-contain" />
 <span class="text-2xl font-black text-gray-900 tracking-tighter">Admin</span>
 </div>
 <button @click="showMobileMenu = false" class="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50">
 <X class="w-5 h-5 text-gray-900" />
 </button>
 </div>

 <div class="p-6 space-y-8">
 <div class="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
 <div class="w-12 h-12 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-[#065fdb] font-bold text-lg">
 {{ userInitials }}
 </div>
 <div class="flex flex-col">
 <span class="text-base font-black text-gray-900 leading-none">{{ userDisplayName }}</span>
 <span class="text-[10px] font-bold text-gray-400 tracking-widest mt-1">Super Admin</span>
 </div>
 </div>

 <nav class="space-y-2">
 <NuxtLink
 v-for="item in navItems"
 :key="item.path"
 :to="item.path"
 class="flex items-center px-5 py-4 text-base font-bold rounded-2xl transition-all"
 :class="isActive(item.path) 
 ? 'bg-[#065fdb] text-white shadow-xl shadow-[#065fdb]/20' 
 : 'text-gray-500 hover:bg-gray-50'"
 @click="showMobileMenu = false"
 >
 <component :is="item.icon" class="w-6 h-6 mr-4" />
 {{ item.label }}
 </NuxtLink>
 </nav>
 </div>

 <div class="p-6 mt-10">
 <button @click="handleLogoutClick" class="flex items-center w-full px-5 py-4 text-base font-black text-red-500 bg-red-50 rounded-2xl transition-all">
 <LogOut class="w-6 h-6 mr-4" />
 LOGOUT SESSION
 </button>
 </div>
 </aside>
 </Transition>

 <!-- Main Content -->
 <main class="flex-1 lg:ml-72 min-h-screen">
 <!-- Page Header (Optional, used in pages) -->
 <div class="hidden lg:flex h-20 items-center justify-between px-10 border-b border-gray-50/50 bg-white/50 backdrop-blur-sm sticky top-0 z-30">
 <div class="flex items-center gap-4">
 <div class="w-1 h-8 bg-[#065fdb]/20 rounded-full"></div>
 <div>
 <h1 class="text-sm font-black text-gray-900 tracking-widest">{{ pageTitle }}</h1>
 <p class="text-[10px] font-bold text-gray-400 tracking-tight">{{ pageDescription }}</p>
 </div>
 </div>

 <div class="flex items-center gap-4">
 <!-- Potential search/notifications here -->
 <div class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors cursor-pointer">
 <span class="relative">
 <LayoutDashboard class="w-5 h-5" />
 <span class="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white"></span>
 </span>
 </div>
 </div>
 </div>

 <!-- Page Content -->
 <div class="p-6 md:p-10 max-w-7xl mx-auto">
 <slot />
 </div>
 </main>

 <Transition
 enter-active-class="transition ease-out duration-300"
 enter-from-class="opacity-0"
 enter-to-class="opacity-100"
 leave-active-class="transition ease-in duration-200"
 leave-from-class="opacity-100"
 leave-to-class="opacity-0"
>
 <div
 v-if="logoutModalOpen"
 class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
 @click.self="logoutModalOpen = false"
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
 v-if="logoutModalOpen"
 class="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 sm:p-7 flex flex-col items-center text-center space-y-5"
 >
 <!-- Icon -->
 <div class="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center">
 <LogOut class="w-7 h-7 text-rose-500" />
 </div>

 <!-- Content -->
 <div class="space-y-1">
 <h3 class="text-xl font-semibold text-gray-900">
 Leaving already?
 </h3>
 <p class="text-sm text-gray-600 leading-relaxed">
 You’ll be signed out of your account. 
 Don’t worry — your Errandr data will be waiting for you ✨
 </p>
 </div>

 <!-- Actions -->
 <div class="flex gap-3 w-full pt-2">
 <button
 @click="logoutModalOpen = false"
 class="w-full px-4 py-3 rounded-full text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
 >
 Stay logged in
 </button>

 <button
 @click="confirmLogout"
 class="w-full px-4 py-3 rounded-full text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 transition-colors"
 >
 Log out
 </button>
 </div>
 </div>
 </Transition>
 </div>
</Transition>

 </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useUser } from '@/composables/modules/auth/user'
import { useRouter, useRoute } from 'vue-router'
import { 
 LayoutDashboard, 
 Users, 
 Store, 
 Package, 
 Wallet, 
 FileText, 
 LogOut, 
 Menu, 
 X,
 ShieldCheck,
 ChevronRight
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const { user, logOut } = useUser()
const showMobileMenu = ref(false)
const logoutModalOpen = ref(false)

const navItems = [
 { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
 { path: '/users', label: 'Users', icon: Users },
 { path: '/vendors', label: 'Vendors', icon: Store },
 { path: '/orders', label: 'Orders', icon: Package },
 { path: '/finances', label: 'Finances', icon: Wallet },
 { path: '/reports', label: 'Reports', icon: FileText }
]

const pageTitles: Record<string, { title: string; description: string }> = {
 '/dashboard': { title: 'Admin Overview', description: 'Platform performance and key metrics' },
 '/users': { title: 'User Management', description: 'Manage accounts and permissions' },
 '/vendors': { title: 'Vendor Management', description: 'Manage merchants and store settings' },
 '/orders': { title: 'Order Management', description: 'Track platform-wide order fulfillment' },
 '/finances': { title: 'Financials', description: 'Transaction history and platform revenue' },
 '/reports': { title: 'Platform Reports', description: 'Analytical insights and system health' }
}

const pageTitle = computed(() => pageTitles[route.path]?.title || 'Admin Dashboard')
const pageDescription = computed(() => pageTitles[route.path]?.description || 'Welcome to Errandr Admin')

const userDisplayName = computed(() => {
 if (!user.value) return 'Admin'
 return `${user.value.firstName || ''} ${user.value.lastName || ''}`.trim() || user.value.email || 'Admin'
})

const userInitials = computed(() => {
 if (!user.value) return 'A'
 const first = user.value.firstName || ''
 const last = user.value.lastName || ''
 return (first[0] || last[0] || user.value.email?.[0] || 'A').toUpperCase()
})

const handleLogoutClick = () => {
 logoutModalOpen.value = true
}

const isActive = (path: string) => route.path === path

const confirmLogout = () => {
 if (process.client) {
 localStorage.removeItem('user')
 localStorage.removeItem('token')
 logoutModalOpen.value = false
 window.location.reload()
 }
}

watch(() => route.path, () => showMobileMenu.value = false)
</script>
<style scoped>
.overlay-enter-active,
.overlay-leave-active {
 transition: opacity 0.25s ease;
}

.overlay-enter-from,
.overlay-leave-to {
 opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
 transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-from,
.slide-leave-to {
 transform: translateX(-100%);
}
</style>
