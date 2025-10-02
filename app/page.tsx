'use client';

import { CompanyLogo } from '@/components/auth/CompanyLogo';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { MatchCard } from '@/components/matches/MatchCard';
import { getActiveMatches } from '@/lib/matches';
import type { MatchWithStats } from '@/lib/types/matches';
import { useEffect, useState } from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
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
    <div className="min-h-screen">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="flex justify-between items-center">
          <CompanyLogo />
          
          {!isAuthenticated && (
            <Link href="/login">
              <Button className="bg-app-primary hover:bg-app-primary-hover text-app-primary-text">
                Iniciar Sesión
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Matches Section */}
      <div className="max-w-4xl mx-auto px-6 pb-12">
        <div className="mb-6 text-center">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            Partidos Disponibles
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Encuentra el partido perfecto para ti
          </p>
        </div>

        {/* Matches List */}
        {loadingMatches ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" text="Cargando partidos..." />
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex items-center justify-center w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-xl mx-auto mb-4">
              <Calendar className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No hay partidos disponibles
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
              ¡Pronto habrá nuevos partidos disponibles!
            </p>
            {!isAuthenticated && (
              <Link href="/signup">
                <Button className="bg-app-primary hover:bg-app-primary-hover text-app-primary-text">
                  Crear cuenta para ser notificado
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </div>

      {/* CTA for non-authenticated users */}
      {!isAuthenticated && matches.length > 0 && (
        <div className="max-w-4xl mx-auto px-6 pb-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              ¡Únete a la comunidad!
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
              Crea tu cuenta gratis y comienza a participar en partidos increíbles.
            </p>
            <div className="space-y-3">
              <Link href="/signup" className="block">
                <Button className="w-full bg-app-primary hover:bg-app-primary-hover text-app-primary-text">
                  Crear Cuenta Gratis
                </Button>
              </Link>
              <Link href="/login" className="block">
                <Button variant="ghost" className="w-full text-gray-600 dark:text-gray-300">
                  Ya tengo cuenta
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}