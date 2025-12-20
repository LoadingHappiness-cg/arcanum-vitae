
import React from 'react';
import { ARTISTIC_STATEMENT, FICTION_DECLARATION, AI_DECLARATION, INITIAL_HOME_CONTENT } from '../../constants';
import { HomeContent } from '../../types';

interface HomeViewProps {
    isEntered: boolean;
    onEnter: () => void;
    homeContent?: HomeContent;
}

const HomeView: React.FC<HomeViewProps> = ({ isEntered, onEnter, homeContent = INITIAL_HOME_CONTENT }) => {
    return (
        <div className="flex flex-col min-h-screen relative">
            <div className="scanline-red"></div>
            <section className="relative h-screen flex flex-col justify-center items-center px-6 text-center bg-black overflow-hidden">
                <div className={`absolute inset-0 z-0 transition-all duration-[3000ms] ease-out ${isEntered ? 'scale-110 opacity-5 blur-xl' : 'scale-100 opacity-40'}`}>
                    <img src={ARTISTIC_STATEMENT.url} alt="Manifestation" className="w-full h-full object-cover grayscale brightness-50" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
                    {!isEntered && (
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
                            <div className="w-[2px] bg-red-600 witness-line"></div>
                        </div>
                    )}
                </div>
                <div className="absolute inset-0 z-[1] grain-overlay opacity-[0.06] pointer-events-none"></div>
                <div className="relative z-10 flex flex-col items-center max-w-screen-2xl quantum-leap">
                    <p className="font-mono-machine text-[10px] tracking-[0.4em] sm:tracking-[0.8em] text-red-600 uppercase mb-8 fade-in">
                        [ POSITION_DECLARED ]
                    </p>
                    <h1 className="text-[15vw] md:text-[18vw] font-extrabold tracking-tightest leading-[0.75] mb-8 fade-in glitch-text text-white quantum-leap">
                        ARCANUM<br />VITAE
                    </h1>
                    <div className="flex flex-col md:flex-row gap-8 items-center justify-center fade-in delay-500">
                        <p className="font-serif-brutal text-2xl md:text-4xl text-stone-300 italic">Silence is no longer an option.</p>
                        <div className="hidden md:block w-12 h-px bg-red-900"></div>
                        <p className="font-mono-machine text-[10px] tracking-widest text-stone-600 uppercase">{FICTION_DECLARATION.tagline}</p>
                    </div>
                    {!isEntered && (
                        <div className="mt-20 group relative">
                            <button
                                onClick={onEnter}
                                className="relative z-10 px-10 sm:px-24 py-6 border border-stone-800 hover:border-red-600 text-stone-100 hover:text-white transition-all duration-700 font-syne font-extrabold tracking-[0.3em] sm:tracking-[0.6em] text-[10px] bg-black/40 backdrop-blur-xl overflow-hidden uppercase brutal-hover"
                            >
                                <span className="relative z-20">Enter the Fracture</span>
                                <div className="absolute inset-0 bg-red-700 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></div>
                            </button>
                            <div className="absolute inset-0 blur-3xl bg-red-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                        </div>
                    )}
                </div>
            </section>

            {isEntered && (
                <div className="fade-in bg-black relative">
                    <div className="absolute inset-0 tension-gradient opacity-40 pointer-events-none"></div>
                    <section className="py-60 px-6 max-w-6xl mx-auto flex flex-col items-center relative z-10">
                        <div className="w-px h-32 bg-red-600 mb-20"></div>
                        <p className="text-4xl md:text-8xl font-extrabold tracking-tightest leading-none text-center mb-12 uppercase reveal-mask text-stone-200 quantum-leap">
                            Art is not <br /><span className="text-red-600 italic">decoration</span>.<br />It is <span className="underline decoration-red-600 underline-offset-8">position</span>.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mt-32 border-t border-stone-900 pt-20 stagger-item">
                            <p className="text-3xl font-serif-brutal text-stone-400 italic leading-snug quantum-leap">Arcanum Vitae exists where music, thought, and conscience collide. Where beauty does not hide pain — it reveals it.</p>
                            <div className="space-y-8">
                                <p className="font-mono-machine text-xs text-stone-600 uppercase leading-relaxed tracking-widest border-l-2 border-red-900 pl-6">{AI_DECLARATION.main}</p>
                                <div className="flex gap-4 items-center">
                                    <div className="flex-1 h-px bg-red-950"></div>
                                    <p className="text-stone-300 font-syne font-bold text-[10px] uppercase tracking-widest">Manifested by machine. Curated by bone.</p>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="pb-40 px-6 max-w-6xl mx-auto w-full">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="h-[1px] flex-1 bg-red-900/40"></div>
                            <span className="text-[9px] font-mono-machine text-red-600 uppercase tracking-[0.6em]">IMAGE_RELICS</span>
                            <div className="h-[1px] flex-1 bg-red-900/40"></div>
                        </div>
                        <p className="text-center text-stone-500 font-mono-machine text-[10px] uppercase tracking-[0.3em] leading-relaxed mb-10 fade-in">
                            {homeContent.galleryMessage.split('\n').map((line, idx) => (
                                <React.Fragment key={`${idx}-${line}`}>
                                    {line}
                                    {idx < homeContent.galleryMessage.split('\n').length - 1 && <br />}
                                </React.Fragment>
                            ))}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {homeContent.galleryItems.map((item, index) => (
                                <div key={item.id} className="group relative aspect-[4/3] overflow-hidden border border-stone-900 bg-black transmission-glitch">
                                    <img
                                        src={`/media/images/home/${item.id}.jpg`}
                                        alt={item.title}
                                        loading="lazy"
                                        className="w-full h-full object-cover grayscale opacity-70 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-[1200ms]"
                                        onError={(event) => {
                                            event.currentTarget.style.opacity = '0';
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <div className="text-[8px] font-mono-machine text-red-600 tracking-[0.4em] uppercase mb-2">
                                            {item.title || `RELIC_${String(index + 1).padStart(2, '0')}`}
                                        </div>
                                        <div className="text-[10px] font-serif-brutal italic text-stone-300 leading-snug">
                                            {item.manifesto}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
};

export default HomeView;
