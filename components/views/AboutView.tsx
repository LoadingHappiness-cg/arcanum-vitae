
import React from 'react';
import { AI_DECLARATION, FICTION_DECLARATION } from '../../constants';
import BandPortraits from '../BandPortraits';

const AboutView: React.FC = () => {
    return (
        <div className="pt-32 pb-40 px-6 max-w-7xl mx-auto view-transition">
            <div className="mb-32 fade-in">
                <h2 className="text-6xl md:text-[14vw] font-extrabold tracking-tightest mb-10 leading-none uppercase text-white quantum-leap">About</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-32">
                    <div className="space-y-12">
                        <div className="p-12 border border-red-900/30 bg-stone-950/40 backdrop-blur-sm relative overflow-hidden red-pulse-border">
                            <div className="scanline-red opacity-10"></div>
                            <h3 className="text-red-600 font-mono-machine text-[10px] tracking-[0.5em] uppercase mb-8 underline decoration-red-600">The Human-Machine Dialogue</h3>
                            <p className="text-3xl md:text-5xl font-extrabold tracking-tightest uppercase leading-none text-stone-100 italic mb-8">
                                {AI_DECLARATION.main}
                            </p>
                            <div className="space-y-4">
                                {AI_DECLARATION.body.map((line, i) => (
                                    <p key={i} className="text-stone-400 font-serif-brutal text-xl italic border-l border-red-900/40 pl-6">
                                        {line}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-12">
                        <div className="p-12 border border-stone-900 bg-black relative">
                            <h3 className="text-stone-600 font-mono-machine text-[10px] tracking-[0.5em] uppercase mb-8">Ontological Status</h3>
                            <p className="text-2xl font-serif-brutal text-stone-300 italic leading-relaxed mb-8">
                                {FICTION_DECLARATION.details}
                            </p>
                            <div className="pt-8 border-t border-stone-900">
                                <p className="text-stone-500 font-mono-machine text-[10px] uppercase tracking-widest leading-loose">
                                    {FICTION_DECLARATION.main}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <BandPortraits />
        </div>
    );
};

export default AboutView;
