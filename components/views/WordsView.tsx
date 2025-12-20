
import React from 'react';
import { WordFragment } from '../../types';
import { FICTION_DECLARATION, AI_DECLARATION } from '../../constants';

interface WordsViewProps {
    fragments: WordFragment[];
}

const WordsView: React.FC<WordsViewProps> = ({ fragments }) => {
    return (
        <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto view-transition">
            <h2 className="text-6xl md:text-[10rem] font-extrabold tracking-tightest mb-20 uppercase leading-none text-white">Words</h2>
            <div className="mb-40 p-6 md:p-12 border border-red-900/20 bg-stone-950/30 backdrop-blur-sm relative overflow-hidden red-pulse-border">
                <div className="scanline-red opacity-10"></div>
                <h3 className="font-mono-machine text-[10px] text-red-600 uppercase tracking-[0.4em] mb-8">Artifact Declaration</h3>
                <p className="text-3xl md:text-5xl font-bold tracking-tightest mb-8 leading-none uppercase reveal-mask text-white">{FICTION_DECLARATION.main}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12 pt-12 border-t border-stone-900 stagger-item">
                    <div className="space-y-6">
                        <p className="text-red-900 font-mono-machine text-xs uppercase tracking-widest mb-2 opacity-80">Operational Truth:</p>
                        <p className="text-stone-200 font-serif-brutal text-2xl italic leading-relaxed border-l border-red-900/50 pl-6">{FICTION_DECLARATION.details}</p>
                    </div>
                    <div className="space-y-6">
                        <p className="text-red-900 font-mono-machine text-xs uppercase tracking-widest mb-2 opacity-80">Machine Logic:</p>
                        <p className="text-stone-400 font-mono-machine text-[11px] leading-relaxed uppercase tracking-widest">{AI_DECLARATION.main}</p>
                    </div>
                </div>
            </div>
            <div className="space-y-32">
                {fragments.map((fragment, i) => (
                    <div key={fragment.id} className="stagger-item max-w-3xl border-l-4 border-transparent hover:border-red-600 pl-8 transition-all duration-300" style={{ animationDelay: `${i * 150}ms` }}>
                        <p className="text-4xl md:text-7xl font-extrabold tracking-tightest leading-[0.8] hover:text-red-600 transition-colors cursor-default uppercase text-white group">{fragment.text}</p>
                        {fragment.source && <p className="text-stone-500 mt-6 font-mono-machine text-[10px] tracking-widest uppercase">— SOURCE: <span className="text-red-900">{fragment.source}</span></p>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WordsView;
