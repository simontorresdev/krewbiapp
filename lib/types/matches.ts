export interface Match {
  id: string;
  cover_image?: string;
  title: string;
  match_date: string; // YYYY-MM-DD format
  match_time: string; // HH:MM format
  location: string;
  format: string; // '7vs7', '10vs10', etc.
  field_number: number;
  will_be_recorded: boolean;
  player_price: number;
  goalkeeper_price: number;
  max_players: number;
  max_goalkeepers: number;
  status: 'active' | 'full' | 'cancelled' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface MatchRegistration {
  id: string;
  match_id: string;
  user_id: string;
  position: 'player' | 'goalkeeper';
  registration_date: string;
  payment_status: 'pending' | 'paid' | 'cancelled';
}

export interface MatchStats {
  total_players: number;
  total_goalkeepers: number;
  available_player_spots: number;
  available_goalkeeper_spots: number;
  is_full: boolean;
}

export interface MatchPlayer {
  id: string;
  name: string;
  avatar_url?: string;
  position: 'player' | 'goalkeeper';
  registeredAt: string;
  payment_status?: 'pending' | 'paid' | 'cancelled';
}

export interface MatchWithStats extends Match {
  stats?: MatchStats;
}