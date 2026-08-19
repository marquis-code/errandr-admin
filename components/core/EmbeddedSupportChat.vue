<template>
  <div v-if="isOpen" class="w-full h-full flex flex-col font-sans relative overflow-hidden bg-white">
    <!-- Chat Panel -->
    <div class="w-full h-full flex flex-col bg-white">
      <!-- Header -->
      <div class="px-6 py-4 bg-white/80 backdrop-blur-md text-gray-900 flex items-center gap-4 sticky top-0 z-20 shadow-sm border-b border-gray-100/50">
        <button @click="$emit('close')" class="lg:hidden p-2 hover:bg-gray-50 rounded-xl transition-colors">
          <ArrowLeft class="w-5 h-5 text-gray-600" />
        </button>
        <div class="w-12 h-12 rounded-full bg-gradient-to-br from-orange-100 to-rose-100 flex items-center justify-center text-sm font-bold overflow-hidden cursor-pointer shadow-sm border border-white">
          <img v-if="receiverAvatar" :src="receiverAvatar" class="w-full h-full object-cover" />
          <User v-else class="w-6 h-6 text-[#FF5C1A]" />
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="text-base font-bold truncate leading-tight text-gray-900 font-heading">{{ receiverName || 'Support Chat' }}</h3>
          <p class="text-xs text-gray-500 font-medium truncate mt-0.5 flex items-center gap-1.5">
            <span class="w-1.5 h-1.5 rounded-full" :class="isTyping ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'"></span>
            {{ isTyping ? 'Typing...' : 'Online' }}
          </p>
        </div>
      </div>

      <!-- Messages Area -->
      <div ref="messageContainer" class="flex-1 overflow-y-auto px-6 py-6 space-y-4 scroll-smooth bg-gray-50/50 relative">
        <div class="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay pointer-events-none"></div>
        
        <div class="flex justify-center mb-8 sticky top-4 z-10">
          <span class="px-4 py-1.5 bg-white/80 backdrop-blur-md text-gray-500 text-[10px] font-bold rounded-full shadow-sm border border-gray-100/50 uppercase tracking-widest">
            Today
          </span>
        </div>

        <div v-if="loading" class="flex flex-col items-center justify-center h-40 space-y-4">
          <div class="w-8 h-8 border-2 border-[#FF5C1A]/20 border-t-[#FF5C1A] rounded-full animate-spin" />
        </div>
        
        <div v-else-if="messages.length === 0" class="flex flex-col items-center justify-center p-10 text-center space-y-3 mt-10">
          <div class="p-6 bg-white rounded-3xl shadow-sm border border-gray-100 max-w-sm w-full mx-auto">
            <div class="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-3">
              <MessageSquare class="w-6 h-6 text-gray-400" />
            </div>
            <p class="text-sm text-gray-900 font-semibold mb-1">Start a conversation</p>
            <p class="text-xs text-gray-500 font-medium leading-relaxed">
              Send a message to begin the support session.
            </p>
          </div>
        </div>

        <div v-for="(msg, idx) in messages" :key="msg._id || idx" 
          class="flex flex-col w-full animate-message-in relative z-10" 
          :class="isMe(msg) ? 'items-end' : 'items-start'">
          
          <div :class="[
            'relative max-w-[75%] px-5 py-3.5 text-sm shadow-sm transition-all border',
            isMe(msg) 
              ? 'bg-gradient-to-br from-[#FF5C1A] to-[#FF7A45] text-white rounded-3xl rounded-tr-sm border-transparent' 
              : 'bg-white text-gray-900 rounded-3xl rounded-tl-sm border-gray-100'
          ]">
            <!-- Sender name -->
            <p v-if="!isMe(msg)" class="text-xs font-bold text-[#FF5C1A] mb-1.5">
              {{ msg.sender?.firstName || msg.senderName || 'User' }}
            </p>

            <div v-if="msg.messageType === 'image'" class="mb-2 -mx-2 -mt-1">
              <img :src="msg.attachment" class="rounded-2xl max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity border border-white/20" @click="msg.attachment && openImage(msg.attachment)" />
            </div>
            <div v-if="msg.messageType === 'voice'" class="mb-2 min-w-[200px] flex items-center gap-3 py-2">
              <audio :src="msg.attachment" controls class="h-8 w-full custom-audio" />
            </div>

            <div class="flex items-end gap-3 flex-wrap">
              <span v-if="msg.message || msg.content" class="break-words flex-1 min-w-0 font-medium leading-relaxed">{{ msg.message || msg.content }}</span>
              <div class="flex items-center gap-1 shrink-0 mt-1 self-end">
                <span class="text-[10px] font-semibold tracking-wide" :class="isMe(msg) ? 'text-white/80' : 'text-gray-400'">
                  {{ formatTime(msg.createdAt) }}
                </span>
                <div v-if="isMe(msg)" class="flex items-center ml-1">
                  <Check v-if="!msg._id" class="w-3.5 h-3.5 text-white/60" />
                  <CheckCheck v-else class="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="isTyping" class="flex items-center ml-2 transition-all relative z-10">
          <div class="bg-white px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 flex items-center gap-1.5">
            <div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
            <div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
            <div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
          </div>
        </div>
      </div>

      <!-- Input Bar -->
      <div class="px-4 py-4 bg-white/80 backdrop-blur-md border-t border-gray-100 flex flex-col gap-2 relative z-20">
        <div class="max-w-4xl w-full mx-auto flex items-center gap-3">
          <div class="flex-1 bg-gray-50/80 rounded-2xl px-5 py-3.5 flex items-center shadow-inner border border-gray-200/50 focus-within:bg-white focus-within:border-[#FF5C1A]/30 focus-within:ring-4 focus-within:ring-[#FF5C1A]/10 transition-all">
            <input 
              v-model="newMsgText" 
              type="text" 
              placeholder="Type your message..." 
              class="flex-1 bg-transparent border-none outline-none text-sm font-medium text-gray-900 placeholder:text-gray-400"
              @input="handleTyping"
              @keyup.enter="handleSend"
            />
          </div>

          <button 
            @click="handleSend"
            :disabled="!newMsgText.trim()"
            class="w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-sm shrink-0 disabled:opacity-50 disabled:cursor-not-allowed group"
            :class="newMsgText.trim() ? 'bg-gradient-to-br from-[#FF5C1A] to-[#FF7A45] hover:shadow-md hover:-translate-y-0.5' : 'bg-gray-100'"
          >
            <Send class="w-5 h-5 ml-0.5 transition-transform" :class="newMsgText.trim() ? 'text-white group-hover:scale-110' : 'text-gray-400'" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  ArrowLeft, User, Send, Check, CheckCheck
} from 'lucide-vue-next';
import { ref, onMounted, nextTick, watch, onUnmounted } from 'vue';
import { chat_api } from '@/api_factory/modules/chat';
import { useRealtimeSocket } from '@/composables/core/useRealtimeSocket';

