'use client';

import { CompanyLogo } from '@/components/auth/CompanyLogo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="w-full max-w-md mx-auto p-8">
        <div className="text-center">
          {/* Logo de la empresa */}
          <CompanyLogo className="mb-12" />
          
          {/* Mensaje de bienvenida */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Bienvenido a Krewbi
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Juega, disfruta y comparte
            </p>
          </div>
          
          {/* Botón para ir al login */}
          <Link href="/login">
            <Button 
              className="w-full"
              size="lg"
            >
              Iniciar Sesión
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}