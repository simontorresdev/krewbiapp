'use client';

import Image from 'next/image';

interface CompanyLogoProps {
  className?: string;
}

export function CompanyLogo({ className = '' }: CompanyLogoProps) {
  return (
    <div className={`flex items-center justify-center mb-8 ${className}`}>
      <Image
        src="/krewbi-logo.png"
        alt="Krewbi Logo"
        width={220}
        height={10}
        className="object-contain"
        priority
      />
    </div>
  );
}
