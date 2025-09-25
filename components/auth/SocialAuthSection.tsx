'use client';

import { Button } from '@/components/ui/button';
import type { AuthProvider } from '@/lib/types/auth';

interface SocialAuthButtonProps {
  provider: AuthProvider;
  isLoading?: boolean;
  disabled?: boolean;
}

export function SocialAuthButton({ provider, isLoading = false, disabled = false }: SocialAuthButtonProps) {
  const Icon = provider.icon;
  
  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className="w-full bg-white/10 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white hover:bg-white/20 dark:hover:bg-gray-700/50 transition-colors duration-200"
      onClick={provider.onClick}
      disabled={isLoading || disabled}
    >
      <Icon className="w-4 h-4 mr-2" />
      {provider.name}
    </Button>
  );
}

interface SocialAuthSectionProps {
  providers: AuthProvider[];
  isLoading?: boolean;
}

export function SocialAuthSection({ providers, isLoading = false }: SocialAuthSectionProps) {
  return (
    <div className="space-y-3">
      {providers.map((provider) => (
        <SocialAuthButton
          key={provider.id}
          provider={provider}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}
