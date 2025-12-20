import React from 'react';
import { AI_DECLARATION, FICTION_DECLARATION } from '../../constants';
import BandPortraits from '../BandPortraits';
import { FictionDeclaration, AiDeclaration, HumanIdentity } from '../../types';

interface AboutViewProps {
    humanManifesto?: string;
    humanIdentity?: HumanIdentity;
    fictionDec?: FictionDeclaration;
    aiDec?: AiDeclaration;
}

const AboutView: React.FC<AboutViewProps> = ({
    humanManifesto,
    humanIdentity,
    fictionDec = FICTION_DECLARATION,
    aiDec = AI_DECLARATION
}) => {
    return (
        <div className="pt-32 pb-40 px-6 max-w-7xl mx-auto view-transition">
            <div className="mb-32 fade-in">
                <h2 className="text-6xl md:text-[14vw] font-extrabold tracking-tightest mb-10 leading-none uppercase text-white quantum-leap">About</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 mb-32">
                    <div className="space-y-12">
                        <div className="p-6 md:p-12 border border-red-900/30 bg-stone-950/40 backdrop-blur-sm relative overflow-hidden red-pulse-border">
                            <div className="scanline-red opacity-10"></div>
                            <h3 className="text-red-600 font-mono-machine text-[10px] tracking-[0.5em] uppercase mb-8 underline decoration-red-600">The Human-Machine Dialogue</h3>
                            <p className="text-3xl md:text-5xl font-extrabold tracking-tightest uppercase leading-none text-stone-100 italic mb-8">
                                {aiDec.main}
                            </p>
                            <div className="space-y-4">
                                {aiDec.body.map((line, i) => (
                                    <p key={i} className="text-stone-400 font-serif-brutal text-xl italic border-l border-red-900/40 pl-6">
                                        {line}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-12">
                        <div className="p-6 md:p-12 border border-stone-900 bg-black relative">
                            <h3 className="text-stone-600 font-mono-machine text-[10px] tracking-[0.5em] uppercase mb-8">Ontological Status</h3>
                            <p className="text-2xl font-serif-brutal text-stone-300 italic leading-relaxed mb-8">
                                {fictionDec.details}
                            </p>
                            <div className="pt-8 border-t border-stone-900">
                                <p className="text-stone-500 font-mono-machine text-[10px] uppercase tracking-widest leading-loose">
                                    {fictionDec.main}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <BandPortraits />

            {humanManifesto && (
                <div className="mt-40 mb-20 max-w-2xl mx-auto text-center stagger-item">
                    <div className="w-px h-20 bg-red-900/50 mx-auto mb-12"></div>
                    <h3 className="text-red-900 font-mono-machine text-[9px] uppercase tracking-[0.6em] mb-12">The Human Source</h3>

                    <div className="space-y-8 text-stone-400 font-serif-brutal italic text-xl leading-relaxed whitespace-pre-wrap">
                        {humanManifesto}
                    </div>

                    <div className="mt-16 pt-16 border-t border-stone-900/50">
                        {humanIdentity && (
                            <>
                                <p className="text-stone-500 font-mono-machine text-[10px] uppercase tracking-widest mb-4">
                                    {humanIdentity.footerQuote}
                                </p>
                                <div className="mt-8 opacity-60 hover:opacity-100 transition-opacity">
                                    <span className="text-stone-600 font-mono-machine text-[9px] uppercase tracking-widest mr-4">{humanIdentity.originLabel}</span>
                                    <a
                                        href={humanIdentity.veritasLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-stone-400 hover:text-red-600 font-syne font-bold uppercase tracking-widest text-xs transition-colors border-b border-stone-800 hover:border-red-600 pb-1"
                                    >
                                        {humanIdentity.veritasName}
                                    </a>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AboutView;
