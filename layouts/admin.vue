<template>
 <FullScreenLoader />
 <div class="min-h-screen bg-white">
 <!-- Desktop Sidebar -->
 <aside class="hidden lg:block w-72 bg-white border-r border-gray-100 min-h-screen fixed left-0 top-0 z-50 transition-all duration-300">
 <!-- Logo Section -->
 <div class="h-20 flex items-center px-8 border-b border-gray-50/50">
  <div class="flex items-center gap-3 group cursor-pointer">
  <img src="@/assets/img/logo-light.png" alt="Errander Logo" class="h-9 w-auto object-contain transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3" />
  </div>
 </div>
 
 <!-- User Quick Info -->
 <div class="px-6 py-8">

 <!-- Navigation -->
 <nav class="space-y-1.5">
 <div class="px-2 pb-2">
 <p class="text-sm font-medium text-gray-400 tracking-[0.2em] ml-1">Main Menu</p>
 </div>
 <NuxtLink
 v-for="item in navItems"
 :key="item.path"
 :to="item.path"
 class="flex items-center px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-300 group"
 :class="isActive(item.path) 
 ? 'bg-[#FF5C1A] text-white translate-x-1' 
 : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'"
 >
 <component :is="item.icon" class="w-5 h-5 mr-3 transition-transform duration-500 group-hover:scale-110" :class="isActive(item.path) ? 'text-white' : 'text-gray-400 group-hover:text-[#FF5C1A]'" />
 <span class="tracking-tight">{{ item.label }}</span>
 <ChevronRight v-if="isActive(item.path)" class="w-4 h-4 ml-auto opacity-50" />
 </NuxtLink>
 </nav>
 </div>

 <!-- Logout Button -->
 <div class="absolute bottom-6 left-6 right-6">
 <button
 @click="handleLogoutClick"
 class="flex items-center w-full px-5 py-4 text-lg font-bold text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all duration-300 group"
 >
 <LogOut class="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform" />
 <span class="  text-[11px]">Logout</span>
 </button>
 </div>
 </aside>

 <!-- Mobile Header -->
 <header class="lg:hidden bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
 <div class="flex items-center justify-between px-6 py-4">
  <div class="flex items-center gap-3 group cursor-pointer">
  <img src="@/assets/img/logo-light.png" alt="Errander Logo" class="h-9 w-auto object-contain transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3" />
  </div>
 <button
 @click="showMobileMenu = !showMobileMenu"
 class="w-10 h-10 flex items-center justify-center rounded-xl bg-white text-gray-900 hover:bg-gray-50 transition-colors"
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
 >
 </div>
 </Transition>

 <!-- Mobile Sidebar -->
 <Transition name="slide">
 <aside
 v-if="showMobileMenu"
 class="lg:hidden w-80 bg-white min-h-screen fixed left-0 top-0 z-50 shadow-2xl overflow-y-auto"
 >
 <div class="p-6 border-b border-gray-50 flex items-center justify-between">
  <div class="flex items-center gap-3 group cursor-pointer">
  <img src="@/assets/img/logo-light.png" alt="Errander Logo" class="h-9 w-auto object-contain transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3" />
  </div>
 <button @click="showMobileMenu = false" class="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50">
 <X class="w-5 h-5 text-gray-900" />
 </button>
 </div>

 <div class="p-6 space-y-8">
 <div class="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100">
 <div class="w-12 h-12 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-[#FF5C1A] font-bold text-lg">
 {{ userInitials }}
 </div>
 <div class="flex flex-col">
 <span class="text-base font-medium text-gray-900 leading-none">{{ userDisplayName }}</span>
 <span class="text-sm font-bold text-gray-400  mt-1">Super Admin</span>
 </div>
 </div>

 <nav class="space-y-2">
 <NuxtLink
 v-for="item in navItems"
 :key="item.path"
 :to="item.path"
 class="flex items-center px-5 py-4 text-sm font-medium rounded-xl transition-all"
 :class="isActive(item.path) 
 ? 'bg-[#FF5C1A] text-white' 
 : 'text-gray-500 hover:bg-gray-50'"
 @click="showMobileMenu = false"
 >
 <component :is="item.icon" class="w-6 h-6 mr-4" />
 {{ item.label }}
 </NuxtLink>
 </nav>
 </div>

 <div class="p-6 mt-10">
 <button @click="handleLogoutClick" class="flex items-center w-full px-5 py-4 text-base font-medium text-red-500 bg-red-50 rounded-2xl transition-all">
 <LogOut class="w-6 h-6 mr-4" />
 LOGOUT SESSION
 </button>
 </div>
 </aside>
 </Transition>

 <!-- Main Content -->
 <main class="flex-1 lg:ml-72 min-h-screen">
 <!-- Page Header -->
 <div class="hidden lg:flex h-20 items-center justify-between px-10 border-b border-gray-100 bg-white sticky top-0 z-30 gap-6">
  <!-- Left: Page Title -->
  <div class="flex items-center gap-4 min-w-[200px]">
   <div class="w-1 h-8 bg-[#FF5C1A]/20 rounded-full"></div>
   <div>
    <h1 class="text-sm font-medium text-gray-900">{{ pageTitle }}</h1>
    <p class="text-xs font-bold text-gray-400 tracking-tight">{{ pageDescription }}</p>
   </div>
  </div>

  <!-- Center: Search Field -->
  <div class="flex-1 max-w-md">
   <div class="relative group">
    <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#FF5C1A] transition-colors pointer-events-none" />
    <input
     type="text"
     placeholder="Search routes... (type a page name)"
     class="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:border-[#FF5C1A]/30 focus:bg-white focus:ring-2 focus:ring-[#FF5C1A]/10 placeholder:text-gray-400 transition-all cursor-pointer"
     readonly
     @click="searchModalOpen = true"
    />
    <span class="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-300 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 tracking-widest">⌘K</span>
   </div>
  </div>

  <!-- Right: Profile -->
  <div class="flex items-center gap-3 min-w-[200px] justify-end">
   <div class="flex items-center gap-3 px-4 py-2 rounded-xl bg-gray-50 border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors">
    <div class="w-8 h-8 rounded-full bg-[#FF5C1A]/10 border border-[#FF5C1A]/20 flex items-center justify-center text-[#FF5C1A] text-sm font-medium">
     {{ userInitials }}
    </div>
    <div class="flex flex-col">
     <span class="text-xs font-medium text-gray-900 leading-none">{{ userDisplayName }}</span>
     <span class="text-[10px] font-semibold text-gray-400">Super Admin</span>
    </div>
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
 <Teleport to="body">
 <div
 v-if="logoutModalOpen"
 class="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
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
 class="bg-white rounded-2xl border border-gray-100 max-w-sm w-full p-6 sm:p-7 flex flex-col items-center text-center space-y-5"
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
 Don’t worry — your Errander data will be waiting for you ✨
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
 </Teleport>
