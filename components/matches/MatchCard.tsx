'use client';

import { Button } from '@/components/ui/button';
import { MapPin, Clock, Users } from 'lucide-react';
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
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Mañana';
    } else {
      return date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short'
      });
    }
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

  const getTotalSpots = () => {
    if (!match.stats) return { registered: 0, total: match.max_players + match.max_goalkeepers };
    
    const { total_players, total_goalkeepers } = match.stats;
    const totalRegistered = total_players + total_goalkeepers;
    const maxTotal = match.max_players + match.max_goalkeepers;
    
    return { registered: totalRegistered, total: maxTotal };
  };

  const spots = getTotalSpots();
  const isFull = match.stats?.is_full || spots.registered >= spots.total;

  return (
    <div className={`group cursor-pointer ${className}`}>
      <Link href={`/partidos/${match.id}`}>
        {/* Image */}
        <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
          {match.cover_image ? (
            <Image
              src={match.cover_image}
              alt={match.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <div className="text-gray-400 text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                  ⚽
                </div>
                <span className="text-sm">Sin imagen</span>
              </div>
            </div>
          )}
          
          {/* Format badge */}
          <div className="absolute top-3 left-3">
            <div className="bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-medium px-2 py-1 rounded-lg">
              {match.format}
            </div>
          </div>

          {/* Recording badge */}
          {match.will_be_recorded && (
            <div className="absolute top-3 right-3">
              <div className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-lg flex items-center gap-1">
                🔴 Grabado
              </div>
            </div>
          )}

          {/* Availability overlay */}
          {isFull && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="bg-white text-gray-900 px-3 py-2 rounded-lg font-medium">
                Completo
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-1">
          {/* Match title */}
          <h3 className="font-medium text-gray-900 dark:text-white truncate">
            {match.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 text-sm">
            <MapPin className="h-3 w-3" />
            <span>{match.location} - Cancha {match.field_number}</span>
          </div>

          {/* Date and time */}
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 text-sm">
            <Clock className="h-3 w-3" />
            <span>{formatDate(match.match_date)} a las {formatTime(match.match_time)}</span>
          </div>

          {/* Availability */}
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 text-sm">
            <Users className="h-3 w-3" />
            <span>{spots.registered}/{spots.total} cupos ocupados</span>
          </div>
        </div>
      </Link>

      {/* CTA Button */}
      <div className="mt-3">
        <Link href={`/partidos/${match.id}`}>
          <Button 
            className="w-full bg-app-primary hover:bg-app-primary-hover text-app-primary-text font-medium py-2.5"
            disabled={isFull}
          >
            {isFull ? 'Completo' : 'Quiero jugar'}
          </Button>
        </Link>
      </div>
    </div>
  );
}