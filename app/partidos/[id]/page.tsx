'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, MapPin, Users } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useAuth } from '@/lib/contexts/AuthContext';
import { getMatchById, getMatchPlayers, registerForMatch, unregisterFromMatch, isUserRegistered } from '@/lib/matches';
import type { MatchWithStats, MatchPlayer } from '@/lib/types/matches';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function MatchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [match, setMatch] = useState<MatchWithStats | null>(null);
  const [players, setPlayers] = useState<MatchPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [userRegistered, setUserRegistered] = useState(false);

  const matchId = params.id as string;

  const loadMatchData = useCallback(async () => {
    try {
      const [matchData, playersData] = await Promise.all([
        getMatchById(matchId),
        getMatchPlayers(matchId)
      ]);

      if (!matchData) {
        toast.error('Partido no encontrado');
        router.push('/');
        return;
      }

      setMatch(matchData);
      setPlayers(playersData);
    } catch (error) {
      console.error('Error loading match data:', error);
      toast.error('Error al cargar el partido');
    } finally {
      setLoading(false);
    }
  }, [matchId, router]);

  const checkUserRegistration = useCallback(async () => {
    try {
      const registered = await isUserRegistered(matchId);
      setUserRegistered(registered);
    } catch (error) {
      console.error('Error checking registration:', error);
    }
  }, [matchId]);

  useEffect(() => {
    if (matchId) {
      loadMatchData();
    }
  }, [matchId, loadMatchData]);

  useEffect(() => {
    if (isAuthenticated && matchId) {
      checkUserRegistration();
    }
  }, [isAuthenticated, matchId, checkUserRegistration]);

  const handleRegister = async (position: 'player' | 'goalkeeper') => {
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para inscribirte');
      router.push('/login');
      return;
    }

    setRegistering(true);
    try {
      const result = await registerForMatch(matchId, position);
      
      if (result.success) {
        toast.success('¡Te has inscrito exitosamente!');
        setUserRegistered(true);
        // Recargar datos
        await loadMatchData();
      } else {
        toast.error(result.error || 'Error al inscribirse');
      }
    } catch (error) {
      console.error('Error registering:', error);
      toast.error('Error inesperado al inscribirse');
    } finally {
      setRegistering(false);
    }
  };

  const handleUnregister = async () => {
    setRegistering(true);
    try {
      const result = await unregisterFromMatch(matchId);
      
      if (result.success) {
        toast.success('Inscripción cancelada');
        setUserRegistered(false);
        // Recargar datos
        await loadMatchData();
      } else {
        toast.error(result.error || 'Error al cancelar inscripción');
      }
    } catch (error) {
      console.error('Error unregistering:', error);
      toast.error('Error inesperado');
    } finally {
      setRegistering(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString.slice(0, 5);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <LoadingSpinner 
        size="lg" 
        text="Cargando partido..." 
        fullScreen 
      />
    );
  }

  if (!match) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Partido no encontrado
          </h1>
          <Link href="/">
            <Button>Volver al inicio</Button>
          </Link>
        </div>
      </div>
    );
  }

  const regularPlayers = players.filter(p => p.position === 'player');
  const goalkeepers = players.filter(p => p.position === 'goalkeeper');
  const canRegisterAsPlayer = match.stats && match.stats.available_player_spots > 0;
  const canRegisterAsGoalkeeper = match.stats && match.stats.available_goalkeeper_spots > 0;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 pb-48">
        {/* Match Image */}
        <div className="relative aspect-video rounded-2xl overflow-hidden mb-6">
          {match.cover_image ? (
            <Image
              src={match.cover_image}
              alt={match.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <div className="text-gray-400 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  ⚽
                </div>
                <span>Sin imagen</span>
              </div>
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <div className="bg-white/90 backdrop-blur-sm text-gray-900 text-sm font-medium px-3 py-1 rounded-lg">
              {match.format}
            </div>
            {match.will_be_recorded && (
              <div className="bg-red-500 text-white text-sm font-medium px-3 py-1 rounded-lg flex items-center gap-1">
                🔴 Grabado
              </div>
            )}
          </div>
        </div>

        {/* Match Info */}
        <div className="space-y-6">
          {/* Title and basic info */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {match.title}
            </h1>
            
          </div>

          {/* Información del Partido */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Información del Partido</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Ubicación</p>
                <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {match.location}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Cancha</p>
                <p className="font-semibold text-gray-900 dark:text-white">Número {match.field_number}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Fecha y Hora</p>
                <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(match.match_date)} a las {formatTime(match.match_time)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Formato</p>
                <p className="font-semibold text-gray-900 dark:text-white">{match.format}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Cupos Ocupados</p>
                <p className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {match.stats ? match.stats.total_players + match.stats.total_goalkeepers : 0}/{match.max_players + match.max_goalkeepers}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Estado</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  match.stats?.is_full 
                    ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' 
                    : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                }`}>
                  {match.stats?.is_full ? 'Completo' : 'Disponible'}
                </span>
              </div>
            </div>
            
            {/* Precios */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">Precios</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Jugador de campo</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{formatPrice(match.player_price)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Arquero</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{formatPrice(match.goalkeeper_price)}</p>
                </div>
              </div>
            </div>

            {match.will_be_recorded && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-red-700 dark:text-red-300 text-sm font-medium flex items-center gap-2">
                  🔴 Este partido será grabado y transmitido
                </p>
              </div>
            )}
          </div>



          {/* Lista Unificada de Jugadores */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Users className="h-5 w-5" />
                Jugadores Inscritos
              </h2>
              <div className="text-sm text-gray-500">
                <span>{players.length}/{match.max_players + match.max_goalkeepers} jugadores</span>
              </div>
            </div>
            
            {players.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-8">No hay jugadores inscritos aún</p>
            ) : (
              <div className="space-y-3">
                {[...goalkeepers, ...regularPlayers].map((player) => (
                  <div key={player.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                      {player.avatar_url ? (
                        <Image
                          src={player.avatar_url}
                          alt={player.name}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-app-primary rounded-full flex items-center justify-center text-app-primary-text text-sm font-bold">
                          {player.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900 dark:text-white">{player.name}</p>
                        {player.position === 'goalkeeper' && (
                          <span className="text-lg">🧤</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        {player.position === 'goalkeeper' ? 'Arquero' : 'Jugador'}
                      </p>
                    </div>
                    <div className="text-xs">
                      <span className="text-green-600 font-medium">✅ Confirmado</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>


        </div>
      </div>
      
      {/* Fixed Registration Section */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="max-w-4xl mx-auto px-6 bg-white dark:bg-gray-800 p-6 border-t border-gray-200 dark:border-gray-700 shadow-lg rounded-t-2xl">
          {!isAuthenticated ? (
            <div className="text-center space-y-4">
              <h2 className="font-semibold text-gray-900 dark:text-white">¿Quieres jugar?</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Inicia sesión para inscribirte en este partido
              </p>
              <div className="space-y-3">
                <Link href="/login" className="block">
                  <Button className="w-full bg-app-primary hover:bg-app-primary-hover text-app-primary-text">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/signup" className="block">
                  <Button variant="ghost" className="w-full">
                    Crear Cuenta
                  </Button>
                </Link>
              </div>
            </div>
          ) : userRegistered ? (
            <div className="text-center space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <p className="text-green-700 dark:text-green-300 font-medium">
                  ✅ Ya estás inscrito en este partido
                </p>
              </div>
              <Button
                onClick={handleUnregister}
                disabled={registering}
                variant="ghost"
                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                {registering ? 'Cancelando...' : 'Cancelar inscripción'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="font-semibold text-gray-900 dark:text-white text-center">¿Quieres jugar?</h2>
              
              <div className="space-y-3">
                <Button
                  onClick={() => handleRegister('player')}
                  disabled={!canRegisterAsPlayer || registering || match.stats?.is_full}
                  className="w-full bg-app-primary hover:bg-app-primary-hover text-app-primary-text"
                >
                  {registering ? 'Inscribiendo...' : 
                   match.stats?.is_full ? 'Partido completo' :
                   !canRegisterAsPlayer ? 'Sin cupos de jugador' :
                   `Jugar (${formatPrice(match.player_price)})`}
                </Button>
                
                <Button
                  onClick={() => handleRegister('goalkeeper')}
                  disabled={!canRegisterAsGoalkeeper || registering || match.stats?.is_full}
                  variant="outline"
                  className="w-full"
                >
                  {registering ? 'Inscribiendo...' : 
                   match.stats?.is_full ? 'Partido completo' :
                   !canRegisterAsGoalkeeper ? 'Sin cupos de arquero' :
                   `Ser arquero (${formatPrice(match.goalkeeper_price)})`}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}