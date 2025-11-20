
import React from 'react';
import { Player } from '../types';
import { TrashIcon, StarIcon, UsersIcon } from './Icons';

interface PlayerListProps {
  players: Player[];
  onRemovePlayer: (id: string) => void;
}

const SkillRating: React.FC<{ level: number }> = ({ level }) => (
    <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
            <StarIcon key={i} className={`w-4 h-4 ${i < level ? 'text-yellow-400' : 'text-slate-600'}`} />
        ))}
    </div>
);


const PlayerList: React.FC<PlayerListProps> = ({ players, onRemovePlayer }) => {
  return (
    <div className="bg-slate-800/50 rounded-xl p-6 shadow-lg backdrop-blur-sm border border-slate-700">
      <h2 className="text-2xl font-bold text-cyan-400 mb-4">Jogadores ({players.length})</h2>
      {players.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
            <UsersIcon className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p>Nenhum jogador adicionado ainda.</p>
            <p className="text-sm">Use o formulário acima para começar.</p>
        </div>
      ) : (
        <ul className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {players.map((player) => (
            <li
              key={player.id}
              className="flex items-center justify-between bg-slate-700/50 p-3 rounded-lg animate-fade-in"
            >
              <div>
                <p className="font-semibold text-white">{player.name}</p>
                 <SkillRating level={player.skillLevel} />
              </div>
              <button
                onClick={() => onRemovePlayer(player.id)}
                className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-full"
                aria-label={`Remover ${player.name}`}
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PlayerList;
