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
      <h1 class="text-4xl font-black text-gray-900 tracking-tight mb-2">Information Security Policy</h1>
      <p class="text-sm text-gray-400 mb-10">Last updated: January 15, 2026 — Confidential</p>
      <div class="prose prose-gray max-w-none text-gray-600 leading-relaxed space-y-8">
        <section>
          <h2 class="text-xl font-bold text-gray-900">1. Purpose</h2>
          <p>This Information Security Policy establishes the security framework for the Errandr Ops administration platform. It defines the responsibilities and expected conduct of all authorized personnel who access the platform.</p>
        </section>
        <section>
          <h2 class="text-xl font-bold text-gray-900">2. Access Control</h2>
          <p>Access to Errandr Ops is granted on a role-based, least-privilege basis. All accounts require strong passwords (minimum 12 characters, mixed case, digits, and symbols) and multi-factor authentication (MFA). Access is reviewed quarterly and revoked immediately upon role change or termination.</p>
        </section>
        <section>
          <h2 class="text-xl font-bold text-gray-900">3. Data Classification</h2>
          <p>All data within Errandr Ops is classified as either Confidential (user PII, financial records, authentication tokens), Internal (operational metrics, vendor applications, order data), or Public (published terms, public-facing content). Handling procedures differ based on classification level.</p>
        </section>
        <section>
          <h2 class="text-xl font-bold text-gray-900">4. Audit Logging</h2>
          <p>All administrative actions are logged with actor identification, timestamp, action type, and affected resources. Logs are retained for a minimum of 12 months and are available for review in the System → Audit Logs section. Tampering with audit logs is a terminable offense.</p>
        </section>
        <section>
          <h2 class="text-xl font-bold text-gray-900">5. Incident Response</h2>
          <p>Security incidents must be reported immediately to the Engineering team. The incident response process follows: Identify → Contain → Eradicate → Recover → Lessons Learned. All incidents are documented and reviewed within 48 hours of resolution.</p>
        </section>
        <section>
          <h2 class="text-xl font-bold text-gray-900">6. Data Privacy</h2>
          <p>Customer personal data must only be accessed for legitimate operational purposes. Bulk data exports require management approval. Sharing user data with unauthorized parties is strictly prohibited and may result in legal action. All data is encrypted both in transit (TLS 1.3) and at rest (AES-256).</p>
        </section>
        <section>
          <h2 class="text-xl font-bold text-gray-900">7. Acceptable Use</h2>
          <p>The Errandr Ops platform must only be used for authorized business purposes. Personal use, sharing credentials, accessing data outside your role's scope, or using the platform from unsecured networks is prohibited.</p>
        </section>
        <section>
          <h2 class="text-xl font-bold text-gray-900">8. Contact</h2>
          <p>For security concerns or policy questions, contact the security team at <a href="mailto:security@errandr.com" class="text-gray-900 font-bold hover:underline">security@errandr.com</a>.</p>
        </section>
      </div>
    </main>
    <footer class="bg-gray-50 border-t border-gray-200 py-8"><div class="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400 font-medium"><p>&copy; {{ new Date().getFullYear() }} Errandr Ops — Confidential</p><div class="flex items-center gap-6"><NuxtLink to="/about" class="hover:text-gray-600">About</NuxtLink><NuxtLink to="/contact" class="hover:text-gray-600">Contact</NuxtLink><NuxtLink to="/faq" class="hover:text-gray-600">FAQ</NuxtLink><NuxtLink to="/terms" class="hover:text-gray-600">Terms</NuxtLink></div></div></footer>
  </div>
</template>
<script setup lang="ts">
import { ShieldCheck } from 'lucide-vue-next'
definePageMeta({ layout: false })
useHead({ title: 'Security Policy - Errandr Ops' })
</script>
