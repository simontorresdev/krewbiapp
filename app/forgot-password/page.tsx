'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ForgotPasswordPage } from '@/components/auth/ForgotPasswordPage';
import { resetPassword } from '@/lib/supabase';
import { handleAuthError, showAuthSuccess } from '@/lib/utils/authErrors';
import type { ForgotPasswordFormData } from '@/lib/types/auth';

export default function ForgotPasswordPageRoute() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      const { error } = await resetPassword(data.email);
      
      if (error) {
        handleAuthError(error);
        return;
      }

      showAuthSuccess('¡Enlace de recuperación enviado! Revisa tu email.');
      // Redirigir a una página de confirmación o login
      setTimeout(() => {
        router.push('/login');
      }, 2000);
      
    } catch (error) {
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ForgotPasswordPage
      onSubmit={handleForgotPassword}
      isLoading={isLoading}
    />
  );
}
