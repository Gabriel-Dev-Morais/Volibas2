import React from 'react';
import { Player } from '../types';
import PlayerForm from '../components/PlayerForm';
import PlayerList from '../components/PlayerList';

interface SetupViewProps {
  players: Player[];
  onAddPlayer: (name: string, skillLevel: number) => void;
  onRemovePlayer: (id: string) => void;
}

const SetupView: React.FC<SetupViewProps> = ({ players, onAddPlayer, onRemovePlayer }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-4 space-y-8">
        <PlayerForm onAddPlayer={onAddPlayer} />
      </div>
      <div className="lg:col-span-8">
        <PlayerList players={players} onRemovePlayer={onRemovePlayer} />
      </div>
    </div>
  );
};

export default SetupView;