const props = defineProps<{
  isOpen: boolean;
  supportUserId: string; // The user ID we are chatting with
  currentUserId: string;
  receiverName?: string;
  receiverAvatar?: string;
}>();

const emit = defineEmits(['close']);
const newMsgText = ref('');
const messageContainer = ref<HTMLElement | null>(null);

const messages = ref<any[]>([]);
const loading = ref(false);
const isTyping = ref(false);

const { socket, emitWithAck, isConnected, connectSocket } = useRealtimeSocket();

const fetchMessages = async () => {
  loading.value = true;
  try {
    const res = await chat_api.getRoomMessages(props.supportUserId, { userId: props.currentUserId }) as any;
    if ([200, 201].includes(res?.status)) {
      messages.value = res.data?.data || res.data || [];
    }
  } catch (e) {
    console.error('Failed to fetch support messages', e);
  } finally {
    loading.value = false;
    scrollToBottom();
  }
};

const setupListeners = () => {
  connectSocket();
  if (!socket.value) return;

  // Join the admin support room to receive broadcasts
  socket.value.emit('joinSupport', { userId: props.supportUserId });

  socket.value.on('chat:new-message', (msg: any) => {
    // Only add if it belongs to this thread
    const senderId = msg.senderId || msg.sender?._id || msg.sender;
    const receiverId = msg.receiverId || msg.receiver?._id || msg.receiver;
    if (senderId === props.supportUserId || receiverId === props.supportUserId || msg.roomId === props.supportUserId) {
      messages.value.push(msg);
      scrollToBottom();
    }
  });

  socket.value.on('chat:user-typing', (payload: any) => {
    if (payload.userId === props.supportUserId) {
      isTyping.value = payload.isTyping;
      if (payload.isTyping) {
        setTimeout(() => isTyping.value = false, 3000);
      }
    }
  });
};

