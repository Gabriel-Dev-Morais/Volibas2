import React from 'react';
import { Match } from '../types';

interface MatchScheduleProps {
  schedule: Match[][];
}

const MatchSchedule: React.FC<MatchScheduleProps> = ({ schedule }) => {
  if (schedule.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-800/50 rounded-xl p-4 md:p-6 shadow-lg backdrop-blur-sm border border-slate-700">
      <h2 className="text-2xl font-bold text-indigo-400 mb-6 text-center">Tabela de Jogos (Pontos Corridos)</h2>
      <div className="space-y-6">
        {schedule.map((round, roundIndex) => (
          <div key={roundIndex}>
            <h3 className="text-lg font-semibold text-slate-300 border-b-2 border-slate-700 pb-2 mb-3">
              Rodada {roundIndex + 1}
            </h3>
            <div className="space-y-3">
              {round.map((match, matchIndex) => (
                <div key={matchIndex} className="bg-slate-800/70 p-3 rounded-lg flex items-center justify-center text-center">
                  <span className="font-medium flex-1 text-right" style={{ color: match.team1.color }}>{match.team1.name}</span>
                  <span className="text-slate-500 mx-4 text-sm">vs</span>
                  <span className="font-medium flex-1 text-left" style={{ color: match.team2.color }}>{match.team2.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchSchedule;
