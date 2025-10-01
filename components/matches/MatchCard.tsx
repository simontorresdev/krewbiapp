'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, Video, DollarSign } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { MatchWithStats } from '@/lib/types/matches';

interface MatchCardProps {
  match: MatchWithStats;
  className?: string;
}

export function MatchCard({ match, className = '' }: MatchCardProps) {
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
    return timeString.slice(0, 5); // HH:MM
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getAvailabilityColor = () => {
    if (!match.stats) return 'bg-gray-500';
    
    const { available_player_spots, total_players, is_full } = match.stats;
    
    if (is_full) return 'bg-app-error';
    if (available_player_spots <= 2) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getAvailabilityText = () => {
    if (!match.stats) return 'Cargando...';
    
    const { total_players, total_goalkeepers, is_full } = match.stats;
    const totalRegistered = total_players + total_goalkeepers;
    const maxTotal = match.max_players + match.max_goalkeepers;
    
    if (is_full) return 'Completo';
    return `${totalRegistered}/${maxTotal} confirmados`;
  };

  return (
    <Link href={`/partidos/${match.id}`} className={`block ${className}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer border-2 hover:border-app-primary-light">
        <div className="relative h-48 bg-gradient-to-r from-app-primary to-app-primary-hover">
          {match.cover_image ? (
            <Image
              src={match.cover_image}
              alt={match.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Users className="h-16 w-16 text-app-primary-text opacity-80" />
            </div>
          )}
          
          {/* Badges en la esquina superior */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <Badge 
              className={`${getAvailabilityColor()} text-white font-medium px-3 py-1`}
            >
              {getAvailabilityText()}
            </Badge>
            
            {match.will_be_recorded && (
              <Badge className="bg-red-600 text-white font-medium px-3 py-1">
                <Video className="h-3 w-3 mr-1" />
                Grabado
              </Badge>
            )}
          </div>

          {/* Badge de formato en la esquina inferior izquierda */}
          <div className="absolute bottom-3 left-3">
            <Badge className="bg-black/70 text-white font-bold px-3 py-1">
              {match.format}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4 space-y-3">
          {/* Título */}
          <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2">
            {match.title}
          </h3>

          {/* Fecha y hora */}
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span className="capitalize">{formatDate(match.match_date)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{formatTime(match.match_time)}</span>
            </div>
          </div>

          {/* Ubicación */}
          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="h-4 w-4" />
            <span>{match.location} - Cancha {match.field_number}</span>
          </div>

          {/* Precios */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-1 text-sm">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-gray-600 dark:text-gray-400">
                Jugador: <span className="font-semibold text-green-600">{formatPrice(match.player_price)}</span>
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Arquero: <span className="font-semibold text-green-600">{formatPrice(match.goalkeeper_price)}</span>
            </div>
          </div>

          {/* Información adicional de jugadores */}
          {match.stats && (
            <div className="flex items-center justify-between pt-2 text-xs text-gray-500 dark:text-gray-400">
              <span>{match.stats.total_players} jugadores</span>
              <span>{match.stats.total_goalkeepers} arqueros</span>
              <span>{match.stats.available_player_spots} espacios libres</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}