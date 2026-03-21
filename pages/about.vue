<template>
  <div class="min-h-screen bg-white">
    <nav class="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 py-4">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2"><div class="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center"><ShieldCheck class="w-4 h-4 text-emerald-400" /></div><span class="text-lg font-black text-gray-900 tracking-tight">Errandr <span class="text-gray-400 font-medium text-sm">Ops</span></span></NuxtLink>
        <div class="flex items-center gap-6 text-sm font-semibold text-gray-500">
          <NuxtLink to="/about" class="hover:text-gray-900">About</NuxtLink><NuxtLink to="/contact" class="hover:text-gray-900">Contact</NuxtLink><NuxtLink to="/faq" class="hover:text-gray-900">FAQ</NuxtLink><NuxtLink to="/terms" class="hover:text-gray-900">Terms</NuxtLink><NuxtLink to="/auth/login" class="text-gray-900 font-bold">Login</NuxtLink>
        </div>
      </div>
    </nav>
    <main class="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <h1 class="text-4xl font-black text-gray-900 tracking-tight mb-2">About Errandr Ops</h1>
      <p class="text-lg text-gray-500 mb-10">The internal operations platform for the Errandr delivery ecosystem.</p>
      <div class="prose prose-gray max-w-none text-gray-600 leading-relaxed space-y-6">
        <p>Errandr Ops is the centralized administration dashboard used by the Errandr operations team to manage the entire platform. It provides real-time visibility into orders, vendors, riders, students, finances, and platform health across all supported campuses.</p>
        <h2 class="text-xl font-bold text-gray-900 !mt-10">Platform Capabilities</h2>
        <ul class="space-y-3 list-none pl-0">
          <li class="flex items-start gap-3"><CheckCircle class="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" /><span><strong>User Management:</strong> View, search, approve, and manage all user accounts including students, vendors, and riders.</span></li>
          <li class="flex items-start gap-3"><CheckCircle class="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" /><span><strong>Order Monitoring:</strong> Real-time order tracking, dispute resolution, and fulfillment analytics.</span></li>
          <li class="flex items-start gap-3"><CheckCircle class="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" /><span><strong>Financial Oversight:</strong> Revenue dashboards, commission tracking, vendor payouts, and transaction auditing.</span></li>
          <li class="flex items-start gap-3"><CheckCircle class="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" /><span><strong>Vendor Approvals:</strong> Review new vendor applications, verify business documents, and manage store listings.</span></li>
          <li class="flex items-start gap-3"><CheckCircle class="w-5 h-5 text-emerald-500 mt-0.5 shrink-0" /><span><strong>Audit Trail:</strong> Comprehensive logging of all administrative actions for accountability and compliance.</span></li>
        </ul>
        <h2 class="text-xl font-bold text-gray-900 !mt-10">Access Control</h2>
        <p>Access to Errandr Ops is restricted to authorized personnel only. All sessions are encrypted, monitored, and logged. Multi-factor authentication is required for all administrative accounts.</p>
      </div>
    </main>
    <footer class="bg-gray-50 border-t border-gray-200 py-8"><div class="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400 font-medium"><p>&copy; {{ new Date().getFullYear() }} Errandr Ops — Internal Use Only</p><div class="flex items-center gap-6"><NuxtLink to="/about" class="hover:text-gray-600">About</NuxtLink><NuxtLink to="/contact" class="hover:text-gray-600">Contact</NuxtLink><NuxtLink to="/faq" class="hover:text-gray-600">FAQ</NuxtLink><NuxtLink to="/terms" class="hover:text-gray-600">Terms</NuxtLink></div></div></footer>
  </div>
</template>
<script setup lang="ts">
import { ShieldCheck, CheckCircle } from 'lucide-vue-next'
definePageMeta({ layout: false })
useHead({ title: 'About - Errandr Ops' })
</script>
