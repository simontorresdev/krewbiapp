'use client';

import { CompanyLogo } from '@/components/auth/CompanyLogo';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/hooks/useAuth';
import { signOut } from '@/lib/supabase';
import Link from 'next/link';

export default function HomePage() {
  const { user, loading, isAuthenticated } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <div className="w-32 h-4 bg-gray-300 rounded mx-auto"></div>
          </div>
        </div>
      </div>
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
                className="w-full"
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