
import React from 'react';
import { View } from '../types';

interface NavProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

const Navigation: React.FC<NavProps> = ({ currentView, onNavigate }) => {
  const links = [
    { label: 'MUSIC', value: View.MUSIC },
    { label: 'WORDS', value: View.WORDS },
    { label: 'VISUALS', value: View.VISUALS },
    { label: 'ARCHIVE', value: View.ARCHIVE },
    { label: 'ABOUT', value: View.ABOUT },
    { label: 'THE MIRROR', value: View.MIRROR },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 mix-blend-difference px-6 py-10 md:px-12 flex justify-between items-start">
      <button 
        onClick={() => onNavigate(View.HOME)}
        className="group relative font-syne font-extrabold text-2xl tracking-tightest hover:text-white transition-colors leading-none"
      >
        <span className="relative z-10">ARCANUM VITAE</span>
        <span className="absolute -inset-1 bg-red-600/0 group-hover:bg-red-600/10 blur-xl transition-all duration-700"></span>
      </button>
      
      <div className="flex flex-col gap-6 items-end">
        {links.map(link => (
          <button
            key={link.value}
            onClick={() => onNavigate(link.value)}
            className={`text-[10px] font-syne font-bold tracking-[0.4em] transition-all hover:text-red-500 relative group ${
              currentView === link.value ? 'text-red-600' : 'text-stone-600'
            }`}
          >
            <span className="relative z-10">{link.label}</span>
            {currentView === link.value && (
              <span className="absolute -left-4 top-1/2 -translate-y-1/2 w-1 h-1 bg-red-600 rounded-full animate-pulse"></span>
            )}
            <span className="absolute bottom-0 right-0 w-0 h-[1px] bg-red-600 group-hover:w-full transition-all duration-300"></span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
