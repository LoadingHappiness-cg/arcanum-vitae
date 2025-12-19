
import React, { useState } from 'react';
import { getMirrorReflection } from '../services/gemini';

const TheMirror: React.FC = () => {
  const [input, setInput] = useState('');
  const [reflection, setReflection] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setLoading(true);
    const result = await getMirrorReflection(input);
    setReflection(result);
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-40 pb-20 px-6 max-w-4xl mx-auto flex flex-col relative">
      <div className="scanline-red opacity-10"></div>
      <h2 className="text-6xl md:text-9xl font-extrabold tracking-tightest mb-12 fade-in uppercase leading-none text-white quantum-leap">
        The Mirror
      </h2>
      <p className="text-stone-500 mb-16 font-mono-machine text-xs uppercase tracking-[0.4em] fade-in delay-200 max-w-2xl leading-relaxed border-l border-red-900/40 pl-8">
        Arcanum Vitae does not offer answers. It offers reflections.
        Speak your truth, your doubt, your resistance.
      </p>

      {!reflection ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-8 fade-in delay-300 relative group">
          <div className="absolute -inset-1 bg-red-900/10 opacity-0 group-hover:opacity-100 transition-opacity blur-2xl pointer-events-none"></div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="WHAT HAUNTS YOUR SILENCE?"
            className="bg-black border border-stone-800 p-8 text-2xl font-serif-brutal italic text-stone-200 focus:outline-none focus:border-red-600 transition-colors min-h-[300px] resize-none relative z-10"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="self-start px-12 py-5 bg-black border border-red-600 text-red-600 font-syne font-extrabold hover:bg-red-600 hover:text-white transition-all disabled:opacity-50 uppercase tracking-[0.5em] text-[10px] relative z-10 brutal-hover"
          >
            {loading ? '[ PROCESSING_TRUTH ]' : '[ CONFRONT ]'}
          </button>
        </form>
      ) : (
        <div className="space-y-16 quantum-leap">
          <div className="p-10 border-l border-stone-800 bg-stone-950/40 relative">
            <div className="scanline-red opacity-5"></div>
            <p className="text-stone-700 text-[9px] mb-6 font-mono-machine uppercase tracking-[0.4em]">Your Presence</p>
            <p className="text-stone-400 italic text-2xl font-serif-brutal">"{input}"</p>
          </div>
          
          <div className="p-10 border-l-2 border-red-600 bg-black relative overflow-hidden red-pulse-border">
             <div className="scanline-red opacity-20"></div>
             <p className="text-red-600 text-[9px] mb-6 font-mono-machine uppercase tracking-[0.5em] animate-pulse">The Reflection</p>
             <p className="text-3xl md:text-5xl font-extrabold tracking-tightest text-white uppercase leading-tight glitch-text">
               {reflection}
             </p>
          </div>

          <button
            onClick={() => { setReflection(null); setInput(''); }}
            className="px-10 py-4 border border-stone-900 text-stone-700 font-syne font-bold hover:border-red-600 hover:text-white transition-colors uppercase text-[10px] tracking-widest"
          >
            RESET MIRROR
          </button>
        </div>
      )}
    </div>
  );
};

export default TheMirror;
