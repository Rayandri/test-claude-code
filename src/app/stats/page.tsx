"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Player = {
  id: string;
  name: string;
  wins: number;
  losses: number;
  gamesPlayed: number;
  avatarUrl?: string; // URL de l'image de profil
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
  const [players, setPlayers] = useState<Player[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [playerStats, setPlayerStats] = useState<PlayerStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load players and matches from localStorage
    const savedPlayers = localStorage.getItem("billiardPlayers");
    const savedMatches = localStorage.getItem("billiardMatches");
    
    const loadedPlayers: Player[] = savedPlayers ? JSON.parse(savedPlayers) : [];
    const loadedMatches: Match[] = savedMatches ? JSON.parse(savedMatches) : [];
    
    setPlayers(loadedPlayers);
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

  // Get total games played across all players
  const totalGamesPlayed: number = matches.length;
  
  // Find player with highest win rate
  const bestPlayer: PlayerStats | null = playerStats.length > 0 
    ? playerStats.reduce((prev, current) => 
        (prev.winRate > current.winRate) ? prev : current
      ) 
    : null;
  
  // Find player with highest score ever
  const highestScoringPlayer: PlayerStats | null = playerStats.length > 0 
    ? playerStats.reduce((prev, current) => 
        (prev.highestScore > current.highestScore) ? prev : current
      ) 
    : null;

  return (
    <div className="min-h-screen bg-[#10172a] text-white">
      <header className="py-6 px-4 bg-[#1a2542]/90 backdrop-blur-lg border-b border-[#303f60]/30 sticky top-0 z-10 flex items-center justify-between">
        <Link href="/" className="text-[#4facfe] hover:text-[#00f2fe] transition-colors">
          ← Retour
        </Link>
        <h1 className="text-2xl font-bold text-center bg-gradient-to-r from-[#ffa500] to-[#ff6a00] text-transparent bg-clip-text">
          Statistiques
        </h1>
        <div className="w-10"></div> {/* Spacer for centering */}
      </header>
      
      <main className="max-w-md mx-auto p-4">
        {loading ? (
          <div className="bg-[#1e293b] rounded-2xl p-8 shadow-[inset_0_1px_1px_#ffffff10,_0_8px_20px_#0000003d] relative overflow-hidden text-center">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#4facfe]/50 to-transparent"></div>
            
            <div className="inline-block animate-spin h-8 w-8 border-4 border-[#4facfe] border-t-transparent rounded-full mb-4"></div>
            <p className="text-[#a0aec0]">Chargement des statistiques...</p>
          </div>
        ) : playerStats.length > 0 ? (
          <div className="space-y-6">
            {/* Summary cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#1e293b] rounded-2xl p-5 shadow-[inset_0_1px_1px_#ffffff10,_0_8px_20px_#0000003d] relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#4facfe]/50 to-transparent"></div>
                
                <h3 className="text-[#a0aec0] text-sm mb-1">Total des parties</h3>
                <p className="text-2xl font-bold text-[#e2e8f0] group-hover:scale-110 transform transition-transform origin-left duration-300">{totalGamesPlayed}</p>
              </div>
              
              {bestPlayer && (
                <div className="bg-[#1e293b] rounded-2xl p-5 shadow-[inset_0_1px_1px_#ffffff10,_0_8px_20px_#0000003d] relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#4facfe]/50 to-transparent"></div>
                  
                  <h3 className="text-[#a0aec0] text-sm mb-1">Meilleur joueur</h3>
                  <div className="flex items-center">
                    {bestPlayer.avatarUrl ? (
                      <div className="mr-2 w-8 h-8 rounded-full overflow-hidden border-2 border-[#303f60]/30">
                        <img 
                          src={bestPlayer.avatarUrl} 
                          alt={`Avatar de ${bestPlayer.name}`}
                          className="w-full h-full object-cover" 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=?';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="mr-2 w-8 h-8 rounded-full bg-[#1a253a] flex items-center justify-center border-2 border-[#303f60]/30 text-[#4facfe] text-xs">
                        {bestPlayer.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <p className="font-bold text-[#e2e8f0]">{bestPlayer.name}</p>
                  </div>
                  <p className="text-[#ffa500] text-sm mt-1 group-hover:scale-110 transform transition-transform origin-left duration-300">
                    {bestPlayer.winRate.toFixed(0)}% de victoires
                  </p>
                </div>
              )}
              
              {highestScoringPlayer && (
                <div className="bg-[#1e293b] rounded-2xl p-5 shadow-[inset_0_1px_1px_#ffffff10,_0_8px_20px_#0000003d] relative overflow-hidden col-span-2 group">
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#ffa500]/50 to-transparent"></div>
                  
                  <h3 className="text-[#a0aec0] text-sm mb-1">Record de points</h3>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      {highestScoringPlayer.avatarUrl ? (
                        <div className="mr-2 w-8 h-8 rounded-full overflow-hidden border-2 border-[#303f60]/30">
                          <img 
                            src={highestScoringPlayer.avatarUrl} 
                            alt={`Avatar de ${highestScoringPlayer.name}`}
                            className="w-full h-full object-cover" 
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=?';
                            }}
                          />
                        </div>
                      ) : (
                        <div className="mr-2 w-8 h-8 rounded-full bg-[#1a253a] flex items-center justify-center border-2 border-[#303f60]/30 text-[#4facfe] text-xs">
                          {highestScoringPlayer.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <p className="font-bold text-[#e2e8f0]">{highestScoringPlayer.name}</p>
                    </div>
                    <p className="text-[#ffa500] font-bold text-xl group-hover:scale-110 transform transition-transform duration-300">
                      {highestScoringPlayer.highestScore} points
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Individual player stats */}
            <div className="bg-[#1e293b] rounded-2xl p-5 shadow-[inset_0_1px_1px_#ffffff10,_0_8px_20px_#0000003d] relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#4facfe]/50 to-transparent"></div>
              
              <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-[#4facfe] to-[#00f2fe] text-transparent bg-clip-text">
                Statistiques par joueur
              </h2>
              
              <div className="space-y-3">
                {playerStats
                  .sort((a, b) => b.winRate - a.winRate)
                  .map(player => (
                    <div 
                      key={player.id} 
                      className="bg-[#172032] p-4 rounded-xl shadow-[inset_0_1px_1px_#ffffff08] hover:bg-[#1a253a] transition-colors border border-[#303f60]/10"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          {player.avatarUrl ? (
                            <div className="mr-3 w-10 h-10 rounded-full overflow-hidden border-2 border-[#303f60]/30">
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
                            <div className="mr-3 w-10 h-10 rounded-full bg-[#1a253a] flex items-center justify-center border-2 border-[#303f60]/30 text-[#4facfe]">
                              {player.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className="font-medium text-lg text-[#e2e8f0]">{player.name}</span>
                        </div>
                        <span className="text-sm bg-[#1a253a] px-3 py-1 rounded-full border border-[#303f60]/30 text-[#a0aec0]">
                          {player.gamesPlayed} parties
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div className="bg-[#1a253a] rounded-lg p-3 border border-[#303f60]/20">
                          <p className="text-[#a0aec0] text-xs mb-1">Victoires</p>
                          <p className="font-bold text-[#e2e8f0]">{player.wins}</p>
                        </div>
                        <div className="bg-[#1a253a] rounded-lg p-3 border border-[#303f60]/20">
                          <p className="text-[#a0aec0] text-xs mb-1">% Victoires</p>
                          <p className="font-bold text-[#4facfe]">{player.winRate.toFixed(0)}%</p>
                        </div>
                        <div className="bg-[#1a253a] rounded-lg p-3 border border-[#303f60]/20">
                          <p className="text-[#a0aec0] text-xs mb-1">Score Max</p>
                          <p className="font-bold text-[#ffa500]">{player.highestScore}</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center p-8 bg-[#1e293b] rounded-2xl shadow-[inset_0_1px_1px_#ffffff10,_0_8px_20px_#0000003d] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#4facfe]/50 to-transparent"></div>
            
            <p className="mb-4 text-[#e2e8f0]">Aucune statistique disponible</p>
            <p className="text-sm text-[#a0aec0] mb-5">
              Jouer quelques parties pour voir apparaître des statistiques
            </p>
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
