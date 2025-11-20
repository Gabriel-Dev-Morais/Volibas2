
import React from 'react';
import { VolleyballIcon } from './Icons';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-900/70 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-center">
        <VolleyballIcon className="w-8 h-8 mr-3 text-cyan-400" />
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-cyan-400 text-transparent bg-clip-text">
          Organizador de Times de Vôlei
        </h1>
      </div>
    </header>
  );
};

export default Header;
