'use client';

import { Building2 } from 'lucide-react';

interface CompanyLogoProps {
  companyName?: string;
  className?: string;
}

export function CompanyLogo({ companyName = 'Acme Inc.', className = '' }: CompanyLogoProps) {
  return (
    <div className={`flex items-center gap-2 mb-8 ${className}`}>
      <div className="flex items-center justify-center w-8 h-8 bg-white/10 rounded-lg">
        <Building2 className="w-5 h-5 text-white" />
      </div>
      <span className="text-white font-medium">{companyName}</span>
    </div>
  );
}
