// Types partagés pour l'application Billard Score Tracker

// Type pour un joueur
export type Player = {
  id: string;
  name: string;
  wins: number;
  losses: number;
  gamesPlayed: number;
  avatarUrl?: string;
};

// Type pour un joueur dans un match en cours (avec score et sélection)
export type MatchPlayer = {
  id: string;
  name: string;
  score: number;
  selected: boolean;
  avatarUrl?: string;
};

// Type pour le gagnant du match
export type Winner = {
  id: string;
  name: string;
  avatarUrl?: string;
};

// Type pour un joueur dans l'historique des matchs (sans sélection)
export type MatchPlayerHistory = {
  id: string;
  name: string;
  score: number;
  avatarUrl?: string;
};

// Type pour un match
export type Match = {
  id: string;
  date: string;
  players: MatchPlayerHistory[];
  winner?: Winner;
};

// Type pour les statistiques étendues d'un joueur
export type PlayerStats = Player & {
  winRate: number;
  averageScore: number;
  highestScore: number;
};

// Fonction utilitaire pour la gestion type-safe du localStorage
export const storage = {
  getPlayers: (): Player[] => {
    try {
      const data = localStorage.getItem("billiardPlayers");
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Erreur lors de la récupération des joueurs:", e);
      return [];
    }
  },
  
  setPlayers: (players: Player[]): void => {
    localStorage.setItem("billiardPlayers", JSON.stringify(players));
  },
  
  getMatches: (): Match[] => {
    try {
      const data = localStorage.getItem("billiardMatches");
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Erreur lors de la récupération des matchs:", e);
      return [];
    }
  },
  
  setMatches: (matches: Match[]): void => {
    localStorage.setItem("billiardMatches", JSON.stringify(matches));
  }
};

// Helper pour créer un avatar par défaut en cas d'erreur de chargement
export const handleAvatarError = (e: React.SyntheticEvent<HTMLImageElement, Event>): void => {
  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=?';
};