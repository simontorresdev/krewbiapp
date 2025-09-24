'use client';

import { Apple, Chrome } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { CompanyLogo } from './CompanyLogo';
import { SocialAuthSection } from './SocialAuthSection';
import { AuthSeparator } from './AuthSeparator';
import { LoginForm } from './LoginForm';
import { SignUpPrompt } from './SignUpPrompt';
import { TermsAndPrivacy } from './TermsAndPrivacy';
import type { LoginProps, AuthProvider } from '@/lib/types/auth';

export function LoginPage({
  onLogin,
  onAppleLogin,
  onGoogleLogin,
  isLoading = false,
}: LoginProps) {
  const socialProviders: AuthProvider[] = [
    {
      id: 'apple',
      name: 'Login with Apple',
      icon: Apple,
      onClick: async () => {
        await onAppleLogin?.();
      },
    },
    {
      id: 'google',
      name: 'Login with Google',
      icon: Chrome,
      onClick: async () => {
        await onGoogleLogin?.();
      },
    },
  ];

  return (
    <div className="min-h-screen bg-[#1f1f1f] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <CompanyLogo />
        
        <Card className="bg-[#0a0a0a] border-[#333333]">
          <CardContent className="p-8">
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-semibold text-white">
                  Welcome back
                </h1>
                <p className="text-gray-400 text-sm">
                  Login with your Apple or Google account
                </p>
              </div>

              {/* Social Auth */}
              <SocialAuthSection providers={socialProviders} isLoading={isLoading} />

              {/* Separator */}
              <AuthSeparator />

              {/* Login Form */}
              <LoginForm onSubmit={onLogin} isLoading={isLoading} />

              {/* Sign Up Prompt */}
              <SignUpPrompt className="mt-6" />
            </div>
          </CardContent>
        </Card>

        {/* Terms and Privacy */}
        <TermsAndPrivacy className="mt-6" />
      </div>
    </div>
  );
}
