import React from 'react';
import { Player, Team } from '../types';
import TeamControls from '../components/TeamControls';
import TeamList from '../components/TeamList';
import { VolleyballIcon } from '../components/Icons';

interface TeamsViewProps {
  players: Player[];
  teams: Team[];
  isLoading: boolean;
  error: string | null;
  onGenerateTeams: (teamCount: number) => void;
  onNavigateToTournament: () => void;
  onGenerateLogo: (teamId: string) => void;
}

const TeamsView: React.FC<TeamsViewProps> = ({
  players,
  teams,
  isLoading,
  error,
  onGenerateTeams,
  onNavigateToTournament,
  onGenerateLogo,
}) => {
  const teamsExist = teams.length > 0;

  return (
    <div className="space-y-8">
      <div className="bg-slate-800/50 rounded-xl p-6 shadow-lg backdrop-blur-sm border border-slate-700">
        <h2 className="text-2xl font-bold text-cyan-400 mb-4">Gerar Times</h2>
        <TeamControls onGenerateTeams={onGenerateTeams} disabled={players.length < 2 || isLoading} />
        
        {error && <p className="mt-4 text-red-400 text-center">{error}</p>}
        
        {isLoading && (
          <div className="flex flex-col items-center justify-center mt-8 text-lg text-cyan-300">
            <VolleyballIcon className="w-12 h-12 animate-spin mb-4" />
            <p>Gerando times e nomes...</p>
            <p className="text-sm text-slate-400">Isso pode levar um momento.</p>
          </div>
        )}
      </div>

      {teamsExist && !isLoading && (
         <div className="bg-slate-800/50 rounded-xl p-6 shadow-lg backdrop-blur-sm border border-slate-700">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-cyan-400">Times Gerados</h2>
                <button
                    onClick={onNavigateToTournament}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-md transition-colors"
                >
                    Avançar para Torneio &rarr;
                </button>
            </div>
            <TeamList teams={teams} onGenerateLogo={onGenerateLogo} />
        </div>
      )}

      {!isLoading && !teamsExist && (
         <div className="text-center py-16 text-slate-500">
          <VolleyballIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg">Os times gerados aparecerão aqui.</p>
          <p>Adicione pelo menos 2 jogadores e clique em "Gerar Times".</p>
        </div>
      )}
    </div>
  );
};

export default TeamsView;