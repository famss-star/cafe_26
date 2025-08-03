import { useAuth } from './useAuth'
import { UserRole } from '@/types'

export function useRoleProtection(allowedRoles: UserRole[]) {
  const { user, loading } = useAuth()

  // Don't do any redirects here - let components handle their own redirects
  // Just return the state for components to decide what to render

  // Return loading state and whether access is granted
  return {
    loading,
    hasAccess: !loading && user && allowedRoles.includes(user.role as UserRole)
  }
}

// Pre-configured hooks for common roles
export const useAdminProtection = () => useRoleProtection(['admin', 'owner', 'super_user'])
export const useOwnerProtection = () => useRoleProtection(['owner', 'super_user'])
export const useSuperUserProtection = () => useRoleProtection(['super_user'])
export const useCustomerProtection = () => useRoleProtection(['customer'])
