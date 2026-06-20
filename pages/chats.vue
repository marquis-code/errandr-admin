<template>
  <div class="h-screen w-full flex bg-[#F0F2F5] overflow-hidden fixed inset-0 z-50">
    <!-- Left Sidebar -->
    <div 
      :class="[
        'w-full md:w-[35%] lg:w-[30%] max-w-[420px] min-w-[320px] flex-col bg-white border-r border-gray-200 flex-shrink-0 transition-all',
        activeChat ? 'hidden md:flex' : 'flex'
      ]"
    >
      <!-- Header -->
      <div class="h-[60px] px-4 bg-[#FF5C1A] flex items-center justify-between flex-shrink-0">
        <div class="flex items-center gap-3">
          <button @click="navigateTo('/dashboard')" class="p-2 hover:bg-white/10 rounded-full transition-colors text-white" title="Back to Dashboard">
            <ArrowLeft class="w-5 h-5" />
          </button>
          <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold overflow-hidden cursor-pointer">
            {{ user ? (user.firstName?.[0] || user.email?.[0] || 'A').toUpperCase() : 'A' }}
          </div>
          <span class="font-semibold text-white text-base truncate">Support Chats</span>
        </div>
        <div class="flex items-center gap-4 text-white">
          <MessageSquare class="w-5 h-5 cursor-pointer hover:text-white/80 transition-colors" />
          <MoreVertical class="w-5 h-5 cursor-pointer hover:text-white/80 transition-colors" />
        </div>
      </div>

      <!-- Search -->
      <div class="p-2 bg-white border-b border-gray-200">
        <div class="bg-[#F0F2F5] rounded-lg flex items-center px-4 py-1.5 transition-all border border-transparent focus-within:bg-white focus-within:border-[#FF5C1A]/50">
          <Search class="w-4 h-4 text-[#54656F] mr-3" />
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search support chats" 
            class="bg-transparent border-none outline-none text-[15px] w-full placeholder:text-[#54656F] text-[#111B21] py-1"
          />
        </div>
      </div>

      <!-- Chat List -->
      <div class="flex-1 overflow-y-auto bg-white">
        <div v-if="loading" class="p-4 space-y-3">
          <div v-for="i in 5" :key="i" class="h-16 bg-gray-100 animate-pulse rounded-lg" />
        </div>
        <div v-else-if="filteredChats.length === 0" class="flex flex-col items-center justify-center h-full text-[#54656F] space-y-2 p-6 text-center">
          <MessageSquare class="w-12 h-12 opacity-20" />
          <p class="text-[14px]">No active support chats found.</p>
        </div>
        <div v-else class="flex flex-col">
          <button
            v-for="chat in filteredChats"
            :key="chat.userId"
            @click="selectChat(chat)"
            class="w-full text-left flex items-center px-3 py-3 hover:bg-[#F5F6F6] transition-colors group"
            :class="{ 'bg-[#F0F2F5]': activeChat?.userId === chat.userId }"
          >
            <!-- Avatar -->
            <div class="w-12 h-12 rounded-full bg-[#FFF0E5] flex items-center justify-center text-[#FF5C1A] font-bold text-lg flex-shrink-0 mr-3 overflow-hidden">
              <img v-if="chat.userData?.avatar" :src="chat.userData.avatar" class="w-full h-full object-cover" />
              <span v-else>{{ getInitials(chat.userName) }}</span>
            </div>
            
            <!-- Info -->
            <div class="flex-1 min-w-0 border-b border-gray-100 pb-3 pt-1 group-last:border-none">
              <div class="flex items-center justify-between mb-0.5">
                <h3 class="font-normal text-[#111B21] text-[16px] truncate">
                  {{ chat.userName }}
                </h3>
                <span class="text-[12px] whitespace-nowrap ml-2" :class="activeChat?.userId === chat.userId ? 'text-[#111B21]' : 'text-[#54656F]'">
                  {{ formatTime(chat.lastMessageAt) }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <p class="text-[14px] text-[#54656F] truncate flex items-center gap-1">
                  {{ chat.lastMessage }}
                </p>
                <div v-if="chat.unreadCount > 0" class="w-5 h-5 rounded-full bg-[#FF5C1A] text-white flex items-center justify-center text-[11px] font-bold">
                  {{ chat.unreadCount }}
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
        'flex-1 flex-col bg-[#F0F2F5] border-l border-[#E1E1E1]',
        !activeChat ? 'hidden md:flex' : 'flex'
      ]"
    >
      <div v-if="!activeChat" class="flex-1 flex flex-col items-center justify-center text-center p-8 bg-[#F0F2F5]">
        <div class="w-80 h-80 mb-8 opacity-20 mx-auto">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 100C77.6142 100 100 77.6142 100 50C100 22.3858 77.6142 0 50 0C22.3858 0 0 22.3858 0 50C0 77.6142 22.3858 100 50 100Z" fill="#FF5C1A"/>
            <path d="M70.5 35.5C70.5 35.5 68.5 32 63.5 32C58.5 32 55.5 35.5 55.5 35.5C55.5 35.5 53 38 52 38.5C51 39 48.5 38 46 36.5C43.5 35 42.5 32 42.5 32C42.5 32 44.5 29 42.5 27.5C40.5 26 38.5 23 37.5 23C36.5 23 34.5 24.5 33 26.5C31.5 28.5 30 33 34.5 39C39 45 44.5 50 49 51.5C53.5 53 58.5 53 62.5 51.5C66.5 50 69.5 47 70.5 45C71.5 43 70.5 35.5 70.5 35.5Z" fill="white"/>
          </svg>
        </div>
        <h2 class="text-[32px] font-light text-[#41525D] mb-4">Support Dashboard</h2>
        <p class="text-[14px] text-[#667781] max-w-md leading-relaxed">
          Manage incoming support requests from students and vendors.<br/>
        </p>
        <div class="mt-10 flex items-center justify-center gap-1.5 text-[14px] text-[#8696A0]">
          <Lock class="w-3.5 h-3.5" />
          <span>End-to-end encrypted</span>
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
