'use client';

import Image from 'next/image';
import Link from 'next/link';

interface CompanyLogoProps {
  className?: string;
}

export function CompanyLogo({ className = '' }: CompanyLogoProps) {
  return (
    <div className={`flex items-center justify-center mb-8 ${className}`}>
      <Link href="/" className="cursor-pointer transition-opacity hover:opacity-80">
        <Image
          src="/krewbi-logo.png"
          alt="Krewbi Logo"
          width={220}
          height={10}
          className="object-contain"
          priority
        />
      </Link>
    </div>
  );
}
