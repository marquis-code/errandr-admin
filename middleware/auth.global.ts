import { useUser } from '@/composables/modules/auth/user'

export default defineNuxtRouteMiddleware((to, from) => {
  const { isLoggedIn } = useUser()

  const publicRoutes = ['/']

  // If the user is not logged in and trying to access a protected route
  if (!isLoggedIn.value && !publicRoutes.includes(to.path)) {
    return navigateTo('/')
  }

  if (isLoggedIn.value && to.path === '/') {
    const { hasModuleAccess } = usePermissions()
    if (hasModuleAccess('/dashboard')) {
      return navigateTo('/dashboard')
    } else {
      return navigateTo('/orders')
    }
  }

  // If user is logged in, restrict access to modules they don't have permission for
  if (isLoggedIn.value && to.path !== '/') {
    const { hasModuleAccess } = usePermissions()
    if (!hasModuleAccess(to.path)) {
      return navigateTo('/orders') // fallback
    }
  }
})
