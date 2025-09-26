'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginPage } from '@/components/auth';
import { signInWithEmail } from '@/lib/supabase';
import { handleAuthError } from '@/lib/utils/authErrors';
import type { LoginFormData } from '@/lib/types/auth';

export default function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const { data: loginData, error } = await signInWithEmail(data.email, data.password);
      
      if (error) {
        handleAuthError(error);
        return;
      }

      if (loginData.user) {
        // Login exitoso - redirigir a la página principal
        router.push('/');
      }
    } catch (error) {
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    console.log('Login with Google - handled by LoginPage component');
  };

  return (
    <LoginPage
      onLogin={handleLogin}
      onGoogleLogin={handleGoogleLogin}
      isLoading={isLoading}
    />
  );
}
