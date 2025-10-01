'use client';

import { CompanyLogo } from '@/components/auth/CompanyLogo';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/contexts/AuthContext';
import { signOut } from '@/lib/supabase';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import Link from 'next/link';

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <LoadingSpinner 
        size="lg" 
        text="Cargando aplicación..." 
        fullScreen 
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md mx-auto p-8">
        <div className="text-center">
          {/* Logo de la empresa */}
          <CompanyLogo className="mb-12" />
          
          {/* Mensaje de bienvenida personalizado */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {isAuthenticated ? `¡Hola, ${user?.user_metadata?.full_name || user?.email}!` : 'Bienvenido a Krewbi'}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {isAuthenticated ? 'Es genial tenerte de vuelta' : 'Juega, disfruta y comparte'}
            </p>
          </div>
          
          {/* Botones condicionales */}
          {isAuthenticated ? (
            <div className="space-y-4">
              <Button 
                className="w-full"
                size="lg"
                variant="default"
              >
                Ir al Dashboard
              </Button>
              <Button
                className="w-full border-app-error text-app-error hover:bg-app-error hover:text-app-error-text"
                size="lg"
                variant="outline"
                onClick={handleSignOut}
              >
                Cerrar Sesión
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button 
                className="w-full"
                size="lg"
              >
                Iniciar Sesión
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}