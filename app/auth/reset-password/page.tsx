'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ResetPasswordPage } from '@/components/auth/ResetPasswordPage';
import { updatePassword, supabase } from '@/lib/supabase';
import { handleAuthError, showAuthSuccess } from '@/lib/utils/authErrors';
import type { ResetPasswordFormData } from '@/lib/types/auth';

export default function ResetPasswordPageRoute() {
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
        const { data, error } = await supabase.auth.setSession({
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            Validando enlace...
          </p>
        </div>
      </div>
    );
  }

  return (
    <ResetPasswordPage
      onSubmit={handleResetPassword}
      isLoading={isLoading}
    />
  );
}
