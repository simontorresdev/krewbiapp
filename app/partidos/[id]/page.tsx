'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, MapPin, Users, Video, DollarSign, UserCheck, Shield } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useAuth } from '@/lib/contexts/AuthContext';
import { getMatchById, getMatchPlayers, registerForMatch, unregisterFromMatch, isUserRegistered } from '@/lib/matches';
import type { MatchWithStats, MatchPlayer } from '@/lib/types/matches';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function MatchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [match, setMatch] = useState<MatchWithStats | null>(null);
  const [players, setPlayers] = useState<MatchPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [userRegistered, setUserRegistered] = useState(false);

  const matchId = params.id as string;

  useEffect(() => {
    if (matchId) {
      loadMatchData();
    }
  }, [matchId]);

  useEffect(() => {
    if (isAuthenticated && matchId) {
      checkUserRegistration();
    }
  }, [isAuthenticated, matchId]);

  const loadMatchData = async () => {
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
  };

  const checkUserRegistration = async () => {
    try {
      const registered = await isUserRegistered(matchId);
      setUserRegistered(registered);
    } catch (error) {
      console.error('Error checking registration:', error);
    }
  };

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header con imagen de fondo */}
      <div className="relative h-64 bg-gradient-to-r from-app-primary to-app-primary-hover">
        {match.cover_image && (
          <Image
            src={match.cover_image}
            alt={match.title}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        
        {/* Navegación */}
        <div className="absolute top-4 left-4 z-10">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="bg-white/90 text-gray-900 hover:bg-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>

        {/* Badges */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
          <Badge className="bg-black/70 text-white font-bold px-3 py-1">
            {match.format}
          </Badge>
          {match.will_be_recorded && (
            <Badge className="bg-red-600 text-white font-medium px-3 py-1">
              <Video className="h-3 w-3 mr-1" />
              Grabado
            </Badge>
          )}
        </div>

        {/* Título */}
        <div className="absolute bottom-6 left-6 z-10">
          <h1 className="text-3xl font-bold text-white mb-2">
            {match.title}
          </h1>
          <div className="flex items-center gap-4 text-white/90">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span className="capitalize">{formatDate(match.match_date)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{formatTime(match.match_time)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Información del partido */}
          <div className="lg:col-span-2 space-y-6">
            {/* Detalles básicos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Información del Partido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Ubicación</p>
                    <p className="font-semibold">{match.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Cancha</p>
                    <p className="font-semibold">Número {match.field_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Formato</p>
                    <p className="font-semibold">{match.format}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Estado</p>
                    <Badge className={match.stats?.is_full ? 'bg-app-error' : 'bg-green-500'}>
                      {match.stats?.is_full ? 'Completo' : 'Disponible'}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Jugador:</span>
                    <span className="font-semibold text-green-600">{formatPrice(match.player_price)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Arquero:</span>
                    <span className="font-semibold text-green-600">{formatPrice(match.goalkeeper_price)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lista de jugadores */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Jugadores de campo */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Jugadores
                    </div>
                    <Badge variant="outline">
                      {regularPlayers.length}/{match.max_players}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {regularPlayers.length === 0 ? (
                    <p className="text-gray-500 text-sm">No hay jugadores inscritos aún</p>
                  ) : (
                    <div className="space-y-2">
                      {regularPlayers.map((player) => (
                        <div key={player.id} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                            {player.avatar_url ? (
                              <Image
                                src={player.avatar_url}
                                alt={player.name}
                                width={32}
                                height={32}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-app-primary rounded-full flex items-center justify-center text-app-primary-text text-sm font-bold">
                                {player.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{player.name}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(player.registeredAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <UserCheck className="h-4 w-4 text-green-500" />
                            <Badge variant={player.payment_status === 'paid' ? 'default' : 'outline'} className="text-xs">
                              {player.payment_status === 'paid' ? 'Pagado' : 'Pendiente'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Arqueros */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Arqueros
                    </div>
                    <Badge variant="outline">
                      {goalkeepers.length}/{match.max_goalkeepers}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {goalkeepers.length === 0 ? (
                    <p className="text-gray-500 text-sm">No hay arqueros inscritos aún</p>
                  ) : (
                    <div className="space-y-2">
                      {goalkeepers.map((player) => (
                        <div key={player.id} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800">
                          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                            {player.avatar_url ? (
                              <Image
                                src={player.avatar_url}
                                alt={player.name}
                                width={32}
                                height={32}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-yellow-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                {player.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{player.name}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(player.registeredAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <UserCheck className="h-4 w-4 text-green-500" />
                            <Badge variant={player.payment_status === 'paid' ? 'default' : 'outline'} className="text-xs">
                              {player.payment_status === 'paid' ? 'Pagado' : 'Pendiente'}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Panel de inscripción */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {userRegistered ? 'Ya estás inscrito' : 'Inscríbete al partido'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isAuthenticated ? (
                  <div className="text-center space-y-4">
                    <p className="text-gray-600 dark:text-gray-400">
                      Debes iniciar sesión para inscribirte
                    </p>
                    <div className="space-y-2">
                      <Link href="/login" className="w-full">
                        <Button className="w-full">Iniciar Sesión</Button>
                      </Link>
                      <Link href="/signup" className="w-full">
                        <Button variant="outline" className="w-full">Crear Cuenta</Button>
                      </Link>
                    </div>
                  </div>
                ) : userRegistered ? (
                  <div className="space-y-4">
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <UserCheck className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <p className="text-green-700 dark:text-green-300 font-medium">
                        ¡Estás inscrito en este partido!
                      </p>
                    </div>
                    <Button
                      onClick={handleUnregister}
                      disabled={registering}
                      variant="outline"
                      className="w-full border-app-error text-app-error hover:bg-app-error hover:text-app-error-text"
                    >
                      {registering ? 'Cancelando...' : 'Cancelar inscripción'}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Button
                        onClick={() => handleRegister('player')}
                        disabled={!canRegisterAsPlayer || registering}
                        className="w-full"
                      >
                        {registering ? 'Inscribiendo...' : `Inscribirse como jugador (${formatPrice(match.player_price)})`}
                      </Button>
                      {!canRegisterAsPlayer && (
                        <p className="text-xs text-gray-500 text-center">No hay espacios disponibles para jugadores</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Button
                        onClick={() => handleRegister('goalkeeper')}
                        disabled={!canRegisterAsGoalkeeper || registering}
                        variant="outline"
                        className="w-full"
                      >
                        {registering ? 'Inscribiendo...' : `Inscribirse como arquero (${formatPrice(match.goalkeeper_price)})`}
                      </Button>
                      {!canRegisterAsGoalkeeper && (
                        <p className="text-xs text-gray-500 text-center">No hay espacios disponibles para arqueros</p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Estadísticas */}
            {match.stats && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Estadísticas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total confirmados:</span>
                    <span className="font-semibold">
                      {match.stats.total_players + match.stats.total_goalkeepers}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Jugadores:</span>
                    <span className="font-semibold">
                      {match.stats.total_players}/{match.max_players}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Arqueros:</span>
                    <span className="font-semibold">
                      {match.stats.total_goalkeepers}/{match.max_goalkeepers}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Espacios disponibles:</span>
                    <span className="font-semibold">
                      {match.stats.available_player_spots + match.stats.available_goalkeeper_spots}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}