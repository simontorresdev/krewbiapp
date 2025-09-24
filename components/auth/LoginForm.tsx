'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useLoginForm } from '@/lib/hooks/useLoginForm';
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
        <Label htmlFor="email" className="text-white">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="m@example.com"
          value={formData.email}
          onChange={(e) => updateField('email', e.target.value)}
          className="bg-transparent border-gray-600 text-white placeholder:text-gray-500 focus:border-gray-400 focus:ring-0"
          disabled={isLoading}
        />
        {errors.email && (
          <p className="text-sm text-red-400">{errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-white">
            Password
          </Label>
          <button
            type="button"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Forgot your password?
          </button>
        </div>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => updateField('password', e.target.value)}
          className="bg-transparent border-gray-600 text-white placeholder:text-gray-500 focus:border-gray-400 focus:ring-0"
          disabled={isLoading}
        />
        {errors.password && (
          <p className="text-sm text-red-400">{errors.password}</p>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full bg-white text-black hover:bg-gray-100 transition-colors"
        disabled={isLoading}
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
}
