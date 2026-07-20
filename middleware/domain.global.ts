export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) {
    const host = window.location.hostname
    
    // Aggressive redirect for missing WWW to fix Firebase Auth Authorized Domains issue
    if (host === 'admin.erranders.org') {
      window.location.href = `https://www.admin.erranders.org${to.fullPath}`
      return
    }
  }
})
