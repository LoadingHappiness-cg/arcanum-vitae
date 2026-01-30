
import React from 'react';
import { Album } from '../../types';
import AudioPlayer from '../AudioPlayer';

interface MusicViewProps {
    albums: Album[];
    trackEvent?: (name: string, data?: any) => void;
    initialScrollId?: string | null;
}

const MusicView: React.FC<MusicViewProps> = ({ albums, trackEvent, initialScrollId }) => {
    const [currentPlayingId, setCurrentPlayingId] = React.useState<string | number | null>(null);

    const updateHash = (id: string) => {
        if (typeof window === 'undefined') return;
        const nextHash = `#${id}`;
        if (window.location.hash !== nextHash) {
            window.history.replaceState(null, '', nextHash);
        }
    };

    const handlePlayRequest = (id: string | number, title: string, anchorId: string, meta?: Record<string, any>) => {
        setCurrentPlayingId(id);
        updateHash(anchorId);
        if (trackEvent) {
            trackEvent('Music Started', { track: title, ...meta });
        }
    };

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
            updateHash(id);
        }
    };

    React.useEffect(() => {
        if (typeof window === 'undefined') return;

        // 1) Route-driven scroll (preferred)
        if (initialScrollId && initialScrollId.startsWith('track-')) {
            const targetId = initialScrollId;
            requestAnimationFrame(() => scrollToTrack(targetId));
            return;
        }

        // 2) Back-compat: hash-driven scroll
        const hash = window.location.hash || '';
        if (!hash.startsWith('#track-')) return;
        const targetId = hash.slice(1);
        requestAnimationFrame(() => scrollToTrack(targetId));
    }, [albums, initialScrollId]);

    return (
        <div className="pt-32 pb-40 px-6 max-w-7xl mx-auto view-transition relative">

            <div className="mb-32 fade-in">
                <h2 className="text-6xl md:text-[14vw] font-extrabold tracking-tightest mb-10 leading-none uppercase text-white quantum-leap">Sounds</h2>
                <div className="max-w-5xl p-6 md:p-12 border border-red-900/30 bg-stone-950/40 mb-20 backdrop-blur-sm relative overflow-hidden red-pulse-border">
                    <div className="scanline-red opacity-10"></div>
                    <p className="text-red-600 font-mono-machine text-[10px] tracking-[0.5em] uppercase mb-8">ALBUM MANIFESTO: {albums[0]?.title || 'UNTITLED'}</p>
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

            {/* Newest Signal Spotlight */}
            {albums.find(a => a.id === 'unnamed-album') && (
                <div className="mb-40 fade-in">
                    <div className="flex items-center gap-4 mb-8 px-4 md:px-0">
                        <span className="w-12 h-px bg-red-600"></span>
                        <h3 className="text-red-600 font-mono-machine text-[10px] tracking-[0.5em] uppercase">Newest Signal Detected</h3>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-12 bg-stone-950/20 border border-red-900/20 p-8 md:p-16 relative overflow-hidden group rounded-sm shadow-[0_0_50px_rgba(127,29,29,0.05)]">
                        <div className="scanline-red opacity-10"></div>
                        <div className="relative z-10 flex flex-col justify-center">
                            <span className="text-stone-600 font-mono-machine text-[8px] uppercase tracking-[0.4em] mb-6 block border-l-2 border-red-900 pl-4">[ TRANSMISSION_ENHANCED ]</span>
                            <h4 className="text-5xl md:text-9xl font-black tracking-tighter uppercase text-white mb-8 group-hover:glitch-text leading-none drop-shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-500">
                                Fracture
                            </h4>
                            <p className="text-stone-400 font-serif-brutal text-2xl md:text-3xl italic mb-12 max-w-xl leading-relaxed opacity-90">
                                "The fracture is where the light gets in. <span className="text-stone-100">Beyond the data, under the skin.</span>"
                            </p>
                            <div className="flex flex-wrap gap-10 items-center">
                                <button
                                    onClick={() => scrollToTrack('track-unnamed-album-0')}
                                    className="px-12 py-6 bg-red-600 text-black font-syne font-bold text-[11px] tracking-[0.3em] uppercase hover:bg-white transition-all transform hover:-translate-y-1 active:translate-y-0 shadow-[0_10px_30px_rgba(220,38,38,0.3)] hover:shadow-[0_15px_40px_rgba(255,255,255,0.2)]"
                                >
                                    Activate Fragment
                                </button>
                                <div className="flex flex-col gap-2 border-l border-stone-800 pl-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-950 animate-pulse"></div>
                                        <span className="text-stone-600 font-mono-machine text-[7px] uppercase tracking-widest italic">Phase: Pre-Release</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.5)]"></div>
                                        <span className="text-red-600 font-mono-machine text-[7px] uppercase tracking-widest font-bold">Priority: CRITICAL</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative flex justify-center items-center lg:pl-12">
                            <div className="absolute inset-0 bg-red-900/10 blur-[100px] rounded-full group-hover:bg-red-600/10 transition-colors duration-1000"></div>
                            <div className="relative p-1 bg-gradient-to-br from-red-900/40 to-transparent rounded-sm">
                                <img
                                    src={albums.find(a => a.id === 'unnamed-album')?.coverUrl}
                                    alt="Fracture cover"
                                    className="w-full aspect-square object-cover grayscale contrast-[1.2] brightness-90 border border-white/5 relative z-10 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000 transform group-hover:scale-[1.05] shadow-2xl"
                                />
                                {/* Decorative elements */}
                                <div className="absolute -top-6 -right-6 w-24 h-24 border-t border-r border-red-600/30 z-20 pointer-events-none group-hover:border-red-600/60 transition-colors duration-500"></div>
                                <div className="absolute -bottom-6 -left-6 w-24 h-24 border-b border-l border-red-600/30 z-20 pointer-events-none group-hover:border-red-600/60 transition-colors duration-500"></div>

                                <div className="absolute top-0 left-0 w-8 h-[1px] bg-red-600/40 z-20"></div>
                                <div className="absolute top-0 left-0 w-[1px] h-8 bg-red-600/40 z-20"></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 gap-20">
                {albums.map((album) => (
                    <div key={album.id} className="fade-in">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20 items-start mb-24 pb-24 border-b border-stone-900">
                            {/* Sticky Left Sidebar with Album Info & Track Index */}
                            {/* self-start is CRITICAL for sticky to work in a grid item! */}
                            <div className="lg:col-span-1 lg:sticky lg:top-40 self-start stagger-item max-h-[90vh] overflow-y-auto custom-scrollbar pr-4">
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
                                        const trackMeta = {
                                            album_id: album.id,
                                            album_title: album.title,
                                            track_id: uniqueKey,
                                            track_title: track.title,
                                            track_index: ti + 1,
                                            track_anchor: scrollId
                                        };
                                        return (
                                            <div id={scrollId} key={uniqueKey} className="scroll-mt-32 transition-colors duration-500">
                                                <AudioPlayer
                                                    track={track}
                                                    index={ti}
                                                    isCurrentTrack={currentPlayingId === uniqueKey}
                                                    onPlayRequest={() => handlePlayRequest(uniqueKey, track.title, scrollId, trackMeta)}
                                                    trackEvent={trackEvent}
                                                    trackMeta={trackMeta}
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
