
import React from 'react';
import { Album } from '../../types';
import AudioPlayer from '../AudioPlayer';

interface MusicViewProps {
    albums: Album[];
}

const MusicView: React.FC<MusicViewProps> = ({ albums }) => {
    const [currentPlayingId, setCurrentPlayingId] = React.useState<string | number | null>(null);

    const scrollToTrack = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            const headerOffset = 180; // Adjust for fixed header/top spacing
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    };

    return (
        <div className="pt-32 pb-40 px-6 max-w-7xl mx-auto view-transition relative">

            <div className="mb-32 fade-in">
                <h2 className="text-6xl md:text-[14vw] font-extrabold tracking-tightest mb-10 leading-none uppercase text-white quantum-leap">Sounds</h2>
                <div className="max-w-5xl p-12 border border-red-900/30 bg-stone-950/40 mb-20 backdrop-blur-sm relative overflow-hidden red-pulse-border">
                    <div className="scanline-red opacity-10"></div>
                    <p className="text-red-600 font-mono-machine text-[10px] tracking-[0.5em] uppercase mb-8 underline decoration-red-600">ALBUM MANIFESTO: {albums[0]?.title || 'UNTITLED'}</p>
                    <div className="space-y-12">
                        <p className="text-3xl md:text-7xl font-extrabold tracking-tightest uppercase leading-none text-stone-100 italic reveal-mask drop-shadow-[0_0_15px_rgba(255,0,0,0.2)]">
                            "This work is not an <span className="text-red-600 hover-red-glow transition-all cursor-crosshair">opinion</span>. It is a <span className="text-red-600 hover-red-glow transition-all cursor-crosshair">record</span>."
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 pt-16 border-t border-stone-900 stagger-item">
                            <div className="space-y-8 text-stone-400 font-serif-brutal text-xl italic leading-relaxed whitespace-pre-wrap border-l border-red-900/40 pl-8">
                                {albums[0]?.concept || 'No manifest recorded.'}
                            </div>
                            <div className="space-y-8 text-stone-500 font-mono-machine text-[10px] uppercase tracking-[0.2em] leading-loose whitespace-pre-wrap">
                                {albums[0]?.context || 'No context provided.'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-20">
                {albums.map((album) => (
                    <div key={album.id} className="fade-in">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20 items-start mb-24 pb-24 border-b border-stone-900">
                            {/* Sticky Left Sidebar with Album Info & Track Index */}
                            {/* self-start is CRITICAL for sticky to work in a grid item! */}
                            <div className="lg:col-span-1 sticky top-40 self-start stagger-item max-h-[90vh] overflow-y-auto custom-scrollbar pr-4">
                                <div className="relative group mb-8 overflow-hidden brutal-border hover:border-red-600 transition-colors bg-stone-900">
                                    <img
                                        src={album.coverUrl || 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=800&h=800&auto=format&fit=crop'}
                                        alt={album.title}
                                        className="w-full aspect-square object-cover transition-all duration-1000 group-hover:scale-105 grayscale group-hover:grayscale-0 contrast-125"
                                    />
                                    <div className="absolute inset-0 bg-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity mix-blend-overlay"></div>
                                </div>
                                <h3 className="text-4xl font-extrabold tracking-tightest uppercase mb-2 leading-none text-white">{album.title}</h3>
                                <p className="text-red-600 font-mono-machine font-bold text-[10px] uppercase tracking-widest mb-10 border-b border-red-900 pb-2 inline-block">Released {album.year}</p>

                                {/* Track Navigation Index */}
                                <div className="border-l border-stone-800 pl-6 mt-8 hidden lg:block">
                                    <h4 className="text-stone-600 font-mono-machine text-[9px] uppercase tracking-[0.3em] mb-6">Track Index</h4>
                                    <ul className="space-y-3">
                                        {album.tracks.map((track, ti) => {
                                            const uniqueId = `track-${album.id}-${ti}`;
                                            const isPlaying = currentPlayingId === (track.id || `${album.id}-${ti}`);
                                            return (
                                                <li key={uniqueId}>
                                                    <button
                                                        onClick={() => scrollToTrack(uniqueId)}
                                                        className={`text-[10px] uppercase font-mono-machine text-left w-full transition-all duration-300 ${isPlaying
                                                            ? 'text-red-600 font-bold tracking-widest translate-x-2 border-l-2 border-red-600 pl-2'
                                                            : 'text-stone-500 hover:text-stone-300 hover:tracking-wider'
                                                            }`}
                                                    >
                                                        {ti + 1}. {track.title}
                                                    </button>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </div>
                            </div>

                            <div className="lg:col-span-2 pt-2">
                                <div className="flex flex-col gap-0">
                                    {album.tracks.map((track, ti) => {
                                        const uniqueKey = track.id || `${album.id}-${ti}`;
                                        const scrollId = `track-${album.id}-${ti}`;
                                        return (
                                            <div id={scrollId} key={uniqueKey} className="scroll-mt-32 transition-colors duration-500">
                                                <AudioPlayer
                                                    track={track}
                                                    index={ti}
                                                    isCurrentTrack={currentPlayingId === uniqueKey}
                                                    onPlayRequest={() => setCurrentPlayingId(uniqueKey)}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MusicView;
