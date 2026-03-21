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
      <h1 class="text-4xl font-black text-gray-900 tracking-tight mb-2">Internal Directory</h1>
      <p class="text-lg text-gray-500 mb-10">Contacts for internal operations, engineering, and management.</p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div class="bg-gray-50 rounded-2xl p-8 border border-gray-100">
          <div class="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 mb-4"><Mail class="w-6 h-6" /></div>
          <h3 class="font-bold text-gray-900 text-lg mb-2">Engineering Team</h3>
          <p class="text-gray-500 text-sm mb-4">For platform bugs, feature requests, and API issues.</p>
          <a href="mailto:engineering@errandr.com" class="text-gray-900 font-bold text-sm hover:underline">engineering@errandr.com</a>
        </div>
        <div class="bg-gray-50 rounded-2xl p-8 border border-gray-100">
          <div class="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 mb-4"><Phone class="w-6 h-6" /></div>
          <h3 class="font-bold text-gray-900 text-lg mb-2">Ops Emergency</h3>
          <p class="text-gray-500 text-sm mb-4">For platform outages, critical security incidents, or major order failures.</p>
          <a href="tel:+2341234567893" class="text-gray-900 font-bold text-sm hover:underline">+234 123 456 7893</a>
        </div>
        <div class="bg-gray-50 rounded-2xl p-8 border border-gray-100">
          <div class="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 mb-4"><Users class="w-6 h-6" /></div>
          <h3 class="font-bold text-gray-900 text-lg mb-2">People & HR</h3>
          <p class="text-gray-500 text-sm mb-4">For team access requests, onboarding, and HR-related inquiries.</p>
          <a href="mailto:hr@errandr.com" class="text-gray-900 font-bold text-sm hover:underline">hr@errandr.com</a>
        </div>
        <div class="bg-gray-50 rounded-2xl p-8 border border-gray-100">
          <div class="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600 mb-4"><Scale class="w-6 h-6" /></div>
          <h3 class="font-bold text-gray-900 text-lg mb-2">Legal & Compliance</h3>
          <p class="text-gray-500 text-sm mb-4">For regulatory inquiries, data privacy requests, and compliance questions.</p>
          <a href="mailto:legal@errandr.com" class="text-gray-900 font-bold text-sm hover:underline">legal@errandr.com</a>
        </div>
      </div>
    </main>
    <footer class="bg-gray-50 border-t border-gray-200 py-8"><div class="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400 font-medium"><p>&copy; {{ new Date().getFullYear() }} Errandr Ops</p><div class="flex items-center gap-6"><NuxtLink to="/about" class="hover:text-gray-600">About</NuxtLink><NuxtLink to="/contact" class="hover:text-gray-600">Contact</NuxtLink><NuxtLink to="/faq" class="hover:text-gray-600">FAQ</NuxtLink><NuxtLink to="/terms" class="hover:text-gray-600">Terms</NuxtLink></div></div></footer>
  </div>
</template>
<script setup lang="ts">
import { ShieldCheck, Mail, Phone, Users, Scale } from 'lucide-vue-next'
definePageMeta({ layout: false })
useHead({ title: 'Contact - Errandr Ops' })
</script>
