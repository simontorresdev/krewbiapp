'use client';

import Link from 'next/link';

interface SignUpPromptProps {
  signUpUrl?: string;
  className?: string;
}

export function SignUpPrompt({ signUpUrl = '/signup', className = '' }: SignUpPromptProps) {
  return (
    <p className={`text-center text-sm text-gray-400 ${className}`}>
      Don&apos;t have an account?{' '}
      <Link 
        href={signUpUrl} 
        className="text-white hover:underline transition-colors"
      >
        Sign up
      </Link>
    </p>
  );
}
