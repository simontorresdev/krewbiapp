'use client';

import { Chromium } from 'lucide-react';
import { CompanyLogo } from './CompanyLogo';
import { SocialAuthSection } from './SocialAuthSection';
import { AuthSeparator } from './AuthSeparator';
import { SignUpForm } from './SignUpForm';
import { LoginPrompt } from './LoginPrompt';
import { TermsAndPrivacy } from './TermsAndPrivacy';
import { signInWithGoogle } from '@/lib/supabase';
import type { SignUpProps, AuthProvider } from '@/lib/types/auth';

export function SignUpPage({
  onSignUp,
  onGoogleSignUp,
  isLoading = false,
}: SignUpProps) {
  const handleGoogleSignUp = async () => {
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        console.error('Error al registrarse con Google:', error);
      } else {
        // La redirección se maneja automáticamente
        await onGoogleSignUp?.();
      }
    } catch (error) {
      console.error('Error inesperado:', error);
    }
  };

  const socialProviders: AuthProvider[] = [
    {
      id: 'google',
      name: 'Registrarse con Google',
      icon: Chromium,
      onClick: handleGoogleSignUp,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="w-full max-w-md mx-auto p-8">
        <div className="text-center">
          {/* Logo de la empresa */}
          <CompanyLogo className="mb-12" />
          
          {/* Mensaje de bienvenida */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Crear cuenta
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Únete a Krewbi y comienza a jugar
            </p>
          </div>
          
          {/* Contenido del formulario */}
          <div className="space-y-6">
            {/* Social Auth */}
            <SocialAuthSection providers={socialProviders} isLoading={isLoading} />

            {/* Separator */}
            <AuthSeparator />

            {/* Sign Up Form */}
            <SignUpForm onSubmit={onSignUp!} isLoading={isLoading} />

            {/* Login Prompt */}
            <LoginPrompt className="mt-6" />
            
            {/* Terms and Privacy */}
            <TermsAndPrivacy className="mt-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
