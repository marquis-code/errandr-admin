<template>
  <FullScreenLoader />
  <div class="min-h-screen bg-[#F8FAFC] font-sans selection:bg-[#FF5C1A]/20 selection:text-[#FF5C1A]">
    
    <!-- Desktop Sidebar -->
    <aside class="hidden lg:flex flex-col bg-[#0F172A] min-h-screen fixed left-0 top-0 z-50 transition-all duration-300 shadow-[4px_0_24px_rgba(0,0,0,0.05)] border-r border-white/5" :class="isSidebarMinimized ? 'w-20' : 'w-[280px]'">
      <!-- Logo Section -->
      <div class="h-20 flex items-center relative border-b border-white/10" :class="isSidebarMinimized ? 'justify-center px-0' : 'px-6'">
        <div class="flex items-center gap-3 group cursor-pointer w-full">
          <div v-if="isSidebarMinimized" class="w-10 h-10 bg-gradient-to-br from-[#FF5C1A] to-[#FF7A45] rounded-xl flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-lg shadow-[#FF5C1A]/20">E</div>
          <div v-else class="flex items-center gap-3 w-full">
            <div class="w-8 h-8 bg-gradient-to-br from-[#FF5C1A] to-[#FF7A45] rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-[#FF5C1A]/20">E</div>
            <span class="text-white font-heading font-bold text-xl tracking-tight group-hover:text-[#FF5C1A] transition-colors">Errander</span>
            <span class="ml-auto text-[9px] font-bold tracking-widest text-[#FF5C1A] bg-[#FF5C1A]/10 px-1.5 py-0.5 rounded border border-[#FF5C1A]/20 uppercase">Admin</span>
          </div>
        </div>

        <!-- Toggle Button -->
        <button 
          @click="isSidebarMinimized = !isSidebarMinimized"
          class="absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-[#1E293B] border border-white/10 rounded-full flex items-center justify-center shadow-lg text-gray-400 hover:text-white hover:border-[#FF5C1A] hover:bg-[#FF5C1A] z-50 transition-all group"
        >
          <ChevronLeft v-if="!isSidebarMinimized" class="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          <ChevronRight v-else class="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
      
      <!-- System Status (Expanded only) -->
      <div v-if="!isSidebarMinimized" class="px-6 py-4 border-b border-white/5 bg-white/[0.02]">
        <div class="flex items-center justify-between mb-2">
          <span class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">System Status</span>
          <div class="flex items-center gap-1.5 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span class="text-[9px] font-bold text-emerald-400 uppercase">Operational</span>
          </div>
        </div>
        <p class="text-[11px] text-gray-400 font-medium flex items-center gap-1.5">
          <Activity class="w-3.5 h-3.5 text-gray-500" /> API: 24ms latency
        </p>
      </div>

      <!-- Navigation -->
      <div class="flex-1 overflow-y-auto custom-scrollbar py-6" :class="isSidebarMinimized ? 'px-3' : 'px-4'">
        <nav class="space-y-1">
          <div class="px-3 mb-3 mt-2 flex items-center justify-between" v-if="!isSidebarMinimized">
            <p class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Main Menu</p>
          </div>
          <NuxtLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center py-3 text-sm font-medium rounded-xl transition-all duration-300 group relative border border-transparent"
            :class="[
              isActive(item.path) ? 'bg-gradient-to-r from-[#FF5C1A] to-[#FF7A45] text-white shadow-lg shadow-[#FF5C1A]/20' : 'text-gray-400 hover:bg-white/5 hover:text-white',
              isSidebarMinimized ? 'justify-center px-0' : 'px-4',
            ]"
            :title="isSidebarMinimized ? item.label : ''"
          >
            <component :is="item.icon" class="w-5 h-5 transition-transform duration-300 group-hover:scale-110" :class="[isActive(item.path) ? 'text-white' : 'text-gray-400 group-hover:text-white', isSidebarMinimized ? '' : 'mr-3']" />
            <span v-if="!isSidebarMinimized" class="tracking-wide">{{ item.label }}</span>
            
            <div v-if="isActive(item.path) && !isSidebarMinimized" class="ml-auto flex items-center">
               <div class="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
            </div>
            
            <!-- Tooltip for minimized -->
            <div v-if="isSidebarMinimized" class="absolute left-full ml-4 px-3 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap shadow-xl z-50 border border-gray-800">
              {{ item.label }}
              <div class="absolute top-1/2 -left-1 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-gray-900"></div>
            </div>
          </NuxtLink>
        </nav>
      </div>

      <!-- User Profile & Logout -->
      <div class="mt-auto border-t border-white/10 bg-[#0F172A] p-4">
        <div class="flex items-center justify-between mb-4 px-2" v-if="!isSidebarMinimized">
           <div class="flex items-center gap-3">
             <div class="w-9 h-9 rounded-full bg-gradient-to-br from-[#FF5C1A]/20 to-[#FF7A45]/20 border border-[#FF5C1A]/30 flex items-center justify-center text-[#FF5C1A] font-bold relative">
               {{ userInitials }}
               <div class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#0F172A]"></div>
             </div>
             <div class="flex flex-col">
               <span class="text-sm font-semibold text-white truncate max-w-[120px]">{{ userDisplayName }}</span>
               <span class="text-[10px] text-gray-400 truncate max-w-[120px]">{{ user?.email || 'admin@errander.com' }}</span>
             </div>
           </div>
           <button class="p-1.5 text-gray-400 hover:text-white bg-white/5 rounded-lg transition-colors border border-transparent hover:border-white/10" title="Settings">
             <Settings class="w-4 h-4" />
           </button>
        </div>
        
        <button
          @click="handleLogoutClick"
          class="flex items-center w-full py-3 text-sm font-semibold text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all duration-300 group border border-transparent hover:border-rose-500/20"
          :class="isSidebarMinimized ? 'justify-center px-0' : 'px-4'"
          :title="isSidebarMinimized ? 'Logout' : ''"
        >
          <LogOut class="w-4 h-4 transition-transform group-hover:-translate-x-1" :class="isSidebarMinimized ? '' : 'mr-3'" />
          <span v-if="!isSidebarMinimized">Logout Session</span>
        </button>
      </div>
    </aside>

    <!-- Mobile Header -->
    <header class="lg:hidden bg-white/80 backdrop-blur-xl border-b border-gray-200/60 sticky top-0 z-40 shadow-sm">
      <div class="flex items-center justify-between px-6 py-4">
        <div class="flex items-center gap-2 group cursor-pointer">
          <div class="w-8 h-8 bg-gradient-to-br from-[#FF5C1A] to-[#FF7A45] rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">E</div>
          <span class="text-gray-900 font-heading font-bold text-xl tracking-tight">Errander</span>
        </div>
        <button
          @click="showMobileMenu = !showMobileMenu"
          class="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-900 hover:bg-gray-100 transition-colors border border-gray-200/50"
        >
          <Menu v-if="!showMobileMenu" class="w-5 h-5" />
          <X v-else class="w-5 h-5" />
        </button>
      </div>
    </header>

    <!-- Mobile Menu Overlay -->
    <Transition name="fade">
      <div v-if="showMobileMenu" class="lg:hidden fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-40" @click="showMobileMenu = false"></div>
    </Transition>

    <!-- Mobile Sidebar -->
    <Transition name="slide">
      <aside v-if="showMobileMenu" class="lg:hidden w-[85vw] max-w-[320px] bg-[#0F172A] min-h-screen fixed left-0 top-0 z-50 shadow-2xl flex flex-col">
        <div class="p-6 border-b border-white/5 flex items-center justify-between bg-[#0F172A]">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-gradient-to-br from-[#FF5C1A] to-[#FF7A45] rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">E</div>
            <span class="text-white font-heading font-bold text-xl tracking-tight">Errander</span>
          </div>
          <button @click="showMobileMenu = false" class="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
            <X class="w-4 h-4 text-white" />
          </button>
        </div>

        <div class="p-6 flex-1 overflow-y-auto">
          <div class="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 mb-8 backdrop-blur-md">
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF5C1A]/20 to-[#FF7A45]/20 border border-[#FF5C1A]/30 flex items-center justify-center text-[#FF5C1A] font-bold text-lg relative">
              {{ userInitials }}
              <div class="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0F172A]"></div>
            </div>
            <div class="flex flex-col min-w-0">
              <span class="text-sm font-semibold text-white leading-none truncate">{{ userDisplayName }}</span>
              <span class="text-[11px] font-medium text-gray-400 mt-1.5 truncate">{{ user?.email }}</span>
            </div>
          </div>

          <nav class="space-y-1.5">
            <NuxtLink
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              class="flex items-center px-4 py-3.5 text-sm font-medium rounded-xl transition-all border border-transparent"
              :class="isActive(item.path) ? 'bg-gradient-to-r from-[#FF5C1A] to-[#FF7A45] text-white shadow-lg shadow-[#FF5C1A]/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'"
              @click="showMobileMenu = false"
            >
              <component :is="item.icon" class="w-5 h-5 mr-3" :class="isActive(item.path) ? 'text-white' : 'text-gray-400'" />
              {{ item.label }}
            </NuxtLink>
          </nav>
        </div>

        <div class="p-6 border-t border-white/5 bg-[#0F172A]">
          <button @click="handleLogoutClick" class="flex items-center justify-center w-full px-5 py-3.5 text-sm font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl transition-all hover:bg-rose-500 hover:text-white hover:shadow-lg hover:shadow-rose-500/20">
            <LogOut class="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      </aside>
    </Transition>

    <!-- Main Content -->
    <main class="flex-1 min-h-screen transition-all duration-300 flex flex-col" :class="isSidebarMinimized ? 'lg:ml-20' : 'lg:ml-[280px]'">
      <!-- Page Header -->
      <div class="hidden lg:flex h-24 items-center justify-between px-10 border-b border-gray-200/60 bg-white/80 backdrop-blur-xl sticky top-0 z-30 gap-8 shadow-sm">
        <!-- Left: Page Title & Breadcrumb -->
        <div class="flex items-center gap-5 min-w-[250px]">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF5C1A]/10 to-[#FF7A45]/5 border border-[#FF5C1A]/20 flex items-center justify-center shadow-sm">
             <component :is="currentPageIcon" class="w-6 h-6 text-[#FF5C1A]" />
          </div>
          <div>
            <div class="flex items-center gap-2 mb-1">
               <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Errander Admin</span>
               <span class="text-gray-300 text-[10px]">•</span>
               <span class="text-[10px] font-bold text-[#FF5C1A] uppercase tracking-widest">{{ new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) }}</span>
            </div>
            <h1 class="text-2xl font-bold text-gray-900 font-heading tracking-tight leading-none">{{ pageTitle }}</h1>
          </div>
        </div>

        <!-- Center: Search Field -->
        <div class="flex-1 max-w-xl">
          <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search class="w-4 h-4 text-gray-400 group-focus-within:text-[#FF5C1A] transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search anything (⌘K)"
              class="w-full pl-11 pr-14 py-3 bg-gray-50/50 border border-gray-200/80 rounded-2xl text-sm font-medium text-gray-900 focus:outline-none focus:border-[#FF5C1A]/50 focus:bg-white focus:ring-4 focus:ring-[#FF5C1A]/10 placeholder:text-gray-400 transition-all shadow-inner cursor-pointer"
              readonly
              @click="searchModalOpen = true"
            />
            <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <span class="text-[10px] font-bold text-gray-500 bg-white px-1.5 py-1 rounded border border-gray-200 shadow-sm leading-none">⌘</span>
              <span class="text-[10px] font-bold text-gray-500 bg-white px-1.5 py-1 rounded border border-gray-200 shadow-sm leading-none">K</span>
            </div>
          </div>
        </div>

        <!-- Right: Actions & Profile -->
        <div class="flex items-center gap-5 min-w-[250px] justify-end">
          <div class="flex items-center gap-3">
             <button class="relative p-2.5 rounded-xl bg-gray-50 border border-gray-200/80 text-gray-500 hover:text-[#FF5C1A] hover:border-[#FF5C1A]/30 hover:bg-orange-50 transition-all shadow-sm">
                <Bell class="w-5 h-5" />
                <span class="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
             </button>
             <button class="p-2.5 rounded-xl bg-gray-50 border border-gray-200/80 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all shadow-sm">
                <LayoutDashboard class="w-5 h-5" />
             </button>
          </div>
          
          <div class="h-8 w-px bg-gray-200"></div>

          <div class="flex items-center gap-3 cursor-pointer group px-2 py-1.5 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200/80">
            <div class="flex flex-col items-end text-right">
              <span class="text-sm font-bold text-gray-900 leading-none group-hover:text-[#FF5C1A] transition-colors">{{ userDisplayName }}</span>
              <span class="text-[11px] font-medium text-gray-500 mt-1">Super Admin</span>
            </div>
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF5C1A]/10 to-[#FF7A45]/5 border border-[#FF5C1A]/20 flex items-center justify-center text-[#FF5C1A] text-sm font-bold shadow-sm relative">
              {{ userInitials }}
              <div class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Page Content -->
      <div class="p-4 md:p-8 lg:p-10 flex-1 w-full max-w-[1600px] mx-auto overflow-x-hidden relative">
        <slot />
      </div>
    </main>

    <!-- Modals (Logout & Search) -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition ease-out duration-300"
        enter-from-class="opacity-0 backdrop-blur-none"
        enter-to-class="opacity-100 backdrop-blur-sm"
        leave-active-class="transition ease-in duration-200"
        leave-from-class="opacity-100 backdrop-blur-sm"
        leave-to-class="opacity-0 backdrop-blur-none"
      >
        <div
          v-if="logoutModalOpen"
          class="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-sm px-4"
          @click.self="logoutModalOpen = false"
        >
          <Transition
            enter-active-class="transition ease-out duration-300"
            enter-from-class="opacity-0 scale-95 translate-y-4"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition ease-in duration-200"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-95 translate-y-4"
          >
            <div
              v-if="logoutModalOpen"
              class="bg-white rounded-3xl border border-gray-100 max-w-sm w-full p-8 flex flex-col items-center text-center shadow-2xl relative overflow-hidden"
            >
              <div class="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay pointer-events-none"></div>
              
              <!-- Icon -->
              <div class="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mb-6 relative">
                <div class="absolute inset-0 bg-rose-500/10 rounded-full animate-ping"></div>
                <LogOut class="w-8 h-8 text-rose-500 relative z-10" />
              </div>

              <!-- Content -->
              <div class="space-y-2 mb-8 relative z-10">
                <h3 class="text-2xl font-bold text-gray-900 font-heading">
                  Leaving already?
                </h3>
                <p class="text-sm text-gray-500 leading-relaxed font-medium px-4">
                  You’ll be securely signed out of your session. Your data will be waiting for you.
                </p>
              </div>

              <!-- Actions -->
              <div class="flex gap-3 w-full relative z-10">
                <button
                  @click="logoutModalOpen = false"
                  class="flex-1 py-3.5 rounded-xl text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>

                <button
                  @click="confirmLogout"
                  class="flex-1 py-3.5 rounded-xl text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600 transition-colors shadow-lg shadow-rose-500/30"
                >
                  Yes, Log out
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </Transition>
    </Teleport>

    <!-- Route Search Modal -->
    <RouteSearchModal :isOpen="searchModalOpen" @close="searchModalOpen = false" />
 </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useUser } from '@/composables/modules/auth/user'
