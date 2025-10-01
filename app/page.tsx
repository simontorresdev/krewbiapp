'use client';

import { CompanyLogo } from '@/components/auth/CompanyLogo';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/contexts/AuthContext';
import { signOut } from '@/lib/supabase';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { MatchCard } from '@/components/matches/MatchCard';
import { getActiveMatches } from '@/lib/matches';
import type { MatchWithStats } from '@/lib/types/matches';
import { useEffect, useState } from 'react';
import { Calendar, Plus } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [matches, setMatches] = useState<MatchWithStats[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      const activeMatches = await getActiveMatches();
      setMatches(activeMatches);
    } catch (error) {
      console.error('Error loading matches:', error);
    } finally {
      setLoadingMatches(false);
    }
  };

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <CompanyLogo />
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {isAuthenticated ? `¡Hola, ${user?.user_metadata?.full_name || user?.email}!` : 'Próximos Partidos'}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {isAuthenticated ? 'Encuentra tu próximo partido' : 'Únete a la comunidad y juega'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <Link href="/mis-partidos">
                    <Button variant="outline" size="sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      Mis Partidos
                    </Button>
                  </Link>
                  <Link href="/perfil">
                    <Button variant="outline" size="sm">
                      Mi Perfil
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button size="sm">
                      Iniciar Sesión
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button variant="outline" size="sm">
                      Registrarse
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Sección de partidos */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Partidos Disponibles
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Encuentra el partido perfecto para ti
              </p>
            </div>
            
            {!isAuthenticated && (
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  ¿Quieres participar?
                </p>
                <Link href="/signup">
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Cuenta
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Lista de partidos */}
          {loadingMatches ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" text="Cargando partidos..." />
            </div>
          ) : matches.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No hay partidos disponibles
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                ¡Pronto habrá nuevos partidos disponibles!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.map((match) => (
                <MatchCard key={match.id} match={match} />
              ))}
            </div>
          )}
        </div>

        {/* CTA para usuarios no autenticados */}
        {!isAuthenticated && matches.length > 0 && (
          <div className="bg-gradient-to-r from-app-primary to-app-primary-hover rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-app-primary-text mb-4">
              ¡Únete a la comunidad!
            </h3>
            <p className="text-app-primary-text/80 mb-6 max-w-2xl mx-auto">
              Crea tu cuenta gratis y comienza a participar en partidos increíbles. 
              Conoce gente nueva, mejora tu juego y diviértete.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/signup">
                <Button variant="outline" size="lg" className="bg-white text-app-primary hover:bg-gray-100">
                  Crear Cuenta Gratis
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-app-primary">
                  Ya tengo cuenta
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}