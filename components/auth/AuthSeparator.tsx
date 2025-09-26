'use client';

import { Separator } from '@/components/ui/separator';

interface AuthSeparatorProps {
  text?: string;
}

export function AuthSeparator({ text = 'O continua con' }: AuthSeparatorProps) {
  return (
    <div className="relative my-6">
      <Separator className="bg-gray-600" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="bg-[#172130] px-4 text-sm text-gray-400 rounded-full">
          {text}
        </span>
      </div>
    </div>
  );
}
