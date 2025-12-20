
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
    { label: 'LEGAL', value: View.LEGAL },
    // { label: 'THE MIRROR', value: View.MIRROR }, // Disabled to conserve credits as per user request
  ];

  return (
    <nav className="md:fixed md:top-0 md:left-0 w-full z-50 pointer-events-none p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 pointer-events-auto max-w-[1920px] mx-auto bg-gradient-to-b from-black/80 to-transparent pb-12">
        <button
          onClick={() => onNavigate(View.HOME)}
          className="group relative"
        >
          <div className="flex flex-col items-start font-mono-machine">
            <span className="text-[10px] text-red-600 tracking-[0.5em] mb-1 opacity-70 group-hover:opacity-100 transition-opacity">[ MANIFEST_01 ]</span>
            <span className="font-syne font-extrabold text-3xl md:text-4xl tracking-tightest group-hover:text-red-600 transition-colors leading-none text-white">
              ARCANUM VITAE
            </span>
            <div className="h-[2px] w-0 bg-red-600 mt-2 group-hover:w-full transition-all duration-500 ease-out"></div>
          </div>
        </button>

        <div className="flex flex-col md:flex-row gap-6 md:gap-12 items-start md:items-center bg-black/40 backdrop-blur-md p-4 border border-stone-800/50 rounded-sm w-full md:w-auto">
          {links.map(link => {
            const isLegal = link.value === View.LEGAL;
            return (
            <button
              key={link.value}
              onClick={() => onNavigate(link.value)}
              className={`relative group px-2 py-1 transition-all duration-300 ${currentView === link.value ? 'text-white' : isLegal ? 'text-red-600' : 'text-stone-400 hover:text-white'
                }`}
            >
              <div className="flex flex-col items-end md:items-center gap-1">
                <span className={`text-[10px] md:text-xs font-mono-machine tracking-[0.2em] font-bold uppercase transition-transform group-hover:-translate-y-0.5 ${currentView === link.value ? 'text-red-600' : isLegal ? 'text-red-600 hover-red-glow' : ''}`}>
                  {link.label}
                </span>
                <div className={`h-[1px] bg-red-600 transition-all duration-300 ${currentView === link.value ? 'w-full' : isLegal ? 'w-full opacity-70 group-hover:opacity-100' : 'w-0 group-hover:w-full'}`}></div>
              </div>
            </button>
          )})}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
