'use client';

import { LoginPage } from '@/components/auth';
import type { LoginFormData } from '@/lib/types/auth';

export default function Home() {
  const handleLogin = async (data: LoginFormData) => {
    console.log('Login with email:', data);
  };

  const handleAppleLogin = async () => {
    console.log('Login with Apple');
  };

  const handleGoogleLogin = async () => {
    console.log('Login with Google');
  };

  return (
    <LoginPage
      onLogin={handleLogin}
      onAppleLogin={handleAppleLogin}
      onGoogleLogin={handleGoogleLogin}
    />
  );
}