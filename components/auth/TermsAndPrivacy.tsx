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
      Al crear una cuenta, aceptas nuestros{' '}
      <Link 
        href={termsUrl} 
        className="underline hover:text-gray-400 transition-colors"
      >
        Términos de Servicio
      </Link>{' '}
      y{' '}
      <Link 
        href={privacyUrl} 
        className="underline hover:text-gray-400 transition-colors"
      >
        Política de Privacidad
      </Link>
    </p>
  );
}
