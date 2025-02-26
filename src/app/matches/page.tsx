/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Player = {
  id: string;
  name: string;
  wins: number;
  losses: number;
  gamesPlayed: number;
  avatarUrl?: string;
};

type Match = {
  id: string;
  date: string;
  players: {
    id: string;
    name: string;
    score: number;
    avatarUrl?: string;
  }[];
  winner?: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
};

type PlayerStats = Player & {
  winRate: number;
  averageScore: number;
  highestScore: number;
};

export default function StatsPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [playerStats, setPlayerStats] = useState<PlayerStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load players and matches from localStorage
    const savedPlayers = localStorage.getItem("billiardPlayers");
    const savedMatches = localStorage.getItem("billiardMatches");
    
    const loadedPlayers: Player[] = savedPlayers ? JSON.parse(savedPlayers) : [];
    const loadedMatches: Match[] = savedMatches ? JSON.parse(savedMatches) : [];
    
    setMatches(loadedMatches);
    
    // Calculate extended stats
    if (loadedPlayers.length > 0 && loadedMatches.length > 0) {
      const stats: PlayerStats[] = loadedPlayers.map((player: Player) => {
        // Get all scores for this player from all matches
        const playerScores: number[] = loadedMatches
          .flatMap((match: Match) => 
            match.players
              .filter(p => p.id === player.id)
              .map(p => p.score)
          );
        
        // Calculate average and highest score
        const totalScore: number = playerScores.reduce((sum: number, score: number) => sum + score, 0);
        const averageScore: number = playerScores.length > 0 
          ? totalScore / playerScores.length 
          : 0;
        const highestScore: number = playerScores.length > 0 
          ? Math.max(...playerScores) 
          : 0;
        
        // Calculate win rate
        const winRate: number = player.gamesPlayed > 0 
          ? (player.wins / player.gamesPlayed) * 100 
          : 0;
        
        return {
          ...player,
          winRate,
          averageScore,
          highestScore
        };
      });
      
      setPlayerStats(stats);
    } else {
      setPlayerStats([]);
    }
    
    setLoading(false);
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-[#10172a] text-white">
      <header className="py-6 px-4 bg-[#1a2542]/90 backdrop-blur-lg border-b border-[#303f60]/30 sticky top-0 z-10 flex items-center justify-between">
        <Link href="/" className="text-[#4facfe] hover:text-[#00f2fe] transition-colors">
          ← Retour
        </Link>
        <h1 className="text-2xl font-bold text-center bg-gradient-to-r from-[#0aff9d] to-[#0adc84] text-transparent bg-clip-text">
          Historique des Matches
        </h1>
        <div className="w-10"></div> {/* Spacer for centering */}
      </header>
      
      <main className="max-w-md mx-auto p-4">
        {matches.length > 0 ? (
          <div className="space-y-4">
            {matches.map(match => (
              <div 
                key={match.id} 
                className="bg-[#1e293b] rounded-2xl p-5 shadow-[inset_0_1px_1px_#ffffff10,_0_8px_20px_#0000003d] relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#0aff9d]/50 to-transparent"></div>
                
                <div className="border-b border-[#303f60]/30 pb-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[#a0aec0] text-sm">
                      {formatDate(match.date)}
                    </span>
                    {match.winner && (
                      <span className="text-[#ffa500] flex items-center bg-[#ffa500]/10 px-3 py-1 rounded-full text-sm border border-[#ffa500]/20">
                        <span className="mr-1">🏆</span>
                        {match.winner.avatarUrl ? (
                          <img 
                            src={match.winner.avatarUrl}
                            alt={`Avatar de ${match.winner.name}`}
                            className="w-5 h-5 rounded-full mr-1 object-cover border border-[#ffa500]/30"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=?';
                            }}
                          />
                        ) : (
                          <span className="w-5 h-5 rounded-full mr-1 bg-[#2d3748] flex items-center justify-center text-xs border border-[#ffa500]/30">
                            {match.winner.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                        {match.winner.name}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  {match.players.map(player => (
                    <div 
                      key={player.id} 
                      className={`flex justify-between items-center p-3 rounded-xl ${
                        match.winner && player.id === match.winner.id 
                          ? 'bg-[#ffa500]/10 border border-[#ffa500]/20' 
                          : 'bg-[#172032] border border-[#303f60]/10'
                      }`}
                    >
                      <div className="flex items-center">
                        {player.avatarUrl ? (
                          <div className="mr-3 w-8 h-8 rounded-full overflow-hidden border-2 border-[#303f60]/30">
                            <img 
                              src={player.avatarUrl} 
                              alt={`Avatar de ${player.name}`}
                              className="w-full h-full object-cover" 
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=?';
                              }}
                            />
                          </div>
                        ) : (
                          <div className="mr-3 w-8 h-8 rounded-full bg-[#1a253a] flex items-center justify-center border-2 border-[#303f60]/30 text-[#4facfe] text-xs">
                            {player.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="font-medium text-[#e2e8f0]">{player.name}</span>
                      </div>
                      <span className={`font-bold px-3 py-1 rounded-lg ${
                        match.winner && player.id === match.winner.id 
                          ? 'bg-[#ffa500]/20 text-[#ffa500]' 
                          : 'bg-[#1a253a] text-[#e2e8f0]'
                      }`}>
                        {player.score} pts
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 bg-[#1e293b] rounded-2xl shadow-[inset_0_1px_1px_#ffffff10,_0_8px_20px_#0000003d] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#4facfe]/50 to-transparent"></div>
            
            <p className="mb-5 text-[#a0aec0]">Aucun match enregistré</p>
            
            <Link 
              href="/new-match" 
              className="inline-block px-5 py-2.5 bg-gradient-to-r from-[#4facfe] to-[#00f2fe] hover:from-[#4facfe]/90 hover:to-[#00f2fe]/90 rounded-xl transition-all shadow-lg hover:shadow-[#4facfe33] text-white font-medium"
            >
              Créer un match
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
