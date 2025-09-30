'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useLoginForm } from '@/lib/hooks/useLoginForm';
import { FormLoadingSpinner } from '@/components/ui/loading-spinner';
import Link from 'next/link';
import type { LoginFormData } from '@/lib/types/auth';

interface LoginFormProps {
  onSubmit?: (data: LoginFormData) => Promise<void>;
  isLoading?: boolean;
}

export function LoginForm({ onSubmit, isLoading: externalLoading = false }: LoginFormProps) {
  const { formData, errors, isLoading: formLoading, updateField, handleSubmit } = useLoginForm();
  
  const isLoading = formLoading || externalLoading;

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(onSubmit);
  };

  return (
    <form onSubmit={onFormSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-900 dark:text-white">
          Correo electrónico
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Ingresa tu correo"
          value={formData.email}
          onChange={(e) => updateField('email', e.target.value)}
          className="bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-app-primary dark:focus:border-app-primary"
          disabled={isLoading}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-gray-900 dark:text-white">
            Contraseña
          </Label>
          <Link
            href="/forgot-password"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Olvidaste tu contraseña?
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="Ingresa tu contraseña"
          value={formData.password}
          onChange={(e) => updateField('password', e.target.value)}
          className="bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-app-primary dark:focus:border-app-primary"
          disabled={isLoading}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password}</p>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <FormLoadingSpinner text="Iniciando..." />
        ) : (
          'Iniciar Sesión'
        )}
      </Button>
    </form>
  );
}
