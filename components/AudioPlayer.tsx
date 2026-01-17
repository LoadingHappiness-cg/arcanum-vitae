
import React, { useState, useRef } from 'react';
import { Track } from '../types';

const formatTime = (seconds: number) => {
  if (isNaN(seconds)) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

interface AudioPlayerProps {
  track: Track;
  index: number;
  isCurrentTrack?: boolean;
  onPlayRequest?: () => void;
  trackEvent?: (name: string, data?: any) => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ track, index, isCurrentTrack = false, onPlayRequest, trackEvent }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [reachedMilestone, setReachedMilestone] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressContainerRef = useRef<HTMLDivElement | null>(null);

  // Pause if another track takes focus
  React.useEffect(() => {
    if (!isCurrentTrack && isPlaying) {
      if (audioRef.current) audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [isCurrentTrack]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Notify parent to stop others before we start
      if (onPlayRequest) onPlayRequest();

      audioRef.current.play();
      setIsPlaying(true);
    }
  };
  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const cur = audioRef.current.currentTime;
    const dur = audioRef.current.duration;
    setCurrentTime(cur);
    setDuration(dur);
    const percentage = (cur / dur) * 100;
    setProgress(percentage);

    if (percentage >= 50 && !reachedMilestone) {
      setReachedMilestone(true);
      if (trackEvent) {
        trackEvent('Music Milestone 50%', { track: track.title });
      }
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    if (trackEvent) {
      trackEvent('Music Completed', { track: track.title });
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressContainerRef.current) return;
    const rect = progressContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(1, x / width));
    audioRef.current.currentTime = percentage * audioRef.current.duration;
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  return (
    <div
      className={`group border ${isPlaying ? 'red-pulse-border border-red-600/50 bg-red-900/5 shadow-[inset_0_0_40px_rgba(139,0,0,0.1)]' : 'border-stone-900 hover:border-stone-800 bg-stone-950/10'} p-8 md:p-12 mb-12 stagger-item transition-all duration-1000 relative overflow-hidden`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="scanline-red opacity-[0.03]"></div>

      <div className="absolute top-0 right-0 p-4 flex gap-3 pointer-events-none">
        <span className="text-[7px] font-mono-machine text-red-600 uppercase tracking-[0.5em] opacity-40 group-hover:opacity-100 transition-opacity">[ PCM_RAW ]</span>
        <span className="text-[7px] font-mono-machine text-stone-800 uppercase tracking-[0.5em]">[ AES_ENCRYPTED ]</span>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8 relative z-10">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-2">
            <span className={`font-mono-machine text-[10px] tracking-widest uppercase transition-colors ${isPlaying ? 'text-red-500' : 'text-stone-600'}`}>
              [ {isPlaying ? 'SENSING_SIGNAL' : 'IDLE_MANIFEST'} ]
            </span>
            {isPlaying && (
              <div className="spectrum-container">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="spectrum-bar" style={{ animationDelay: `${i * 0.05}s`, animationDuration: `${0.4 + Math.random() * 0.4}s` }}></div>
                ))}
              </div>
            )}
            {!isPlaying && <span className="text-stone-800 font-mono-machine text-[9px]">• 24BIT_DEPTH •</span>}
          </div>
          <h4 className={`text-3xl md:text-5xl font-extrabold tracking-tightest uppercase transition-colors leading-none ${isPlaying ? 'text-red-600' : 'text-stone-300 group-hover:text-white'}`}>
            {track.title}
          </h4>
        </div>

        <button
          onClick={togglePlay}
          className={`btn-activate px-12 py-5 border transition-all font-syne font-bold text-[10px] tracking-[0.4em] uppercase min-w-[160px] ${isPlaying ? 'border-red-600 bg-transparent text-white' : 'border-stone-800 text-stone-400 bg-stone-950 hover:border-red-600'}`}
        >
          <span>{isPlaying ? 'SUSPEND' : 'ACTIVATE'}</span>
        </button>
      </div>

      <div className="flex items-center gap-4 mb-12 relative z-10">
        <span className={`font-mono-machine text-[10px] w-12 transition-colors ${isPlaying ? 'text-red-500' : 'text-stone-600'}`}>
          {formatTime(currentTime)}
        </span>
        <div
          ref={progressContainerRef}
          onClick={handleSeek}
          className="relative flex-1 h-[4px] bg-stone-900 overflow-hidden cursor-pointer group/seek"
        >
          <div
            className={`absolute top-0 left-0 h-full transition-all duration-150 ease-linear z-10 ${isPlaying ? 'bg-red-600 shadow-[0_0_15px_rgba(255,0,0,0.8)]' : 'bg-stone-600'}`}
            style={{ width: `${progress}%` }}
          ></div>
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover/seek:opacity-100 transition-opacity"></div>
        </div>
        <span className="font-mono-machine text-[10px] text-stone-600 w-12 text-right">{formatTime(duration)}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <h5 className="text-[10px] font-mono-machine tracking-widest text-stone-700 uppercase">Manifestation Context</h5>
            <div className="h-px flex-1 bg-stone-900"></div>
            <span className="text-[8px] font-mono-machine text-red-900 uppercase tracking-widest">[ TRUTH ]</span>
          </div>
          <p className="text-stone-500 font-serif-brutal text-xl italic leading-relaxed whitespace-pre-wrap">
            {track.story}
          </p>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-6">
            <h5 className="text-[10px] font-mono-machine tracking-widest text-stone-700 uppercase">Testimony (Lyrics)</h5>
            <div className="h-px flex-1 bg-stone-900"></div>
            <span className="text-[8px] font-mono-machine text-red-900 uppercase tracking-widest">[ BONE ]</span>
          </div>
          <p className="text-stone-200 font-serif-brutal text-2xl leading-snug whitespace-pre-wrap selection:bg-red-600 selection:text-white">
            {track.lyrics}
          </p>
        </div>
      </div>

      <div className="mt-12 pt-6 border-t border-stone-900/50 flex justify-between items-center opacity-60 group-hover:opacity-100 transition-opacity">
        <div className="flex gap-6">
          <span className="text-[8px] font-mono-machine text-red-600/60 uppercase tracking-widest">SIGNAL_STRENGTH: {isPlaying ? '100%' : '20%'}</span>
          <span className="text-[8px] font-mono-machine text-stone-700 uppercase tracking-widest">FRAGMENT_TYPE: AUDIO_MANIFEST</span>
        </div>
        <div className="text-[8px] font-mono-machine text-stone-800 uppercase tracking-[0.2em]">
          ARCHIVE_REF: 00{index + 1}_R_RESISTANCE
        </div>
      </div>

      <audio
        ref={audioRef}
        src={track.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />
    </div>
  );
};

export default AudioPlayer;
