import React from 'react';
import { Team } from '../types';
import TeamCard from './TeamCard';

interface TeamListProps {
  teams: Team[];
  onGenerateLogo: (teamId: string) => void;
}

const TeamList: React.FC<TeamListProps> = ({ teams, onGenerateLogo }) => {
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      {teams.map((team) => (
        <TeamCard key={team.id} team={team} onGenerateLogo={onGenerateLogo} />
      ))}
    </div>
  );
};

export default TeamList;