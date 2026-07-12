import { useUser } from '@/composables/modules/auth/user'

export default defineNuxtRouteMiddleware((to, from) => {
  const { isLoggedIn } = useUser()

  const publicRoutes = ['/']

  // If the user is not logged in and trying to access a protected route
  if (!isLoggedIn.value && !publicRoutes.includes(to.path)) {
    return navigateTo('/')
  }

  // If the user is logged in and trying to access login page
  if (isLoggedIn.value && to.path === '/') {
    return navigateTo('/dashboard')
  }
})
