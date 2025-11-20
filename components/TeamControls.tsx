
import React, { useState } from 'react';
import { ShuffleIcon } from './Icons';

interface TeamControlsProps {
  onGenerateTeams: (teamCount: number) => void;
  disabled: boolean;
}

const TeamControls: React.FC<TeamControlsProps> = ({ onGenerateTeams, disabled }) => {
  const [teamCount, setTeamCount] = useState(2);

  const handleGenerate = () => {
    if (teamCount > 0) {
      onGenerateTeams(teamCount);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <div className="flex-grow w-full sm:w-auto">
        <label htmlFor="teamCount" className="sr-only">
          Número de Times
        </label>
        <input
          id="teamCount"
          type="number"
          min="2"
          value={teamCount}
          onChange={(e) => setTeamCount(Math.max(2, parseInt(e.target.value, 10) || 2))}
          className="w-full bg-slate-700/50 border border-slate-600 rounded-md py-2 px-3 text-center text-lg font-bold focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
          disabled={disabled}
        />
      </div>
      <button
        onClick={handleGenerate}
        className="w-full sm:w-auto flex items-center justify-center bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-6 rounded-md transition-colors duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed"
        disabled={disabled}
      >
        <ShuffleIcon className="w-5 h-5 mr-2" />
        Gerar Times
      </button>
    </div>
  );
};

export default TeamControls;
