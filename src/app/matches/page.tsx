"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Match = {
  id: string;
  date: string;
  players: {
    id: string;
    name: string;
    score: number;
  }[];
  winner?: {
    id: string;
    name: string;
  };
};

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    // Load matches from localStorage
    const savedMatches = localStorage.getItem("billiardMatches");
    if (savedMatches) {
      const parsedMatches = JSON.parse(savedMatches);
      // Sort by date, newest first
      parsedMatches.sort((a: Match, b: Match) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setMatches(parsedMatches);
    }
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
                      <span className="font-medium text-[#e2e8f0]">{player.name}</span>
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