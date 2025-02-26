"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Player, storage, handleAvatarError } from "@/types";

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [newAvatarUrl, setNewAvatarUrl] = useState("");
  const [editingPlayer, setEditingPlayer] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editAvatarUrl, setEditAvatarUrl] = useState("");

  useEffect(() => {
    // Load players from localStorage
    setPlayers(storage.getPlayers());
  }, []);

  const savePlayersToStorage = (updatedPlayers: Player[]) => {
    storage.setPlayers(updatedPlayers);
    setPlayers(updatedPlayers);
  };

  const addPlayer = () => {
    if (!newPlayerName.trim()) return;

    const newPlayer: Player = {
      id: Date.now().toString(),
      name: newPlayerName.trim(),
      wins: 0,
      losses: 0,
      gamesPlayed: 0,
      avatarUrl: newAvatarUrl.trim() || undefined
    };

    const updatedPlayers = [...players, newPlayer];
    savePlayersToStorage(updatedPlayers);
    setNewPlayerName("");
    setNewAvatarUrl("");
  };

  const startEditing = (player: Player) => {
    setEditingPlayer(player.id);
    setEditName(player.name);
    setEditAvatarUrl(player.avatarUrl || "");
  };

  const saveEdit = (id: string) => {
    if (!editName.trim()) return;

    const updatedPlayers = players.map(player => 
      player.id === id ? { 
        ...player, 
        name: editName.trim(),
        avatarUrl: editAvatarUrl.trim() || undefined
      } : player
    );
    
    savePlayersToStorage(updatedPlayers);
    setEditingPlayer(null);
    setEditName("");
    setEditAvatarUrl("");
  };

  const deletePlayer = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce joueur ? Cette action est irréversible.")) {
      const updatedPlayers = players.filter(player => player.id !== id);
      savePlayersToStorage(updatedPlayers);
    }
  };

  return (
    <div className="min-h-screen bg-[#10172a] text-white">
      <header className="py-6 px-4 bg-[#1a2542]/90 backdrop-blur-lg border-b border-[#303f60]/30 sticky top-0 z-10 flex items-center justify-between">
        <Link href="/" className="text-[#4facfe] hover:text-[#00f2fe] transition-colors">
          ← Retour
        </Link>
        <h1 className="text-2xl font-bold text-center bg-gradient-to-r from-[#B465DA] to-[#CF6CC9] text-transparent bg-clip-text">
          Gestion des Joueurs
        </h1>
        <div className="w-10"></div> {/* Spacer for centering */}
      </header>
      
      <main className="max-w-md mx-auto p-4">
        <div className="bg-[#1e293b] rounded-2xl p-5 shadow-[inset_0_1px_1px_#ffffff10,_0_8px_20px_#0000003d] mb-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#B465DA]/50 to-transparent"></div>
          
          <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-[#B465DA] to-[#CF6CC9] text-transparent bg-clip-text">
            Ajouter un Joueur
          </h2>
          
          <div className="space-y-3">
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              placeholder="Nom du joueur"
              className="w-full px-4 py-2 bg-[#172032] rounded-xl border border-[#303f60]/30 text-white placeholder-[#a0aec0] focus:outline-none focus:ring-2 focus:ring-[#B465DA]/40 transition-all"
              onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
            />
            
            <input
              type="text"
              value={newAvatarUrl}
              onChange={(e) => setNewAvatarUrl(e.target.value)}
              placeholder="URL de l'avatar (optionnel)"
              className="w-full px-4 py-2 bg-[#172032] rounded-xl border border-[#303f60]/30 text-white placeholder-[#a0aec0] focus:outline-none focus:ring-2 focus:ring-[#B465DA]/40 transition-all"
            />
            
            {newAvatarUrl && (
              <div className="flex justify-center my-2">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#B465DA]/30">
                  <img 
                    src={newAvatarUrl} 
                    alt="Avatar preview" 
                    className="w-full h-full object-cover"
                    onError={handleAvatarError}
                  />
                </div>
              </div>
            )}
            
            <div className="flex justify-end">
              <button
                onClick={addPlayer}
                className="px-4 py-2 bg-gradient-to-r from-[#0aff9d] to-[#0adc84] hover:from-[#0aff9d]/90 hover:to-[#0adc84]/90 rounded-xl transition-all shadow-lg hover:shadow-[#0aff9d33] text-[#0a1f16] font-medium"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
        
        {players.length > 0 ? (
          <div className="bg-[#1e293b] rounded-2xl p-5 shadow-[inset_0_1px_1px_#ffffff10,_0_8px_20px_#0000003d] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#4facfe]/50 to-transparent"></div>
            
            <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-[#4facfe] to-[#00f2fe] text-transparent bg-clip-text">
              Liste des Joueurs
            </h2>
            
            <div className="space-y-3">
              {players.map(player => (
                <div 
                  key={player.id} 
                  className="bg-[#172032] p-4 rounded-xl shadow-[inset_0_1px_1px_#ffffff08] hover:bg-[#1a253a] transition-colors border border-[#303f60]/10"
                >
                  {editingPlayer === player.id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-3 py-2 bg-[#121a2c] rounded-lg border border-[#303f60]/30 focus:outline-none focus:ring-2 focus:ring-[#4facfe]/40 transition-all"
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && saveEdit(player.id)}
                      />
                      <input
                        type="text"
                        value={editAvatarUrl}
                        onChange={(e) => setEditAvatarUrl(e.target.value)}
                        placeholder="URL de l'avatar (optionnel)"
                        className="w-full px-3 py-2 bg-[#121a2c] rounded-lg border border-[#303f60]/30 focus:outline-none focus:ring-2 focus:ring-[#4facfe]/40 transition-all"
                      />
                      
                      {editAvatarUrl && (
                        <div className="flex justify-center my-2">
                          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#4facfe]/30">
                            <img 
                              src={editAvatarUrl} 
                              alt="Avatar preview" 
                              className="w-full h-full object-cover"
                              onError={handleAvatarError}
                            />
                          </div>
                        </div>
                      )}
                      
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => saveEdit(player.id)}
                          className="p-2 bg-gradient-to-r from-[#0aff9d] to-[#0adc84] hover:opacity-90 rounded-lg transition-all text-[#0a1f16]"
                        >
                          ✓
                        </button>
                        <button 
                          onClick={() => setEditingPlayer(null)}
                          className="p-2 bg-gradient-to-r from-[#ff6b6b] to-[#ee5253] hover:opacity-90 rounded-lg transition-all text-white"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {player.avatarUrl ? (
                          <div className="mr-3 w-12 h-12 rounded-full overflow-hidden border-2 border-[#303f60]/30">
                            <img 
                              src={player.avatarUrl} 
                              alt={`Avatar de ${player.name}`}
                              className="w-full h-full object-cover" 
                              onError={handleAvatarError}
                            />
                          </div>
                        ) : (
                          <div className="mr-3 w-12 h-12 rounded-full bg-[#1a253a] flex items-center justify-center border-2 border-[#303f60]/30 text-[#4facfe]">
                            {player.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <span className="font-medium text-[#e2e8f0]">{player.name}</span>
                          <div className="text-sm text-[#a0aec0] mt-1">
                            {player.gamesPlayed} parties • {player.wins} victoires • {player.losses} défaites
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => startEditing(player)}
                          className="p-2 text-sm bg-gradient-to-r from-[#ffa500] to-[#ff6a00] hover:opacity-90 rounded-lg transition-all text-white"
                          aria-label="Modifier"
                        >
                          ✎
                        </button>
                        <button 
                          onClick={() => deletePlayer(player.id)}
                          className="p-2 text-sm bg-gradient-to-r from-[#ff6b6b] to-[#ee5253] hover:opacity-90 rounded-lg transition-all text-white"
                          aria-label="Supprimer"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center p-6 bg-[#1e293b] rounded-2xl shadow-[inset_0_1px_1px_#ffffff10,_0_8px_20px_#0000003d] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#4facfe]/50 to-transparent"></div>
            <p className="text-[#a0aec0]">Aucun joueur enregistré</p>
          </div>
        )}
      </main>
    </div>
  );
}