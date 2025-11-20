import React from 'react';
import { AppView } from '../types';

interface NavbarProps {
  activeView: AppView;
  setActiveView: (view: AppView) => void;
}

const NavItem: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, isActive, onClick }) => {
  const baseClasses = "px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200";
  const activeClasses = "bg-cyan-500 text-white";
  const inactiveClasses = "bg-slate-700 hover:bg-slate-600 text-slate-300";

  const getClasses = () => {
    return isActive ? `${baseClasses} ${activeClasses}` : `${baseClasses} ${inactiveClasses}`;
  };

  return (
    <button onClick={onClick} className={getClasses()}>
      {label}
    </button>
  );
};

const Navbar: React.FC<NavbarProps> = ({ activeView, setActiveView }) => {
  return (
    <div className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700">
      <div className="container mx-auto px-4 py-2 flex justify-center">
        <div className="flex items-center space-x-2 bg-slate-800 p-1 rounded-lg">
          <NavItem 
            label="1. Montar Elenco" 
            isActive={activeView === 'setup'} 
            onClick={() => setActiveView('setup')}
          />
          <NavItem 
            label="2. Ver Times" 
            isActive={activeView === 'teams'} 
            onClick={() => setActiveView('teams')}
          />
          <NavItem 
            label="3. Torneio" 
            isActive={activeView === 'tournament'} 
            onClick={() => setActiveView('tournament')}
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;