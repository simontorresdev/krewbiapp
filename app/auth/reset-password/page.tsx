'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ResetPasswordPage } from '@/components/auth/ResetPasswordPage';
import { updatePassword, supabase } from '@/lib/supabase';
import { handleAuthError, showAuthSuccess } from '@/lib/utils/authErrors';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import type { ResetPasswordFormData } from '@/lib/types/auth';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);

  useEffect(() => {
    const handleTokenValidation = async () => {
      // Obtener los parámetros de la URL (enviados por Supabase)
      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');
      const type = searchParams.get('type');

      if (accessToken && refreshToken && type === 'recovery') {
        // Establecer la sesión usando los tokens
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        });

        if (error) {
          console.error('Error setting session:', error);
          router.push('/forgot-password?error=' + encodeURIComponent('Token inválido o expirado'));
          return;
        }

        setIsValidToken(true);
      } else {
        // Verificar si ya hay una sesión activa
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          setIsValidToken(true);
        } else {
          router.push('/forgot-password');
        }
      }
    };

    handleTokenValidation();
  }, [searchParams, router]);

  const handleResetPassword = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    try {
      const { error } = await updatePassword(data.password);
      
      if (error) {
        handleAuthError(error);
        return;
      }

      showAuthSuccess('¡Contraseña actualizada exitosamente!');
      // Redirigir al login después de un breve delay
      setTimeout(() => {
        router.push('/login');
      }, 2000);
      
    } catch (error) {
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mostrar loading mientras se valida el token
  if (!isValidToken) {
    return (
      <LoadingSpinner 
        size="lg" 
        text="Validando enlace..." 
        fullScreen 
      />
    );
  }

  return (
    <ResetPasswordPage
      onSubmit={handleResetPassword}
      isLoading={isLoading}
    />
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={<LoadingSpinner size="lg" text="Cargando..." fullScreen />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
