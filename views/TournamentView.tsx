import React from 'react';
import { Team, Tournament } from '../types';
import TournamentBracket from '../components/TournamentBracket';
import MatchSchedule from '../components/MatchSchedule';
import { CalendarDaysIcon, TrophyIcon } from '../components/Icons';

interface TournamentViewProps {
  teams: Team[];
  tournament: Tournament;
  onGenerateBracket: () => void;
  onGenerateRoundRobin: () => void;
  onSetWinner: (matchId: string, winner: Team) => void;
}

const TournamentView: React.FC<TournamentViewProps> = ({
  teams,
  tournament,
  onGenerateBracket,
  onGenerateRoundRobin,
  onSetWinner,
}) => {

  if (teams.length === 0) {
    return (
      <div className="text-center py-16 text-slate-500">
        <TrophyIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
        <p className="text-lg">Ainda não há times para criar um torneio.</p>
        <p>Volte para a tela de elenco para começar.</p>
      </div>
    )
  }

  if (tournament.type === null) {
    return (
      <div className="bg-slate-800/50 rounded-xl p-6 shadow-lg backdrop-blur-sm border border-slate-700 text-center">
        <h2 className="text-2xl font-bold text-cyan-400 mb-2">Escolha o Formato do Torneio</h2>
        <p className="text-slate-400 mb-6">Como você quer que os times compitam?</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onGenerateBracket}
            className="flex-1 flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-md transition-colors"
          >
            <TrophyIcon className="w-5 h-5 mr-2" />
            Mata-Mata
          </button>
          <button
            onClick={onGenerateRoundRobin}
            className="flex-1 flex items-center justify-center bg-teal-600 hover:bg-teal-500 text-white font-bold py-3 px-6 rounded-md transition-colors"
          >
            <CalendarDaysIcon className="w-5 h-5 mr-2" />
            Pontos Corridos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {tournament.type === 'bracket' && (
        <TournamentBracket bracket={tournament.data} onSetWinner={onSetWinner} />
      )}
      {tournament.type === 'round-robin' && (
        <MatchSchedule schedule={tournament.data} />
      )}
    </div>
  );
};

export default TournamentView;
