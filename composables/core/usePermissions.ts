import { computed } from 'vue'
import { useUser } from '@/composables/modules/auth/user'

export const usePermissions = () => {
  const { user } = useUser()

  /**
   * Check if the currently logged in user has a specific permission.
   * If the user doesn't have an adminDepartment, they are assumed to be a Super Admin
   * and have full access to all permissions.
   * @param permission The permission string to check
   */
  const hasPermission = (permission: string) => {
    // If no user, or user is not an admin, return false
    if (!user.value || user.value.role !== 'admin') {
      return false
    }

    // If the user has no assigned department, assume Super Admin privileges
    if (!user.value.adminDepartment) {
      return true
    }

    // Check if the permission exists in their department's permissions array
    const permissions = user.value.adminDepartment?.permissions || []
    return permissions.includes(permission)
  }

  /**
   * Check if the currently logged in user has access to a specific module path.
   * This is used primarily for the sidebar.
   * @param path The module path to check (e.g. '/dashboard')
   */
  const hasModuleAccess = (path: string) => {
    // If no user, or user is not an admin, return false
    if (!user.value || user.value.role !== 'admin') {
      return false
    }

    // If the user has no assigned department, assume Super Admin privileges
    if (!user.value.adminDepartment) {
      return true
    }

    // Check if the path exists in their department's modules array
    const modules = user.value.adminDepartment?.modules || []
    return modules.includes(path) || modules.some(m => path.startsWith(m) && m !== '/')
  }

  return {
    hasPermission,
    hasModuleAccess
  }
}
