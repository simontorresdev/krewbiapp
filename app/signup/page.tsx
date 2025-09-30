'use client';

import { SignUpPage } from '@/components/auth';
import { signUpWithEmail } from '@/lib/supabase';
import { handleAuthError } from '@/lib/utils/authErrors';
import { SignUpFormData } from '@/lib/types/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignUp() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (data: SignUpFormData) => {
    setIsLoading(true);
    try {
      const { data: signUpData, error } = await signUpWithEmail(
        data.email, 
        data.password, 
        data.fullName, 
        data.phoneNumber
      );
      
      if (error) {
        handleAuthError(error);
        return;
      }

      if (signUpData.user) {
        // Redirigir a la página de éxito con el email
        router.push(`/signup/success?email=${encodeURIComponent(data.email)}`);
      }
    } catch (error) {
      handleAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    // Google OAuth maneja la redirección automáticamente
    console.log('Registro con Google completado');
  };

  return (
    <SignUpPage
      onSignUp={handleSignUp}
      onGoogleSignUp={handleGoogleSignUp}
      isLoading={isLoading}
    />
  );
}
