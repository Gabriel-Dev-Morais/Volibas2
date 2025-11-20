import React from 'react';
import { Team } from '../types';
import { ShieldCheckIcon, UserIcon, StarIcon, ImageIcon, BoltIcon } from './Icons';

interface TeamCardProps {
  team: Team;
  onGenerateLogo: (teamId: string) => void;
}

const TeamCard: React.FC<TeamCardProps> = ({ team, onGenerateLogo }) => {
  const { id, logoStatus, logoUrl } = team;
  const teamColor = team.color || '#06b6d4'; // Fallback to cyan

  const handleGenerateClick = () => {
    onGenerateLogo(id);
  };

  return (
    <div
      className="bg-slate-800 rounded-lg shadow-md overflow-hidden border border-slate-700 flex flex-col transition-all duration-300"
    >
        <div 
            className="h-40 flex items-center justify-center bg-slate-700/50 relative"
            style={{ borderBottom: `4px solid ${teamColor}`}}
        >
            {logoStatus === 'loading' && (
                <div className="flex flex-col items-center text-slate-500 animate-pulse-slow">
                    <ImageIcon className="w-12 h-12" />
                    <p className="text-sm mt-2">Gerando logo...</p>
                </div>
            )}
            {logoStatus === 'loaded' && logoUrl && (
                <img src={logoUrl} alt={`Logo for ${team.name}`} className="w-full h-full object-cover" />
            )}
            {(logoStatus === 'pending' || logoStatus === 'error') && (
                 <div className="flex flex-col items-center text-slate-500 text-center p-2">
                    <ImageIcon className="w-12 h-12 opacity-50 mb-2" />
                    {logoStatus === 'error' && <p className="text-xs text-red-400 mb-2">Falha ao gerar</p>}
                    <button 
                        onClick={handleGenerateClick}
                        className="bg-slate-600 hover:bg-slate-500 text-white text-xs font-bold py-1 px-3 rounded-md transition-colors flex items-center"
                    >
                       <BoltIcon className="w-4 h-4 mr-1"/>
                       {logoStatus === 'error' ? 'Tentar Novamente' : 'Gerar Logo'}
                    </button>
                 </div>
            )}
             {(logoStatus === 'loaded' && !logoUrl) && (
                 <div className="flex flex-col items-center text-slate-500">
                    <ImageIcon className="w-12 h-12 opacity-50" />
                 </div>
            )}
        </div>

      <div className="p-4">
        <h3 
          className="text-xl font-bold text-center truncate"
          style={{ color: teamColor }}
        >
          {team.name}
        </h3>
      </div>
      <ul className="divide-y divide-slate-700 flex-grow p-4 pt-0">
        {team.players.map((player) => (
          <li key={player.id} className="py-3 flex items-center justify-between">
            <div className="flex items-center">
                <UserIcon className="w-5 h-5 mr-3 text-slate-400" />
                <span className="text-white">{player.name}</span>
            </div>
            <div className="flex items-center text-yellow-400">
                <span className="mr-1">{player.skillLevel}</span>
                <StarIcon className="w-4 h-4" />
            </div>
          </li>
        ))}
      </ul>
      <div className="bg-slate-900/50 p-3 mt-auto text-center">
        <p className="text-sm text-slate-300 font-semibold flex items-center justify-center">
            <ShieldCheckIcon className="w-5 h-5 mr-2 text-green-400"/>
            Média de Habilidade: <span className="ml-1 text-white">{team.averageSkill}</span>
        </p>
      </div>
    </div>
  );
};

export default TeamCard;