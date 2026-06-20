<template>
  <div v-if="isOpen" class="w-full h-full flex flex-col font-sans relative overflow-hidden bg-[#E5DDD5]">
    <!-- Chat Panel -->
    <div class="w-full h-full flex flex-col bg-[#E5DDD5]">
      <!-- Header -->
      <div class="px-4 py-2.5 bg-[#FF5C1A] text-white flex items-center gap-4 sticky top-0 z-20 shadow-sm">
        <button @click="$emit('close')" class="lg:hidden p-2 hover:bg-white/10 rounded-full transition-colors">
          <ArrowLeft class="w-5 h-5 text-white" />
        </button>
        <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold overflow-hidden cursor-pointer">
          <img v-if="receiverAvatar" :src="receiverAvatar" class="w-full h-full object-cover" />
          <User v-else class="w-6 h-6 text-white" />
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="text-[16px] font-medium truncate leading-tight text-white">{{ receiverName || 'Support Chat' }}</h3>
          <p class="text-[13px] text-white/80 font-normal truncate">
            Customer Support • {{ isTyping ? 'typing...' : 'online' }}
          </p>
        </div>
      </div>

      <!-- Messages Area -->
      <div ref="messageContainer" class="flex-1 overflow-y-auto px-4 py-6 space-y-2 scroll-smooth bg-[#F0F2F5] bg-repeat">
        
        <div class="flex justify-center mb-6 sticky top-2 z-10">
          <span class="px-3 py-1 bg-[#D1E9F6] text-[#54656F] text-[11px] font-bold rounded-lg shadow-sm">
            Support Chat
          </span>
        </div>

        <div v-if="loading" class="flex flex-col items-center justify-center h-40 space-y-4">
          <div class="w-8 h-8 border-2 border-[#FF5C1A]/20 border-t-[#FF5C1A] rounded-full animate-spin" />
        </div>
        
        <div v-else-if="messages.length === 0" class="flex flex-col items-center justify-center p-10 text-center space-y-3 mt-10">
          <div class="p-5 bg-white rounded-3xl shadow-sm">
            <p class="text-[12px] text-gray-500 font-medium leading-relaxed">
              No messages yet in this support thread.
            </p>
          </div>
        </div>

        <div v-for="(msg, idx) in messages" :key="msg._id || idx" 
          class="flex flex-col w-full animate-message-in" 
          :class="isMe(msg) ? 'items-end' : 'items-start'">
          
          <div :class="[
            'relative max-w-[85%] px-3 py-1.5 rounded-lg text-[14.5px] shadow-sm mb-1 group transition-all',
            isMe(msg) 
              ? 'bg-[#DCF8C6] text-[#054740] rounded-tr-none ml-10' 
              : 'bg-white text-[#111B21] rounded-tl-none mr-10'
          ]">
            <!-- Sender name -->
            <p v-if="!isMe(msg)" class="text-[12px] font-bold text-[#FF5C1A] mb-0.5">
              {{ msg.sender?.firstName || msg.senderName || 'User' }}
            </p>

            <div v-if="msg.messageType === 'image'" class="mb-1 -mx-1 -mt-0.5">
              <img :src="msg.attachment" class="rounded-lg max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity" @click="msg.attachment && openImage(msg.attachment)" />
            </div>
            <div v-if="msg.messageType === 'voice'" class="mb-1 min-w-[200px] flex items-center gap-3 py-2">
              <audio :src="msg.attachment" controls class="h-8 w-full custom-audio" />
            </div>

            <div class="flex items-end gap-2 flex-wrap">
              <span v-if="msg.message || msg.content" class="break-words flex-1 min-w-0 font-medium">{{ msg.message || msg.content }}</span>
              <div class="flex items-center gap-1 shrink-0 mt-1 self-end">
                <span class="text-sm text-gray-400 font-medium">
                  {{ formatTime(msg.createdAt) }}
                </span>
                <div v-if="isMe(msg)" class="flex items-center">
                  <Check v-if="!msg._id" class="w-3 h-3 text-gray-400" />
                  <CheckCheck v-else class="w-3.5 h-3.5 text-[#34B7F1]" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="isTyping" class="flex items-center ml-2 transition-all">
          <div class="bg-white px-3 py-2 rounded-lg shadow-sm text-[12px] text-[#FF5C1A] font-bold animate-pulse">
            {{ receiverName || 'User' }} is typing...
          </div>
        </div>
      </div>

      <!-- Input Bar -->
      <div class="px-2 py-3 bg-[#F0F2F5] flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <div class="flex-1 bg-white rounded-xl px-4 py-2.5 flex items-center shadow-sm border border-transparent focus-within:border-[#FF5C1A]/20 focus-within:ring-2 focus-within:ring-[#FF5C1A]/10 transition-all">
            <input 
              v-model="newMsgText" 
              type="text" 
              placeholder="Type a message to reply" 
              class="flex-1 bg-transparent border-none outline-none text-[15px] font-medium text-[#111B21] placeholder:text-gray-400"
              @input="handleTyping"
              @keyup.enter="handleSend"
            />
          </div>

          <button 
            @click="handleSend"
            :disabled="!newMsgText.trim()"
            class="w-12 h-12 text-white rounded-full flex items-center justify-center transition-all shadow-md shrink-0 disabled:opacity-50"
            :class="newMsgText.trim() ? 'bg-[#FF5C1A] hover:bg-[#E54D12]' : 'bg-gray-400'"
          >
            <Send class="w-5 h-5 ml-0.5" />
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
