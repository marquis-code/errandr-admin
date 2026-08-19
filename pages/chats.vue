<template>
  <div class="h-screen w-full flex bg-gray-50/50 overflow-hidden fixed inset-0 z-50">
    <!-- Left Sidebar -->
    <div 
      :class="[
        'w-full md:w-[35%] lg:w-[30%] max-w-[420px] min-w-[320px] flex-col bg-white border-r border-gray-100/80 flex-shrink-0 transition-all shadow-sm z-10',
        activeChat ? 'hidden md:flex' : 'flex'
      ]"
    >
      <!-- Header -->
      <div class="h-[72px] px-6 bg-white border-b border-gray-100 flex items-center justify-between flex-shrink-0">
        <div class="flex items-center gap-3">
          <button @click="navigateTo('/dashboard')" class="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-600" title="Back to Dashboard">
            <ArrowLeft class="w-5 h-5" />
          </button>
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF5C1A] to-[#FF7A45] flex items-center justify-center text-white font-bold overflow-hidden shadow-sm">
            {{ user ? (user.firstName?.[0] || user.email?.[0] || 'A').toUpperCase() : 'A' }}
          </div>
          <span class="font-bold text-gray-900 text-lg font-heading tracking-tight">Support</span>
        </div>
        <div class="flex items-center gap-2 text-gray-400">
          <button class="p-2 hover:bg-gray-50 hover:text-[#FF5C1A] rounded-xl transition-colors">
            <MessageSquare class="w-5 h-5" />
          </button>
          <button class="p-2 hover:bg-gray-50 hover:text-[#FF5C1A] rounded-xl transition-colors">
            <MoreVertical class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Search -->
      <div class="p-4 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-10">
        <div class="bg-gray-50/80 rounded-xl flex items-center px-4 py-2.5 transition-all border border-gray-200/60 focus-within:bg-white focus-within:border-[#FF5C1A]/30 focus-within:ring-4 focus-within:ring-[#FF5C1A]/10 shadow-sm">
          <Search class="w-4 h-4 text-gray-400 mr-3" />
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search conversations..." 
            class="bg-transparent border-none outline-none text-[15px] font-medium w-full placeholder:text-gray-400 text-gray-900"
          />
        </div>
      </div>

      <!-- Chat List -->
      <div class="flex-1 overflow-y-auto bg-white custom-scrollbar">
        <div v-if="loading" class="p-4 space-y-3">
          <div v-for="i in 5" :key="i" class="h-20 bg-gray-50 animate-pulse rounded-2xl" />
        </div>
        <div v-else-if="filteredChats.length === 0" class="flex flex-col items-center justify-center h-full text-gray-400 space-y-4 p-8 text-center">
          <div class="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-2 border border-gray-100">
            <MessageSquare class="w-8 h-8 opacity-40 text-gray-400" />
          </div>
          <div>
            <p class="text-sm font-semibold text-gray-700">No conversations</p>
            <p class="text-xs mt-1">Active support chats will appear here.</p>
          </div>
        </div>
        <div v-else class="flex flex-col p-2 space-y-1">
          <button
            v-for="chat in filteredChats"
            :key="chat.userId"
            @click="selectChat(chat)"
            class="w-full text-left flex items-center px-4 py-3.5 rounded-2xl transition-all group border border-transparent"
            :class="activeChat?.userId === chat.userId ? 'bg-[#FF5C1A]/5 border-[#FF5C1A]/10 shadow-sm' : 'hover:bg-gray-50'"
          >
            <!-- Avatar -->
            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-orange-100 to-rose-100 flex items-center justify-center text-[#FF5C1A] font-bold text-lg flex-shrink-0 mr-4 overflow-hidden border border-white shadow-sm">
              <img v-if="chat.userData?.avatar" :src="chat.userData.avatar" class="w-full h-full object-cover" />
              <span v-else>{{ getInitials(chat.userName) }}</span>
            </div>
            
            <!-- Info -->
            <div class="flex-1 min-w-0 flex flex-col justify-center">
              <div class="flex items-center justify-between mb-1">
                <h3 class="font-semibold text-gray-900 text-[15px] truncate transition-colors group-hover:text-[#FF5C1A]" :class="{'text-[#FF5C1A]': activeChat?.userId === chat.userId}">
                  {{ chat.userName }}
                </h3>
                <span class="text-[11px] font-semibold tracking-wide whitespace-nowrap ml-2 transition-colors" :class="chat.unreadCount > 0 ? 'text-[#FF5C1A]' : 'text-gray-400'">
                  {{ formatTime(chat.lastMessageAt) }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <p class="text-[13px] text-gray-500 font-medium truncate flex-1" :class="{'text-gray-900 font-semibold': chat.unreadCount > 0}">
                  {{ chat.lastMessage || 'Sent an attachment' }}
                </p>
                <div v-if="chat.unreadCount > 0" class="w-5 h-5 rounded-full bg-[#FF5C1A] text-white flex items-center justify-center text-[10px] font-bold shadow-sm shadow-[#FF5C1A]/20 shrink-0 ml-3">
                  {{ chat.unreadCount > 99 ? '99+' : chat.unreadCount }}
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Right Area (Chat View) -->
    <div 
      :class="[
        'flex-1 flex-col bg-gray-50/50 relative',
        !activeChat ? 'hidden md:flex' : 'flex'
      ]"
    >
      <div v-if="!activeChat" class="flex-1 flex flex-col items-center justify-center text-center p-8 bg-[url('/noise.png')] relative before:absolute before:inset-0 before:bg-gray-50/90 before:backdrop-blur-3xl">
        <div class="relative z-10 max-w-sm mx-auto flex flex-col items-center">
          <div class="w-24 h-24 mb-8 relative">
             <div class="absolute inset-0 bg-[#FF5C1A]/10 rounded-full blur-2xl"></div>
             <div class="w-full h-full bg-white rounded-3xl rotate-12 flex items-center justify-center shadow-xl border border-gray-100">
               <MessageSquare class="w-10 h-10 text-[#FF5C1A] -rotate-12" />
             </div>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-3 font-heading">Support Messages</h2>
          <p class="text-sm font-medium text-gray-500 leading-relaxed">
            Select a conversation from the sidebar to start messaging with customers, vendors, and erranders.
          </p>
          <div class="mt-8 flex items-center justify-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest px-4 py-2 bg-white rounded-full border border-gray-100 shadow-sm">
            <Lock class="w-3.5 h-3.5" />
            <span>End-to-end encrypted</span>
          </div>
        </div>
      </div>

      <EmbeddedSupportChat 
        v-else
        :key="activeChat.userId"
        :is-open="true"
        :support-user-id="activeChat.userId"
        :current-user-id="user?.id || user?._id"
        :receiver-name="activeChat.userName"
        :receiver-avatar="activeChat.userData?.avatar"
        @close="activeChat = null"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Search, ArrowLeft, MessageSquare, MoreVertical, Lock } from 'lucide-vue-next'
import EmbeddedSupportChat from '@/components/core/EmbeddedSupportChat.vue'
import { chat_api } from '@/api_factory/modules/chat'
import { useUser } from '@/composables/modules/auth/user'
import { useRealtimeSocket } from '@/composables/core/useRealtimeSocket'

definePageMeta({
  layout: false
})

const { user } = useUser()

const threads = ref<any[]>([])
const loading = ref(true)
const searchQuery = ref('')
const activeChat = ref<any>(null)

const { connectSocket, socket } = useRealtimeSocket()

const fetchThreads = async () => {
  loading.value = true
  try {
    const res = await chat_api.getSupportThreads() as any
    if ([200, 201].includes(res?.status)) {
       const data = res.data?.data || res.data || []
       threads.value = data.map((t: any) => ({
         ...t,
         userName: t.userData ? `${t.userData.firstName || ''} ${t.userData.lastName || ''}`.trim() || t.userData.email : 'User'
       }))
    }
  } catch (e) {
    console.error('Failed to fetch support threads', e)
  } finally {
    loading.value = false
  }
}

const filteredChats = computed(() => {
  if (!searchQuery.value) return threads.value
  const q = searchQuery.value.toLowerCase()
  return threads.value.filter(c => {
    const rName = (c.userName || '').toLowerCase()
    return rName.includes(q)
  })
})

const selectChat = (chat: any) => {
  activeChat.value = chat
  chat.unreadCount = 0
}

const getInitials = (name: string) => {
  if (!name) return 'U'
  const parts = name.split(' ')
  const f = parts[0]?.[0] || ''
  const l = parts.length > 1 ? parts[1]?.[0] : ''
  return (f + l).toUpperCase()
}

const formatTime = (dateStr: string) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

onMounted(() => {
  fetchThreads()
  connectSocket()
  
  if (socket.value) {
    socket.value.on('chat:new-message', () => {
      // Refresh the thread list when a new message comes in so lastMessage and unreadCount updates
      fetchThreads()
    })
  }
})
</script>
