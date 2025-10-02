import { createClient } from '@supabase/supabase-js';
import type { Match, MatchStats, MatchWithStats, MatchPlayer } from '@/lib/types/matches';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Obtiene todos los partidos activos con sus estadísticas
 */
export async function getActiveMatches(): Promise<MatchWithStats[]> {
  try {
    // Obtener partidos activos
    const { data: matches, error: matchesError } = await supabase
      .from('matches')
      .select('*')
      .eq('status', 'active')
      .gte('match_date', new Date().toISOString().split('T')[0]) // Solo partidos futuros
      .order('match_date', { ascending: true })
      .order('match_time', { ascending: true });

    if (matchesError) {
      console.error('Error fetching matches:', matchesError);
      return [];
    }

    if (!matches || matches.length === 0) {
      return [];
    }

    // Obtener estadísticas para cada partido
    const matchesWithStats = await Promise.all(
      matches.map(async (match) => {
        const { data: statsData, error: statsError } = await supabase
          .rpc('get_match_stats', { match_uuid: match.id });

        if (statsError) {
          console.error(`Error fetching stats for match ${match.id}:`, statsError);
          return {
            ...match,
            stats: {
              total_players: 0,
              total_goalkeepers: 0,
              available_player_spots: match.max_players,
              available_goalkeeper_spots: match.max_goalkeepers,
              is_full: false
            }
          };
        }

        return {
          ...match,
          stats: statsData as MatchStats
        };
      })
    );

    return matchesWithStats;
  } catch (error) {
    console.error('Error in getActiveMatches:', error);
    return [];
  }
}

/**
 * Obtiene un partido específico con sus estadísticas
 */
export async function getMatchById(matchId: string): Promise<MatchWithStats | null> {
  try {
    const { data: match, error: matchError } = await supabase
      .from('matches')
      .select('*')
      .eq('id', matchId)
      .single();

    if (matchError || !match) {
      console.error('Error fetching match:', matchError);
      return null;
    }

    // Obtener estadísticas del partido
    const { data: statsData, error: statsError } = await supabase
      .rpc('get_match_stats', { match_uuid: matchId });

    const stats = statsError ? {
      total_players: 0,
      total_goalkeepers: 0,
      available_player_spots: match.max_players,
      available_goalkeeper_spots: match.max_goalkeepers,
      is_full: false
    } : statsData as MatchStats;

    return {
      ...match,
      stats
    };
  } catch (error) {
    console.error('Error in getMatchById:', error);
    return null;
  }
}

/**
 * Obtiene la lista de jugadores inscritos en un partido
 */
export async function getMatchPlayers(matchId: string): Promise<MatchPlayer[]> {
  try {
    // Primero intentamos con la función RPC que ya creamos
    const { data, error } = await supabase.rpc('get_match_players', {
      match_id: matchId
    });
    
    if (!error && data) {
      return data;
    }

    // Si falla, usamos consulta directa con datos básicos
    const { data: registrations } = await supabase
      .from('match_registrations')
      .select('user_id, registration_date, position, payment_status')
      .eq('match_id', matchId);
    
    return registrations?.map((registration, index) => ({
      id: registration.user_id,
      name: `Jugador ${index + 1}`,
      avatar_url: `https://via.placeholder.com/40x40?text=J${index + 1}`,
      position: registration.position,
      registeredAt: registration.registration_date,
      payment_status: registration.payment_status
    })) || [];
  } catch (error) {
    console.error('Error fetching match players:', error);
    return [];
  }
}

/**
 * Inscribe a un usuario en un partido
 */
export async function registerForMatch(
  matchId: string, 
  position: 'player' | 'goalkeeper'
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: 'Usuario no autenticado' };
    }

    const { error } = await supabase
      .from('match_registrations')
      .insert({
        match_id: matchId,
        user_id: user.id,
        position
      });

    if (error) {
      console.error('Error registering for match:', error);
      
      // Manejar error de duplicado
      if (error.code === '23505') {
        return { success: false, error: 'Ya estás inscrito en este partido' };
      }
      
      return { success: false, error: 'Error al inscribirse al partido' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in registerForMatch:', error);
    return { success: false, error: 'Error inesperado' };
  }
}

/**
 * Cancela la inscripción de un usuario en un partido
 */
export async function unregisterFromMatch(matchId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: 'Usuario no autenticado' };
    }

    const { error } = await supabase
      .from('match_registrations')
      .delete()
      .eq('match_id', matchId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error unregistering from match:', error);
      return { success: false, error: 'Error al cancelar inscripción' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in unregisterFromMatch:', error);
    return { success: false, error: 'Error inesperado' };
  }
}

/**
 * Verifica si el usuario actual está inscrito en un partido
 */
export async function isUserRegistered(matchId: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return false;
    }

    const { data, error } = await supabase
      .from('match_registrations')
      .select('id')
      .eq('match_id', matchId)
      .eq('user_id', user.id)
      .single();

    return !error && !!data;
  } catch (error) {
    console.error('Error checking user registration:', error);
    return false;
  }
}