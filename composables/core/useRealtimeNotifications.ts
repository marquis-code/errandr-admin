import { onMounted, onBeforeUnmount } from 'vue'
import { useCustomToast } from '@/composables/core/useCustomToast'
import { useRealtimeSocket } from '@/composables/core/useRealtimeSocket'
import { useUser } from '@/composables/modules/auth/user'

const LISTENERS_KEY = 'realtime_notification_listeners'

const playNotificationSound = () => {
  try {
    const audio = new Audio('/sounds/notification.wav')
    audio.play().catch(e => console.warn('Audio playback failed', e))
  } catch (error) {
    // ignore
  }
}

export const useRealtimeNotifications = () => {
  const { showToast } = useCustomToast()
  const { socket, connectSocket } = useRealtimeSocket()
  const { user } = useUser()
  const listenersAttached = useState<boolean>(LISTENERS_KEY, () => false)

  const handleNotification = (payload: any) => {
    if (!payload) return

    playNotificationSound()

    showToast({
      title: payload.title || 'Notification',
      message: payload.message || payload.type || 'You have a new update',
      toastType: payload.priority === 'high' ? 'warning' : 'info',
      duration: 5000,
    })
  }

  const handleAudit = (payload: any) => {
    if (!payload) return

    playNotificationSound()

    showToast({
      title: payload.action ? `Audit: ${payload.action}` : 'Audit Update',
      message: payload.description || 'A new audit log was recorded',
      toastType: 'info',
      duration: 5000,
    })
  }

  const handleChatMessage = (payload: any) => {
    if (!payload) return
    
    const senderId = payload.senderId || payload.sender?._id || payload.sender
    const currentAdminId = user.value?._id || user.value?.id
    if (senderId === currentAdminId) return

    playNotificationSound()

    const senderName = payload.senderName || payload.sender?.firstName || 'User'
    
    showToast({
      title: `New Message from ${senderName}`,
      message: payload.content || payload.message || 'Sent a message',
      toastType: 'info',
      duration: 5000,
    })
  }

  onMounted(() => {
    connectSocket()

    if (listenersAttached.value || !socket.value) return
    listenersAttached.value = true

    socket.value.emit('joinSupport', { userId: user.value?._id || user.value?.id || 'admin' })

    socket.value.on('notification:new', handleNotification)
    socket.value.on('audit:log', handleAudit)
    socket.value.on('chat:new-message', handleChatMessage)
  })

  onBeforeUnmount(() => {
    if (!socket.value || !listenersAttached.value) return

    socket.value.off('notification:new', handleNotification)
    socket.value.off('audit:log', handleAudit)
    socket.value.off('chat:new-message', handleChatMessage)
    listenersAttached.value = false
  })
}
