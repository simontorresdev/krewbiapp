'use client';

import { CompanyLogo } from './CompanyLogo';
import { ResetPasswordForm } from './ResetPasswordForm';
import { ShieldCheck } from 'lucide-react';
import type { ResetPasswordProps } from '@/lib/types/auth';

export function ResetPasswordPage({
  onSubmit,
  isLoading = false,
}: ResetPasswordProps) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md mx-auto p-8">
        <div className="text-center">
          {/* Logo de la empresa */}
          <CompanyLogo className="mb-8" />
          
          {/* Icono de seguridad */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          
          {/* Mensaje principal */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Crea una nueva contraseña
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Tu nueva contraseña debe ser diferente a las anteriores
            </p>
          </div>
          
          {/* Formulario de reset */}
          <div className="space-y-6">
            <ResetPasswordForm onSubmit={onSubmit!} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}