const handleSend = async () => {
  if (!newMsgText.value.trim()) return;
  const content = newMsgText.value;
  newMsgText.value = '';
  
  // Optimistic
  const tempMsg = {
    _id: `temp_${Date.now()}`,
    senderId: props.currentUserId,
    receiverId: props.supportUserId,
    content: content,
    message: content,
    messageType: 'text',
    roomType: 'support',
    createdAt: new Date().toISOString(),
  };
  messages.value.push(tempMsg);
  scrollToBottom();

  if (isConnected.value && socket.value) {
    const response = await emitWithAck('chat:send-message', {
      senderId: props.currentUserId,
      receiverId: props.supportUserId,
      content,
      messageType: 'text',
      roomType: 'support',
      roomId: props.supportUserId // Pass the support user's ID as the roomId
    });
    if (!response?.success) {
      await sendViaRest(content);
    } else {
       // Replace temp with real
       messages.value = messages.value.filter(m => m._id !== tempMsg._id);
    }
  } else {
    await sendViaRest(content);
  }
};

const sendViaRest = async (content: string) => {
  try {
    const res = await chat_api.sendMessage(props.supportUserId, {
      senderId: props.currentUserId,
      receiverId: props.supportUserId,
      content,
      messageType: 'text',
      roomType: 'support'
    }) as any;
    if ([200, 201].includes(res?.status)) {
       // Messages will be fetched or handled by socket? For REST we fetch again
       await fetchMessages();
    }
  } catch (e) {
    console.error('Failed to send message via REST', e);
  }
};

const handleTyping = () => {
  if (isConnected.value && socket.value) {
    socket.value.emit('chat:typing', { userId: props.currentUserId, roomId: props.supportUserId, roomType: 'support', isTyping: true });
  }
};

const scrollToBottom = async () => {
  await nextTick();
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
  }
};

const getSenderId = (msg: any) => {
  if (!msg) return '';
  return String(msg.senderId || msg.sender?._id || msg.sender?.id || msg.sender || '');
};

const isMe = (msg: any) => {
  const senderId = getSenderId(msg);
  const myId = String(props.currentUserId || '');
  return !!senderId && !!myId && senderId === myId;
};

const formatTime = (dateStr: string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
};

watch(() => props.supportUserId, () => {
  if (props.isOpen && props.supportUserId) {
    fetchMessages();
  }
});

onMounted(() => {
  if (props.isOpen) {
    setupListeners();
    fetchMessages();
  }
});

onUnmounted(() => {
  if (socket.value) {
    socket.value.off('chat:new-message');
    socket.value.off('chat:user-typing');
  }
});
</script>

<style scoped>
.animate-message-in {
  animation: messageIn 0.2s ease-out forwards;
}

@keyframes messageIn {
  from { opacity: 0; transform: translateY(8px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background: rgba(0,0,0,0.1);
  border-radius: 10px;
}
</style>
