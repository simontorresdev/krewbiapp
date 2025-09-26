'use client';

import { Chromium } from 'lucide-react';
import { CompanyLogo } from './CompanyLogo';
import { SocialAuthSection } from './SocialAuthSection';
import { AuthSeparator } from './AuthSeparator';
import { LoginForm } from './LoginForm';
import { SignUpPrompt } from './SignUpPrompt';
import { TermsAndPrivacy } from './TermsAndPrivacy';
import { signInWithGoogle } from '@/lib/supabase';
import type { LoginProps, AuthProvider } from '@/lib/types/auth';
import toast from 'react-hot-toast';

export function LoginPage({
  onLogin,
  isLoading = false,
}: LoginProps) {
  const handleGoogleLogin = async () => {
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        toast.error('Error al iniciar sesión con Google');
      }
    } catch {
      toast.error('Error inesperado');
    }
  };

  const socialProviders: AuthProvider[] = [
    {
      id: 'google',
      name: 'Iniciar sesión con Google',
      icon: Chromium,
      onClick: handleGoogleLogin,
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
              Bienvenido de vuelta
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Inicia sesión con tu cuenta de Google
            </p>
          </div>
          
          {/* Contenido del formulario */}
          <div className="space-y-6">
            {/* Social Auth */}
            <SocialAuthSection providers={socialProviders} isLoading={isLoading} />

            {/* Separator */}
            <AuthSeparator />

            {/* Login Form */}
            <LoginForm onSubmit={onLogin} isLoading={isLoading} />

            {/* Sign Up Prompt */}
            <SignUpPrompt className="mt-6" />
            
            {/* Terms and Privacy */}
            <TermsAndPrivacy className="mt-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