import { useAdminNotifications } from '@/composables/useAdminNotifications'
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
 ChevronLeft,
 Search,
 Settings,
 Gift,
 MessageSquare,
 Bell,
 Activity
} from 'lucide-vue-next'
import RouteSearchModal from '@/components/ui/RouteSearchModal.vue'

const route = useRoute()
const router = useRouter()
const { user, logOut } = useUser()

const { requestPermissionAndRegister, listenForNotifications } = useAdminNotifications()

onMounted(() => {
  requestPermissionAndRegister()
  listenForNotifications()
})
const showMobileMenu = ref(false)
const logoutModalOpen = ref(false)
const searchModalOpen = ref(false)
const isSidebarMinimized = ref(false)

const navItems = [
 { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
 { path: '/users', label: 'Users', icon: Users },
 { path: '/dispatchers', label: 'Dispatchers', icon: ShieldCheck },
 { path: '/vendors', label: 'Vendors', icon: Store },
 { path: '/orders', label: 'Orders', icon: Package },
 { path: '/referrals', label: 'Referrals', icon: Gift },
 { path: '/finances', label: 'Finances', icon: Wallet },
 { path: '/chats', label: 'Support Chats', icon: MessageSquare },
 { path: '/campaigns', label: 'Push Campaigns', icon: Bell },
 { path: '/reports', label: 'Reports', icon: FileText },
 { path: '/settings', label: 'Settings', icon: Settings }
]

const pageTitles: Record<string, { title: string; description: string }> = {
 '/dashboard': { title: 'Admin Overview', description: 'Platform performance and key metrics' },
 '/users': { title: 'User Management', description: 'Manage accounts and permissions' },
 '/dispatchers': { title: 'Dispatcher Verifications', description: 'Review and approve dispatcher verifications' },
 '/vendors': { title: 'Vendor Management', description: 'Manage merchants and store settings' },
 '/orders': { title: 'Order Management', description: 'Monitor and track active deliveries' },
 '/chats': { title: 'Support Chats', description: 'Monitor and answer user questions in real-time' },
 '/campaigns': { title: 'Push Campaigns', description: 'Manage automated push notifications sent to users' },
 '/referrals': { title: 'Referral Program', description: 'Monitor affiliate and referral metrics' },
 '/reports': { title: 'Platform Reports', description: 'Analytical insights and system health' },
 '/settings': { title: 'System Settings', description: 'Configure platform parameters and service fees' }
}

const pageTitle = computed(() => pageTitles[route.path]?.title || 'Admin Dashboard')
const pageDescription = computed(() => pageTitles[route.path]?.description || 'Welcome to Errander Admin')
const currentPageIcon = computed(() => {
  const item = navItems.find(item => item.path === route.path)
  return item ? item.icon : LayoutDashboard
})

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
  logoutModalOpen.value = false
  logOut()
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
