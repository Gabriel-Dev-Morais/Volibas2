import React from 'react';
import { BracketNode, Team } from '../types';
import { TrophyIcon } from './Icons';

interface MatchCardProps {
    match: BracketNode;
    onSetWinner: (matchId: string, winner: Team) => void;
    isFinal: boolean;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, onSetWinner, isFinal }) => {
    const canSelectWinner = match.team1 && match.team2 && !match.winner;

    const TeamDisplay: React.FC<{ team?: Team, isWinner?: boolean }> = ({ team, isWinner = false }) => {
        if (!team) return <div className="h-6 text-slate-500 text-sm">Aguardando...</div>;

        const isLoser = match.winner && match.winner.id !== team.id;
        
        const classes = `
            font-semibold cursor-pointer transition-all duration-200
            ${isWinner ? 'font-bold' : ''}
            ${isLoser ? 'opacity-40' : ''}
            ${canSelectWinner ? 'hover:opacity-100 hover:scale-105' : 'cursor-default'}
        `;

        return (
            <div
                className={classes}
                style={{ color: team.color || '#FFFFFF' }}
                onClick={() => canSelectWinner && onSetWinner(match.id, team)}
            >
                {team.name}
            </div>
        );
    };

    if(match.isBye) {
        return (
            <div className="min-h-[6rem] flex flex-col justify-center bg-slate-800/30 rounded-md p-2 text-center relative">
                 <TeamDisplay team={match.team1} isWinner={true} />
                 <div className="text-xs text-green-400 mt-1">(Folga)</div>
            </div>
        )
    }

    const winner = match.winner;

    return (
        <div className="min-h-[6rem] flex flex-col justify-center bg-slate-800/50 rounded-md p-3 relative text-center">
            {winner && isFinal && (
                 <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-slate-900 px-2 py-0.5 rounded-full text-xs font-bold flex items-center">
                    <TrophyIcon className="w-4 h-4 mr-1"/> CAMPEÃO
                 </div>
            )}
            <TeamDisplay team={match.team1} isWinner={winner?.id === match.team1?.id} />
            <div className="text-xs text-slate-500 my-1.5">vs</div>
            <TeamDisplay team={match.team2} isWinner={winner?.id === match.team2?.id} />
        </div>
    );
};


interface TournamentBracketProps {
  bracket: BracketNode[][];
  onSetWinner: (matchId: string, winner: Team) => void;
}

const roundNames: { [key: number]: string } = {
    0: "Rodada 1",
    1: "Oitavas de Final",
    2: "Quartas de Final",
    3: "Semifinais",
    4: "Final"
}

const getRoundName = (roundIndex: number, totalRounds: number): string => {
    const finalRoundIndex = totalRounds - 1;
    if (roundIndex === finalRoundIndex) return "Final";
    if (roundIndex === finalRoundIndex - 1) return "Semifinais";
    if (roundIndex === finalRoundIndex - 2) return "Quartas de Final";
    if (roundIndex === finalRoundIndex - 3) return "Oitavas de Final";
    return `Rodada ${roundIndex + 1}`;
}


const TournamentBracket: React.FC<TournamentBracketProps> = ({ bracket, onSetWinner }) => {
    return (
        <div className="bg-slate-800/50 rounded-xl p-4 md:p-6 shadow-lg backdrop-blur-sm border border-slate-700">
            <h2 className="text-2xl font-bold text-indigo-400 mb-6 text-center">Chaveamento do Torneio</h2>
            <div className="flex justify-start space-x-4 md:space-x-8 overflow-x-auto pb-4">
                {bracket.map((round, roundIndex) => (
                    <div key={roundIndex} className="flex flex-col justify-around min-w-[180px] md:min-w-[200px] space-y-4">
                        <h3 className="text-center font-bold text-slate-300">{getRoundName(roundIndex, bracket.length)}</h3>
                        {round.map((match, matchIndex) => (
                            <div key={match.id} className="relative">
                                <MatchCard 
                                    match={match} 
                                    onSetWinner={onSetWinner}
                                    isFinal={roundIndex === bracket.length - 1}
                                />
                                {roundIndex < bracket.length - 1 && (
                                    <>
                                        {/* Horizontal line */}
                                        <div className="absolute top-1/2 -right-4 md:-right-8 w-4 md:w-8 border-t-2 border-slate-600"></div>
                                        {/* Vertical connector line */}
                                        {matchIndex % 2 === 0 && (
                                             <div className="absolute top-1/2 -right-4 md:-right-8 h-full border-r-2 border-slate-600"></div>
                                        )}
                                         {matchIndex % 2 !== 0 && (
                                             <div className="absolute bottom-1/2 -right-4 md:-right-8 h-full border-r-2 border-slate-600"></div>
                                        )}
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TournamentBracket;