'use client';

import { useEffect, ReactNode } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { AuthLoadingScreen } from '@/components/ui/loading-spinner';

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return <AuthLoadingScreen />;
  }

  // Si no está autenticado, no renderizar nada (se está redirigiendo)
  if (!loading && !isAuthenticated) {
    return null;
  }

  // Si está autenticado, renderizar el contenido
  return <>{children}</>;
}
