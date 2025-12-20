
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

            <div className="mt-40 mb-20 max-w-2xl mx-auto text-center stagger-item">
                <div className="w-px h-20 bg-red-900/50 mx-auto mb-12"></div>
                <h3 className="text-red-900 font-mono-machine text-[9px] uppercase tracking-[0.6em] mb-12">The Human Source</h3>

                <div className="space-y-8 text-stone-400 font-serif-brutal italic text-xl leading-relaxed">
                    <p>this project comes from a real person.</p>
                    <p>
                        not from a market concept,<br />
                        not from an image strategy,<br />
                        not from a character.
                    </p>
                    <p>
                        every song here is personal.<br />
                        not in a confessional way,<br />
                        but in a responsible one.
                    </p>
                    <p>
                        they are made of ideas i have carried,<br />
                        experiences i have lived through,<br />
                        doubts, failures, choices,<br />
                        and ethical concerns that do not resolve easily.
                    </p>
                    <p>
                        i am not writing from absolute certainty.<br />
                        i am writing from the honest attempt<br />
                        to remain decent<br />
                        in a world that is complex, unjust, and contradictory.
                    </p>
                    <p>
                        these songs reflect real inquietudes:<br />
                        about power and abuse,<br />
                        about silence and responsibility,<br />
                        about belonging, legacy, and memory,<br />
                        about what we pass on to those who come after us.
                    </p>
                    <p>
                        there are no closed answers here.<br />
                        there are questions sustained over time.
                    </p>
                    <p>
                        i believe art should not anesthetize,<br />
                        should not explain everything,<br />
                        should not sell redemption.
                    </p>
                    <p>
                        it should accompany.<br />
                        it should echo.<br />
                        it should carry something that remains alive<br />
                        after the sound fades.
                    </p>
                    <p>
                        if something here resonates,<br />
                        it is because it was lived<br />
                        before it was written.
                    </p>
                    <p>
                        this is assumed with care,<br />
                        with respect,<br />
                        and with intention.
                    </p>
                </div>

                <div className="mt-16 pt-16 border-t border-stone-900/50">
                    <p className="text-stone-500 font-mono-machine text-[10px] uppercase tracking-widest mb-4">
                        these songs are personal because responsibility is personal.
                    </p>
                    <div className="mt-8 opacity-60 hover:opacity-100 transition-opacity">
                        <span className="text-stone-600 font-mono-machine text-[9px] uppercase tracking-widest mr-4">origin signal:</span>
                        <a
                            href="https://www.linkedin.com/in/carlos-gavela/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-stone-400 hover:text-red-600 font-syne font-bold uppercase tracking-widest text-xs transition-colors border-b border-stone-800 hover:border-red-600 pb-1"
                        >
                            Carlos Gavela
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutView;
