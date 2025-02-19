// hooks/useAuth.ts
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/auth';

export function useAuth(requiredRole?: string) {
  const router = useRouter();

  useEffect(() => {
    if (!auth.isAuthenticated()) {
      router.push('/login');
      return;
    }

    if (requiredRole && !auth.hasRole(requiredRole)) {
      router.push('/');
    }
  }, [router, requiredRole]);

  return auth.getUser();
}