"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

export default function Home() {
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    // Load players from localStorage
    const savedPlayers = localStorage.getItem("billiardPlayers");
    if (savedPlayers) {
      setPlayers(JSON.parse(savedPlayers));
    }
  }, []);

  // Calculate leaderboard by sorting players by wins
  const leaderboard = [...players].sort((a, b) => b.wins - a.wins);

  return (
    <div className="min-h-screen bg-[#10172a] text-white">
      <header className="py-6 px-4 bg-[#1a2542]/90 backdrop-blur-lg border-b border-[#303f60]/30 sticky top-0 z-10">
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-[#4facfe] to-[#00f2fe] text-transparent bg-clip-text">Billard Score Tracker</h1>
      </header>
      
      <main className="max-w-md mx-auto p-4">
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Link 
            href="/new-match"
            className="group relative overflow-hidden bg-[#1e293b] hover:bg-[#1e293b]/80 rounded-2xl p-6 text-center transition-all duration-300 shadow-[inset_0_1px_1px_#ffffff20,_0_8px_20px_#0000004d] hover:shadow-[inset_0_1px_1px_#ffffff30,_0_10px_30px_#4facfe33]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#4facfe]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="block text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">🎱</span>
            <span className="font-medium text-[#e2e8f0]">Nouveau Match</span>
          </Link>
          
          <Link 
            href="/players"
            className="group relative overflow-hidden bg-[#1e293b] hover:bg-[#1e293b]/80 rounded-2xl p-6 text-center transition-all duration-300 shadow-[inset_0_1px_1px_#ffffff20,_0_8px_20px_#0000004d] hover:shadow-[inset_0_1px_1px_#ffffff30,_0_10px_30px_#B465DA33]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#B465DA]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="block text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">👥</span>
            <span className="font-medium text-[#e2e8f0]">Joueurs</span>
          </Link>
          
          <Link 
            href="/matches"
            className="group relative overflow-hidden bg-[#1e293b] hover:bg-[#1e293b]/80 rounded-2xl p-6 text-center transition-all duration-300 shadow-[inset_0_1px_1px_#ffffff20,_0_8px_20px_#0000004d] hover:shadow-[inset_0_1px_1px_#ffffff30,_0_10px_30px_#0aff9d33]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#0aff9d]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="block text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">📊</span>
            <span className="font-medium text-[#e2e8f0]">Historique</span>
          </Link>
          
          <Link 
            href="/stats"
            className="group relative overflow-hidden bg-[#1e293b] hover:bg-[#1e293b]/80 rounded-2xl p-6 text-center transition-all duration-300 shadow-[inset_0_1px_1px_#ffffff20,_0_8px_20px_#0000004d] hover:shadow-[inset_0_1px_1px_#ffffff30,_0_10px_30px_#ffa50033]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#ffa500]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="block text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">📈</span>
            <span className="font-medium text-[#e2e8f0]">Statistiques</span>
          </Link>
        </div>
        
        {leaderboard.length > 0 ? (
          <div className="bg-[#1e293b] rounded-2xl p-5 shadow-[inset_0_1px_1px_#ffffff10,_0_8px_20px_#0000003d] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#4facfe]/50 to-transparent"></div>
            
            <h2 className="text-xl font-bold mb-6 bg-gradient-to-r from-[#ffa500] to-[#ff6a00] text-transparent bg-clip-text flex items-center">
              <span className="text-[#ffa500] mr-2">🏆</span> Classement
            </h2>
            
            <div className="space-y-3">
              {leaderboard.map((player, index) => (
                <div 
                  key={player.id} 
                  className="flex items-center justify-between bg-[#172032] p-4 rounded-xl shadow-[inset_0_1px_1px_#ffffff08] hover:bg-[#1a253a] transition-colors border border-[#303f60]/10"
                >
                  <div className="flex items-center">
                    <span className="font-bold text-[#ffa500] mr-3 bg-[#2d3748] w-7 h-7 flex items-center justify-center rounded-full border border-[#ffa500]/20 text-sm">
                      {index + 1}
                    </span>
                    
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
                    
                    <span className="text-[#e2e8f0]">{player.name}</span>
                  </div>
                  <div className="flex gap-2 text-sm">
                    <span className="bg-[#0d4922] px-2 py-1 rounded-md border border-[#0aff9d]/20 text-[#0aff9d]">
                      W: {player.wins}
                    </span>
                    <span className="bg-[#4d1422] px-2 py-1 rounded-md border border-[#ff6b6b]/20 text-[#ff6b6b]">
                      L: {player.losses}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center p-8 bg-[#1e293b] rounded-2xl shadow-[inset_0_1px_1px_#ffffff10,_0_8px_20px_#0000003d] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#B465DA]/50 to-transparent"></div>
            
            <p className="mb-5 text-[#a0aec0]">Aucun joueur enregistré</p>
            
            <Link 
              href="/players" 
              className="inline-block px-5 py-2.5 bg-gradient-to-r from-[#B465DA] to-[#CF6CC9] hover:from-[#B465DA]/90 hover:to-[#CF6CC9]/90 rounded-xl transition-all shadow-lg hover:shadow-[#B465DA33] text-white font-medium"
            >
              Ajouter des joueurs
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}