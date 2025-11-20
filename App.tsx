import React, { useState, useCallback } from 'react';
import { Player, Team, BracketNode, AppView, Tournament, Match } from './types';
import { generateTeamNames, generateTeamLogo } from './services/geminiService';
import Header from './components/Header';
import Navbar from './components/Navbar';
import SetupView from './views/SetupView';
import TeamsView from './views/TeamsView';
import TournamentView from './views/TournamentView';
import { v4 as uuidv4 } from 'uuid';
import { mockPlayers } from './data/mockPlayers';

const getNextPowerOf2 = (n: number) => {
  let p = 1;
  while (p < n) {
    p *= 2;
  }
  return p;
};

const App: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>(mockPlayers);
  const [teams, setTeams] = useState<Team[]>([]);
  const [tournament, setTournament] = useState<Tournament>({ type: null, data: [] });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<AppView>('setup');

  const addPlayer = (name: string, skillLevel: number) => {
    const newPlayer: Player = {
      id: uuidv4(),
      name,
      skillLevel,
    };
    setPlayers(prevPlayers => [...prevPlayers, newPlayer]);
  };

  const removePlayer = (id: string) => {
    setPlayers(prevPlayers => prevPlayers.filter(player => player.id !== id));
  };

  const handleGenerateLogo = useCallback(async (teamId: string) => {
    setTeams(prev => prev.map(t => t.id === teamId ? { ...t, logoStatus: 'loading' } : t));
    
    const team = teams.find(t => t.id === teamId);
    if (!team) return;

    try {
      const logoUrl = await generateTeamLogo(team.name);
      setTeams(prev => prev.map(t => t.id === teamId ? { ...t, logoUrl, logoStatus: 'loaded' } : t));
    } catch (error) {
      console.error(`Error generating logo for ${team.name}`, error);
      setTeams(prev => prev.map(t => t.id === teamId ? { ...t, logoStatus: 'error' } : t));
    }
  }, [teams]);
  
  const generateTeams = useCallback(async (teamCount: number) => {
    if (players.length < teamCount || teamCount <= 0) {
        setError("Número de times inválido ou jogadores insuficientes.");
        return;
    }

    setIsLoading(true);
    setError(null);
    setTeams([]);
    setTournament({ type: null, data: [] });

    const sortedPlayers = [...players].sort((a, b) => b.skillLevel - a.skillLevel);

    const newTeams: Omit<Team, 'averageSkill'>[] = Array.from({ length: teamCount }, (_, i) => ({
        id: uuidv4(),
        name: `Time ${i + 1}`,
        players: [],
        color: '#64748b',
        logoStatus: 'pending'
    }));

    let direction = 1;
    let teamIndex = 0;
    sortedPlayers.forEach(player => {
        newTeams[teamIndex].players.push(player);
        teamIndex += direction;
        if (teamIndex >= teamCount) {
            direction = -1;
            teamIndex = teamCount - 1;
        } else if (teamIndex < 0) {
            direction = 1;
            teamIndex = 0;
        }
    });
    
    const teamsWithSkill = newTeams.map(team => {
        const totalSkill = team.players.reduce((sum, player) => sum + player.skillLevel, 0);
        return {
            ...team,
            averageSkill: team.players.length > 0 ? parseFloat((totalSkill / team.players.length).toFixed(2)) : 0
        }
    });
    
    const seededTeams = teamsWithSkill.sort((a,b) => b.averageSkill - a.averageSkill);
    
    setActiveView('teams'); 

    try {
        const nameSuggestions = await generateTeamNames(teamCount);
        const teamsWithNames = seededTeams.map((team, index) => {
            const suggestion = nameSuggestions[index];
            return {
                ...team,
                name: suggestion?.name || team.name,
                color: suggestion?.color || '#06b6d4',
            };
        });
        setTeams(teamsWithNames);
    } catch (err) {
        setTeams(seededTeams);
        setError("Falha ao gerar nomes de times. Usando nomes padrão.");
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  }, [players]);

  const generateBracket = () => {
    if (teams.length < 2) return;
  
    const numTeams = teams.length;
    const bracketSize = getNextPowerOf2(numTeams);
    const numByes = bracketSize - numTeams;
  
    const rounds: BracketNode[][] = [];
    const firstRound: BracketNode[] = [];
  
    let matchNum = 0;
    const teamsWithByes = teams.slice(0, numByes);
    const teamsInFirstRound = teams.slice(numByes);
    
    teamsWithByes.forEach(team => {
      firstRound.push({
        id: uuidv4(),
        round: 0,
        match: matchNum++,
        team1: team,
        winner: team,
        isBye: true,
      });
    });
  
    for (let i = 0; i < teamsInFirstRound.length / 2; i++) {
      firstRound.push({
        id: uuidv4(),
        round: 0,
        match: matchNum++,
        team1: teamsInFirstRound[i],
        team2: teamsInFirstRound[teamsInFirstRound.length - 1 - i],
      });
    }
    rounds.push(firstRound);
  
    while (rounds[rounds.length - 1].length > 1) {
      const lastRound = rounds[rounds.length - 1];
      const nextRound: BracketNode[] = [];
      const currentRoundIndex = rounds.length;

      for (let i = 0; i < lastRound.length / 2; i++) {
          const prevMatchIndex1 = i * 2;
          const prevMatchIndex2 = i * 2 + 1;
          const prevRoundMatch1 = lastRound[prevMatchIndex1];
          const prevRoundMatch2 = lastRound[prevMatchIndex2];

          const newNode: BracketNode = {
              id: uuidv4(),
              round: currentRoundIndex,
              match: i,
              team1: prevRoundMatch1?.winner,
              team2: prevRoundMatch2?.winner,
          };
          
          if (rounds[currentRoundIndex - 1][prevMatchIndex1]) {
            rounds[currentRoundIndex - 1][prevMatchIndex1].nextMatchId = newNode.id;
          }
          if (rounds[currentRoundIndex - 1][prevMatchIndex2]) {
            rounds[currentRoundIndex - 1][prevMatchIndex2].nextMatchId = newNode.id;
          }

          nextRound.push(newNode);
      }
      rounds.push(nextRound);
    }
  
    setTournament({ type: 'bracket', data: rounds });
  };
  
  const generateRoundRobin = () => {
    if (teams.length < 2) return;

    let scheduleTeams = [...teams];
    const byeTeam = { id: 'bye', name: 'Folga', players: [], averageSkill: 0, logoStatus: 'loaded' as const };
    if (scheduleTeams.length % 2 !== 0) {
        scheduleTeams.push(byeTeam);
    }

    const numTeams = scheduleTeams.length;
    const numRounds = numTeams - 1;
    const schedule: Match[][] = Array.from({ length: numRounds }, () => []);

    for (let round = 0; round < numRounds; round++) {
        for (let i = 0; i < numTeams / 2; i++) {
            const team1 = scheduleTeams[i];
            const team2 = scheduleTeams[numTeams - 1 - i];

            if (team1.id !== 'bye' && team2.id !== 'bye') {
              schedule[round].push({ team1, team2 });
            }
        }
        
        const lastTeam = scheduleTeams.pop()!;
        scheduleTeams.splice(1, 0, lastTeam);
    }
    setTournament({ type: 'round-robin', data: schedule });
  }

  const handleMatchWinner = (matchId: string, winner: Team) => {
    if (tournament.type !== 'bracket') return;
    
    setTournament(prev => {
        if (prev.type !== 'bracket') return prev;

        const newBracket = JSON.parse(JSON.stringify(prev.data)) as BracketNode[][];
        
        let foundMatch: BracketNode | undefined;
        let roundIndexOfFoundMatch = -1;
        let matchIndexOfFoundMatch = -1;

        for (let r = 0; r < newBracket.length; r++) {
            const matchIndex = newBracket[r].findIndex((m: BracketNode) => m.id === matchId);
            if (matchIndex !== -1) {
                foundMatch = newBracket[r][matchIndex];
                if (foundMatch) {
                    foundMatch.winner = winner;
                    roundIndexOfFoundMatch = r;
                    matchIndexOfFoundMatch = matchIndex;
                }
                break;
            }
        }

        if (foundMatch && foundMatch.nextMatchId && roundIndexOfFoundMatch < newBracket.length - 1) {
            const nextRound = newBracket[roundIndexOfFoundMatch + 1];
            const nextMatch = nextRound.find((m: BracketNode) => m.id === foundMatch!.nextMatchId);

            if (nextMatch) {
                delete nextMatch.winner;
                
                if (matchIndexOfFoundMatch % 2 === 0) {
                    nextMatch.team1 = winner;
                } else {
                    nextMatch.team2 = winner;
                }
            }
        }

        return { ...prev, data: newBracket };
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200">
      <Header />
      <Navbar 
        activeView={activeView} 
        setActiveView={setActiveView}
      />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        {activeView === 'setup' && (
          <SetupView
            players={players}
            onAddPlayer={addPlayer}
            onRemovePlayer={removePlayer}
          />
        )}
        {activeView === 'teams' && (
          <TeamsView
            players={players}
            teams={teams}
            isLoading={isLoading}
            error={error}
            onGenerateTeams={generateTeams}
            onNavigateToTournament={() => setActiveView('tournament')}
            onGenerateLogo={handleGenerateLogo}
          />
        )}
        {activeView === 'tournament' && (
          <TournamentView
            teams={teams}
            tournament={tournament}
            onGenerateBracket={generateBracket}
            onGenerateRoundRobin={generateRoundRobin}
            onSetWinner={handleMatchWinner}
          />
        )}
      </main>
    </div>
  );
};

export default App;