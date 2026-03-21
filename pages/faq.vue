<template>
  <div class="min-h-screen bg-white">
    <nav class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 py-4">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2"><div class="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center"><ShieldCheck class="w-4 h-4 text-emerald-400" /></div><span class="text-lg font-black text-gray-900 tracking-tight">Errandr <span class="text-gray-400 font-medium text-sm">Ops</span></span></NuxtLink>
        <div class="flex items-center gap-6 text-sm font-semibold text-gray-500">
          <NuxtLink to="/about" class="hover:text-gray-900">About</NuxtLink><NuxtLink to="/contact" class="hover:text-gray-900">Contact</NuxtLink><NuxtLink to="/faq" class="hover:text-gray-900">FAQ</NuxtLink><NuxtLink to="/terms" class="hover:text-gray-900">Terms</NuxtLink>
        </div>
      </div>
    </nav>
    <main class="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <h1 class="text-4xl font-black text-gray-900 tracking-tight mb-2">Admin Runbooks</h1>
      <p class="text-lg text-gray-500 mb-10">Common operational procedures for the Errandr Ops team.</p>
      <div class="space-y-6">
        <div v-for="(faq, i) in faqs" :key="i" class="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
          <button @click="openIndex = openIndex === i ? -1 : i" class="w-full flex items-center justify-between p-6 text-left">
            <span class="font-bold text-gray-900">{{ faq.q }}</span>
            <ChevronDown class="w-5 h-5 text-gray-400 transition-transform" :class="{ 'rotate-180': openIndex === i }" />
          </button>
          <div v-show="openIndex === i" class="px-6 pb-6 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">{{ faq.a }}</div>
        </div>
      </div>
    </main>
    <footer class="bg-gray-50 border-t border-gray-200 py-8"><div class="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400 font-medium"><p>&copy; {{ new Date().getFullYear() }} Errandr Ops</p><div class="flex items-center gap-6"><NuxtLink to="/about" class="hover:text-gray-600">About</NuxtLink><NuxtLink to="/contact" class="hover:text-gray-600">Contact</NuxtLink><NuxtLink to="/faq" class="hover:text-gray-600">FAQ</NuxtLink><NuxtLink to="/terms" class="hover:text-gray-600">Terms</NuxtLink></div></div></footer>
  </div>
</template>
<script setup lang="ts">
import { ShieldCheck, ChevronDown } from 'lucide-vue-next'
import { ref } from 'vue'
definePageMeta({ layout: false })
useHead({ title: 'Runbooks - Errandr Ops' })
const openIndex = ref(0)
const faqs = [
  { q: 'How do I approve a new vendor?', a: 'Navigate to Vendors → Pending Approvals. Review the vendor\'s submitted information including store name, category, address, and uploaded documents. Click "Approve" to activate the store or "Reject" with a reason to notify the vendor. All approval actions are logged in the audit trail.' },
  { q: 'How do I handle an order dispute?', a: 'Go to Orders → Disputes. Review the complaint details, order timeline, and communication between the student and vendor. You can issue a full or partial refund, contact either party, or escalate to management. Always document your decision reasoning.' },
  { q: 'How do I process a manual payout?', a: 'Navigate to Finance → Payouts. Locate the vendor or rider account, verify the outstanding balance, and click Process Payout. Manual payouts require secondary approval from a Finance team member. Settlement confirmation is sent automatically.' },
  { q: 'How do I suspend a user account?', a: 'Go to Users, search for the account, and click the user profile. Select "Suspend Account" and provide a reason. The user will be notified via email. Suspended accounts cannot log in or perform any platform actions. Suspension can be reversed with management approval.' },
  { q: 'How do I launch Errandr on a new campus?', a: 'Contact the Engineering team to configure the new campus in the backend. Then, go to Settings → Campuses → Add Campus. Provide the campus name, location coordinates, and supported delivery zones. Finally, begin onboarding local vendors and recruiting riders.' },
  { q: 'How do I access the audit logs?', a: 'Navigate to System → Audit Logs. You can filter by date range, action type, user, and module. All administrative actions, including logins, approvals, suspensions, and financial operations, are recorded with timestamps and actor identification.' },
  { q: 'What are the escalation procedures?', a: 'Level 1: Resolve within 1 hour using standard runbooks. Level 2: Escalate to team lead if the issue involves financial disputes over ₦10,000 or safety concerns. Level 3: Escalate to management for legal matters, data breaches, or platform-wide incidents.' },
]
</script>
