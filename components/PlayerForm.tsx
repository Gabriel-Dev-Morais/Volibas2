import React, { useState } from 'react';
import { UserPlusIcon } from './Icons';

interface PlayerFormProps {
  onAddPlayer: (name: string, skillLevel: number) => void;
}

const PlayerForm: React.FC<PlayerFormProps> = ({ onAddPlayer }) => {
  const [name, setName] = useState('');
  const [skillLevel, setSkillLevel] = useState(3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddPlayer(name.trim(), skillLevel);
      setName('');
      setSkillLevel(3);
    }
  };

  return (
    <div className="bg-slate-800/50 rounded-xl p-6 shadow-lg backdrop-blur-sm border border-slate-700">
      <h2 className="text-2xl font-bold text-cyan-400 mb-4">Adicionar Jogador</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="playerName" className="block text-sm font-medium text-slate-300 mb-1">
            Nome do Jogador
          </label>
          <input
            id="playerName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: João Silva"
            className="w-full bg-slate-700/50 border border-slate-600 rounded-md py-2 px-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
            required
          />
        </div>
        <div>
          <label htmlFor="skillLevel" className="block text-sm font-medium text-slate-300 mb-2">
            Nível de Habilidade: <span className="font-bold text-cyan-400">{skillLevel}</span>
          </label>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400">Iniciante</span>
            <input
              id="skillLevel"
              type="range"
              min="1"
              max="5"
              value={skillLevel}
              onChange={(e) => setSkillLevel(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
             <span className="text-xs text-slate-400">Avançado</span>
          </div>
        </div>
        <button
          type="submit"
          className="w-full flex items-center justify-center bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed"
          disabled={!name.trim()}
        >
          <UserPlusIcon className="w-5 h-5 mr-2" />
          Adicionar Jogador
        </button>
      </form>
    </div>
  );
};

export default PlayerForm;