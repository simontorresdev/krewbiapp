'use client';

import { CompanyLogo } from './CompanyLogo';
import { ForgotPasswordForm } from './ForgotPasswordForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { ForgotPasswordProps } from '@/lib/types/auth';

export function ForgotPasswordPage({
  onSubmit,
  isLoading = false,
}: ForgotPasswordProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="w-full max-w-md mx-auto p-8">
        <div className="text-center">
          {/* Logo de la empresa */}
          <CompanyLogo className="mb-8" />
          
          {/* Mensaje principal */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              ¿Olvidaste tu contraseña?
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              No te preocupes, te enviaremos un enlace para recuperarla
            </p>
          </div>
          
          {/* Formulario de recuperación */}
          <div className="space-y-6">
            <ForgotPasswordForm onSubmit={onSubmit!} isLoading={isLoading} />
            
            {/* Enlace para volver al login */}
            <div className="flex items-center justify-center">
              <Link 
                href="/login" 
                className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al inicio de sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
