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
      className="w-full bg-transparent border-[#333333] text-white hover:bg-[#1a1a1a] hover:border-[#444444] transition-colors"
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
