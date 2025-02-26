"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Player,
  MatchPlayer,
  Match,
  Winner,
  storage,
  handleAvatarError,
} from "@/types";

export default function NewMatchPage() {
  const router = useRouter();
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [matchPlayers, setMatchPlayers] = useState<MatchPlayer[]>([]);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    // Load players from localStorage
    const players = storage.getPlayers();
    setAllPlayers(players);
    setMatchPlayers(
      players.map((player: Player) => ({
        id: player.id,
        name: player.name,
        score: 0,
        selected: false,
        avatarUrl: player.avatarUrl,
      }))
    );
  }, []);

  const togglePlayerSelection = (id: string) => {
    if (hasStarted) return;

    setMatchPlayers((prev) =>
      prev.map((player) =>
        player.id === id ? { ...player, selected: !player.selected } : player
      )
    );
  };

  const selectedPlayers = matchPlayers.filter((player) => player.selected);

  const startMatch = () => {
    if (selectedPlayers.length < 2) {
      alert(
        "Veuillez sélectionner au moins 2 joueurs pour commencer une partie."
      );
      return;
    }
    setHasStarted(true);
  };

  const updateScore = (id: string, change: number) => {
    setMatchPlayers((prev) =>
      prev.map((player) =>
        player.id === id
          ? { ...player, score: Math.max(0, player.score + change) }
          : player
      )
    );
  };

  const finishMatch = () => {
    // Find player with highest score
    let highestScore = -1;
    let winner: Winner | null = null;

    selectedPlayers.forEach((player) => {
      if (player.score > highestScore) {
        highestScore = player.score;
        winner = {
          id: player.id,
          name: player.name,
          avatarUrl: player.avatarUrl,
        };
      }
    });

    if (!winner) return;

    // Create match record
    const match: Match = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      players: selectedPlayers.map((p) => ({
        id: p.id,
        name: p.name,
        score: p.score,
        avatarUrl: p.avatarUrl,
      })),
      winner: winner,
    };

    // Save match to localStorage
    const matches = storage.getMatches();
    storage.setMatches([...matches, match]);

    // Update player stats
    const updatedPlayers = allPlayers.map((player) => {
      const matchPlayer = selectedPlayers.find((p) => p.id === player.id);
      if (!matchPlayer) return player;

      return {
        ...player,
        wins: player.wins + (matchPlayer.id === winner?.id ? 1 : 0),
        losses: player.losses + (matchPlayer.id !== winner?.id ? 1 : 0),
        gamesPlayed: player.gamesPlayed + 1,
      };
    });

    storage.setPlayers(updatedPlayers);

    // Navigate to match history
    router.push("/matches");
  };

  return (
    <div className="min-h-screen bg-[#10172a] text-white">
      <header className="py-6 px-4 bg-[#1a2542]/90 backdrop-blur-lg border-b border-[#303f60]/30 sticky top-0 z-10 flex items-center justify-between">
        <Link
          href="/"
          className="text-[#4facfe] hover:text-[#00f2fe] transition-colors"
        >
          ← Retour
        </Link>
        <h1 className="text-2xl font-bold text-center bg-gradient-to-r from-[#4facfe] to-[#00f2fe] text-transparent bg-clip-text">
          {hasStarted ? "Match en cours" : "Nouveau Match"}
        </h1>
        <div className="w-10"></div> {/* Spacer for centering */}
      </header>

      <main className="max-w-md mx-auto p-4">
        {!hasStarted ? (
          <div className="bg-[#1e293b] rounded-2xl p-5 shadow-[inset_0_1px_1px_#ffffff10,_0_8px_20px_#0000003d] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#4facfe]/50 to-transparent"></div>

            <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-[#4facfe] to-[#00f2fe] text-transparent bg-clip-text">
              Sélectionner les joueurs
            </h2>

            {matchPlayers.length > 0 ? (
              <>
                <div className="space-y-2 mb-6 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
                  {matchPlayers.map((player) => (
                    <div
                      key={player.id}
                      className={`p-3 rounded-xl flex items-center cursor-pointer transition-colors ${
                        player.selected
                          ? "bg-[#1a4366] border border-[#4facfe]/20"
                          : "bg-[#172032] hover:bg-[#1a253a] border border-[#303f60]/10"
                      }`}
                      onClick={() => togglePlayerSelection(player.id)}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                          player.selected
                            ? "border-[#4facfe] bg-[#4facfe]/20"
                            : "border-[#a0aec0]"
                        }`}
                      >
                        {player.selected && (
                          <span className="text-xs text-[#4facfe]">✓</span>
                        )}
                      </div>

                      {player.avatarUrl ? (
                        <div className="mr-3 w-8 h-8 rounded-full overflow-hidden border-2 border-[#303f60]/30">
                          <Image
                            src={player.avatarUrl}
                            alt={`Avatar de ${player.name}`}
                            className="w-full h-full object-cover"
                            onError={handleAvatarError}
                            width={32}
                            height={32}
                          />
                        </div>
                      ) : (
                        <div className="mr-3 w-8 h-8 rounded-full bg-[#1a253a] flex items-center justify-center border-2 border-[#303f60]/30 text-[#4facfe] text-xs">
                          {player.name.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <span className="font-medium text-[#e2e8f0]">
                        {player.name}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={startMatch}
                    disabled={selectedPlayers.length < 2}
                    className={`px-6 py-3 rounded-xl font-medium transition-all ${
                      selectedPlayers.length < 2
                        ? "bg-[#2d3748] cursor-not-allowed"
                        : "bg-gradient-to-r from-[#0aff9d] to-[#0adc84] hover:from-[#0aff9d]/90 hover:to-[#0adc84]/90 shadow-lg hover:shadow-[#0aff9d33] text-[#0a1f16]"
                    }`}
                  >
                    Commencer le match
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center p-6">
                <p className="mb-4 text-[#a0aec0]">Aucun joueur enregistré</p>
                <Link
                  href="/players"
                  className="inline-block px-5 py-2.5 bg-gradient-to-r from-[#B465DA] to-[#CF6CC9] hover:from-[#B465DA]/90 hover:to-[#CF6CC9]/90 rounded-xl transition-all shadow-lg hover:shadow-[#B465DA33] text-white font-medium"
                >
                  Ajouter des joueurs
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-end">
              <button
                onClick={finishMatch}
                className="px-5 py-2.5 bg-gradient-to-r from-[#0aff9d] to-[#0adc84] hover:from-[#0aff9d]/90 hover:to-[#0adc84]/90 rounded-xl transition-all shadow-lg hover:shadow-[#0aff9d33] text-[#0a1f16] font-medium"
              >
                Terminer le match
              </button>
            </div>

            <div className="space-y-4">
              {selectedPlayers.map((player) => (
                <div
                  key={player.id}
                  className="bg-[#1e293b] rounded-2xl p-5 shadow-[inset_0_1px_1px_#ffffff10,_0_8px_20px_#0000003d] relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#4facfe]/50 to-transparent"></div>

                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      {player.avatarUrl ? (
                        <div className="mr-3 w-10 h-10 rounded-full overflow-hidden border-2 border-[#303f60]/30">
                          <Image
                            src={player.avatarUrl}
                            alt={`Avatar de ${player.name}`}
                            className="w-full h-full object-cover"
                            onError={handleAvatarError}
                            width={40}
                            height={40}
                          />
                        </div>
                      ) : (
                        <div className="mr-3 w-10 h-10 rounded-full bg-[#1a253a] flex items-center justify-center border-2 border-[#303f60]/30 text-[#4facfe]">
                          {player.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="font-medium text-lg text-[#e2e8f0]">
                        {player.name}
                      </span>
                    </div>
                    <span className="text-2xl font-bold bg-[#172032] px-6 py-1.5 rounded-xl border border-[#303f60]/30 text-[#4facfe]">
                      {player.score}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    <button
                      onClick={() => updateScore(player.id, 1)}
                      className="bg-gradient-to-r from-[#0aff9d] to-[#0adc84] hover:opacity-90 p-3 rounded-xl text-lg font-bold transition-all shadow-md hover:shadow-[#0aff9d33] text-[#0a1f16]"
                    >
                      +1
                    </button>
                    <button
                      onClick={() => updateScore(player.id, 2)}
                      className="bg-gradient-to-r from-[#0aff9d] to-[#0adc84] hover:opacity-90 p-3 rounded-xl text-lg font-bold transition-all shadow-md hover:shadow-[#0aff9d33] text-[#0a1f16]"
                    >
                      +2
                    </button>
                    <button
                      onClick={() => updateScore(player.id, -1)}
                      className="bg-gradient-to-r from-[#ff6b6b] to-[#ee5253] hover:opacity-90 p-3 rounded-xl text-lg font-bold transition-all shadow-md hover:shadow-[#ff6b6b33]"
                    >
                      -1
                    </button>
                    <button
                      onClick={() => updateScore(player.id, -2)}
                      className="bg-gradient-to-r from-[#ff6b6b] to-[#ee5253] hover:opacity-90 p-3 rounded-xl text-lg font-bold transition-all shadow-md hover:shadow-[#ff6b6b33]"
                    >
                      -2
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
