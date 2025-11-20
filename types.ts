export interface Player {
  id: string;
  name: string;
  skillLevel: number; // 1-5
}

export interface Team {
  id: string;
  name: string;
  players: Player[];
  averageSkill: number;
  color?: string;
  logoUrl?: string;
  logoStatus?: 'pending' | 'loading' | 'loaded' | 'error';
}

export interface BracketNode {
  id: string;
  round: number;
  match: number;
  team1?: Team;
  team2?: Team;
  winner?: Team;
  nextMatchId?: string;
  isBye?: boolean;
}

export interface Match {
  team1: Team;
  team2: Team;
}

export type AppView = 'setup' | 'teams' | 'tournament';

export type Tournament = {
  type: 'bracket';
  data: BracketNode[][];
} | {
  type: 'round-robin';
  data: Match[][];
} | {
  type: null;
  data: [];
};
