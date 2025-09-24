'use client';

import Link from 'next/link';

interface TermsAndPrivacyProps {
  termsUrl?: string;
  privacyUrl?: string;
  className?: string;
}

export function TermsAndPrivacy({ 
  termsUrl = '/terms', 
  privacyUrl = '/privacy',
  className = '' 
}: TermsAndPrivacyProps) {
  return (
    <p className={`text-center text-xs text-gray-500 leading-relaxed ${className}`}>
      By clicking continue, you agree to our{' '}
      <Link 
        href={termsUrl} 
        className="underline hover:text-gray-400 transition-colors"
      >
        Terms of Service
      </Link>{' '}
      and{' '}
      <Link 
        href={privacyUrl} 
        className="underline hover:text-gray-400 transition-colors"
      >
        Privacy Policy
      </Link>
    </p>
  );
}
