import { computed } from 'vue';
import { useCookie } from '#app';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar?: string;
  matricNumber?: string;
}

export const useUser = () => {
  const token = useCookie<string | null>('errandr_token', {
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
    sameSite: 'lax',
  });
  
  const refreshToken = useCookie<string | null>('errandr_refresh_token', {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
    sameSite: 'lax',
  });
  
  const user = useCookie<User | null>('errandr_user', {
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
    sameSite: 'lax',
  });

  const setUser = (userData: User) => {
    user.value = userData;
  };

  const setToken = (newToken: string) => {
    token.value = newToken;
  };

  const setRefreshToken = (newRefreshToken: string) => {
    refreshToken.value = newRefreshToken;
  };

  const logOut = () => {
    user.value = null;
    token.value = null;
    refreshToken.value = null;
    
    // Use vanilla JS to remove cookies as well as fallback
    document.cookie = 'errandr_token=; Max-Age=0; path=/;';
    document.cookie = 'errandr_refresh_token=; Max-Age=0; path=/;';
    document.cookie = 'errandr_user=; Max-Age=0; path=/;';
    
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Force a hard reload to clear all states and bypass Nuxt router middleware reactivity bugs
    window.location.href = '/';
  };

  const isLoggedIn = computed(() => !!token.value);

  const fullName = computed(() => {
    if (!user.value) return '';
    return `${user.value.firstName} ${user.value.lastName}`;
  });

  return {
    user,
    token,
    refreshToken,
    setUser,
    setToken,
    setRefreshToken,
    logOut,
    isLoggedIn,
    fullName
  };
};