</Transition>

  <!-- Route Search Modal -->
  <RouteSearchModal :isOpen="searchModalOpen" @close="searchModalOpen = false" />

 </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
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
 ChevronRight,
 Search,
 Settings,
 Gift,
 MessageSquare
} from 'lucide-vue-next'
import RouteSearchModal from '@/components/ui/RouteSearchModal.vue'

const route = useRoute()
const router = useRouter()
const { user, logOut } = useUser()
const showMobileMenu = ref(false)
const logoutModalOpen = ref(false)
const searchModalOpen = ref(false)

const navItems = [
 { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
 { path: '/users', label: 'Users', icon: Users },
 { path: '/vendors', label: 'Vendors', icon: Store },
 { path: '/orders', label: 'Orders', icon: Package },
 { path: '/referrals', label: 'Referrals', icon: Gift },
 { path: '/finances', label: 'Finances', icon: Wallet },
 { path: '/chats', label: 'Support Chats', icon: MessageSquare },
 { path: '/reports', label: 'Reports', icon: FileText },
 { path: '/settings', label: 'Settings', icon: Settings }
]

const pageTitles: Record<string, { title: string; description: string }> = {
 '/dashboard': { title: 'Admin Overview', description: 'Platform performance and key metrics' },
 '/users': { title: 'User Management', description: 'Manage accounts and permissions' },
 '/vendors': { title: 'Vendor Management', description: 'Manage merchants and store settings' },
 '/orders': { title: 'Order Management', description: 'Track platform-wide order fulfillment' },
 '/referrals': { title: 'Referral System', description: 'Manage ambassadors and track referral growth' },
 '/finances': { title: 'Financials', description: 'Transaction history and platform revenue' },
 '/chats': { title: 'Support Chats', description: 'Manage incoming support requests' },
 '/reports': { title: 'Platform Reports', description: 'Analytical insights and system health' },
 '/settings': { title: 'System Settings', description: 'Configure platform parameters and service fees' }
}

const pageTitle = computed(() => pageTitles[route.path]?.title || 'Admin Dashboard')
const pageDescription = computed(() => pageTitles[route.path]?.description || 'Welcome to Errander Admin')

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

const handleKeyDown = (e: KeyboardEvent) => {
 if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
  e.preventDefault()
  searchModalOpen.value = true
 }
}

onMounted(() => {
 document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
 document.removeEventListener('keydown', handleKeyDown)
})

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
