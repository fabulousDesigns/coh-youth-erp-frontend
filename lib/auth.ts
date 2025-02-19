// lib/auth.ts
import { User } from '@/types/user';
import Cookies from 'js-cookie';

export interface AuthResponse {
  token: string;
  user: User;
}

export const auth = {
  setAuth: (data: AuthResponse) => {
    Cookies.set('token', `Bearer ${data.token}`, {
      secure: true,
      sameSite: 'strict',
    });
    Cookies.set('user', JSON.stringify(data.user), {
      secure: true,
      sameSite: 'strict',
    });
  },

  clearAuth: () => {
    Cookies.remove('token');
    Cookies.remove('user');
  },

  getUser: (): User | null => {
    const userStr = Cookies.get('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  getToken: (): string | null => {
    return Cookies.get('token') || null;
  },

  isAuthenticated: (): boolean => {
    return !!Cookies.get('token');
  },

  hasRole: (role: string): boolean => {
    const user = auth.getUser();
    return user?.role === role;
  },
};