import React, { useState } from 'react';
import { ARCHIVE_ITEMS } from '../constants';
import { curateSubmission } from '../services/gemini';

interface ResistanceArchiveProps {
  trackEvent?: (name: string, data?: any) => void;
}

const ResistanceArchive: React.FC<ResistanceArchiveProps> = ({ trackEvent }) => {
  const [isContributing, setIsContributing] = useState(false);
  const [submission, setSubmission] = useState('');
  const [author, setAuthor] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submission.trim()) return;

    setIsPending(true);
    if (trackEvent) {
      trackEvent('Archive Submission Attempted', { author: author || 'ANONYMOUS' });
    }
    const result = await curateSubmission(submission);
    setFeedback(result);
    setIsPending(false);

    if (trackEvent) {
      const isAccepted = result?.includes('[ACCEPTED]');
      trackEvent(isAccepted ? 'Archive Submission Accepted' : 'Archive Submission Rejected');
    }
  };

  const isAccepted = feedback?.includes('[ACCEPTED]');
  const cleanFeedback = feedback?.replace('[ACCEPTED]', '').replace('[REJECTED]', '').trim();

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <header className="mb-20 fade-in">
        <h2 className="text-5xl md:text-8xl font-bold tracking-tighter mb-6">RESISTANCE ARCHIVE</h2>
        <p className="text-stone-400 font-serif-brutal text-2xl max-w-2xl leading-relaxed">
          A collective testimony of defiance. Here we store the fragments of those who refuse to live on autopilot.
        </p>
        <button
          onClick={() => {
            const nextState = !isContributing;
            setIsContributing(nextState);
            if (nextState && trackEvent) {
              trackEvent('Archive Contribution Started');
            }
            setFeedback(null);
            setSubmission('');
          }}
          className="mt-12 px-8 py-3 border border-red-muted text-red-muted font-mono-machine hover:bg-red-muted hover:text-white transition-all uppercase tracking-widest text-xs font-bold"
        >
          {isContributing ? 'Return to the Records' : 'Contribute to the Archive'}
        </button>
      </header>

      {isContributing ? (
        <section className="mb-20 fade-in bg-stone-900/10 border border-stone-900 p-8 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 font-mono-machine text-[8px] text-stone-800 tracking-[0.5em] uppercase pointer-events-none">
            Protocol: Submission_Alpha_v.4
          </div>

          {!feedback ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
              <div>
                <h3 className="text-red-muted font-mono-machine uppercase tracking-[0.4em] text-[10px] mb-8 underline decoration-red-muted underline-offset-4">Submission Guidelines</h3>
                <div className="space-y-8">
                  <p className="text-stone-200 font-serif-brutal text-2xl italic leading-relaxed">
                    "Every word is a weight. Every thought is a position. We do not accept noise."
                  </p>
                  <ul className="space-y-6 text-stone-500 font-mono-machine text-[10px] uppercase tracking-widest leading-loose">
                    <li className="flex gap-4"><span>[01]</span> <span>Authenticity over aesthetics. If you are performing, go elsewhere.</span></li>
                    <li className="flex gap-4"><span>[02]</span> <span>Truth over comfort. We seek the fracture, not the polish.</span></li>
                    <li className="flex gap-4"><span>[03]</span> <span>Brevity is a spine. Say what is necessary. No more.</span></li>
                    <li className="flex gap-4"><span>[04]</span> <span>Silence is better than a lie.</span></li>
                  </ul>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                <div className="space-y-2">
                  <label className="text-stone-700 font-mono-machine text-[9px] uppercase tracking-[0.3em]">Identity (Optional)</label>
                  <input
                    type="text"
                    placeholder="ANONYMOUS"
                    className="w-full bg-transparent border-b border-stone-800 py-4 text-stone-200 font-mono-machine focus:outline-none focus:border-red-muted transition-colors uppercase text-xs tracking-widest placeholder:text-stone-800"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-stone-700 font-mono-machine text-[9px] uppercase tracking-[0.3em]">Testimony / Fragment</label>
                  <textarea
                    placeholder="WHAT IS YOUR POSITION?"
                    className="w-full bg-black/40 border border-stone-900 p-8 text-xl font-light text-stone-200 focus:outline-none focus:border-red-muted transition-colors min-h-[300px] resize-none font-serif-brutal italic"
                    value={submission}
                    onChange={(e) => setSubmission(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPending || !submission.trim()}
                  className="relative group px-12 py-6 bg-black border border-stone-800 hover:border-red-muted text-white font-mono-machine font-bold transition-all disabled:opacity-50 tracking-widest text-[10px] uppercase overflow-hidden"
                >
                  <span className="relative z-10">{isPending ? 'CURATING CONTENT...' : 'COMMIT TO THE VOID'}</span>
                  <div className="absolute inset-0 bg-red-muted/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                </button>
              </form>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-16 py-8">
              <div className="text-center mb-16">
                <p className="font-mono-machine text-[10px] text-stone-600 tracking-[0.5em] uppercase mb-4">Verification Process Complete</p>
                <div className="h-px w-24 bg-red-muted mx-auto"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="md:col-span-2 space-y-12">
                  <div className="p-10 bg-black border border-stone-900 relative">
                    <div className="absolute -top-3 left-6 px-4 bg-black text-stone-600 font-mono-machine text-[9px] tracking-widest uppercase">The Curator's Analysis</div>
                    <p className="text-2xl md:text-3xl font-serif-brutal italic leading-relaxed text-stone-200 whitespace-pre-wrap">
                      {cleanFeedback}
                    </p>
                  </div>

                  <div className="flex flex-col md:flex-row gap-8">
                    <div className={`flex-1 p-6 border ${isAccepted ? 'border-red-muted bg-red-muted/5' : 'border-stone-800 bg-stone-950'} transition-all`}>
                      <p className="text-[9px] font-mono-machine text-stone-600 uppercase tracking-widest mb-3">Spine Integrity</p>
                      <p className={`text-xl font-bold uppercase tracking-tightest ${isAccepted ? 'text-red-muted' : 'text-stone-500'}`}>
                        {isAccepted ? 'VERIFIED / STRONG' : 'FAILED / BRITTLE'}
                      </p>
                    </div>
                    <div className="flex-1 p-6 border border-stone-800 bg-stone-950">
                      <p className="text-[9px] font-mono-machine text-stone-600 uppercase tracking-widest mb-3">Linguistic Weight</p>
                      <p className="text-xl font-bold uppercase tracking-tightest text-stone-400">
                        {submission.length > 200 ? 'DENSE' : submission.length > 50 ? 'CONCISE' : 'MINIMAL'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-center items-center p-12 border border-stone-900 bg-stone-950 text-center space-y-8">
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-stone-800 flex items-center justify-center">
                    <div className={`w-4 h-4 rounded-full ${isAccepted ? 'bg-red-muted animate-pulse shadow-[0_0_15px_#8B0000]' : 'bg-stone-800'}`}></div>
                  </div>
                  <div>
                    <h4 className="font-mono-machine text-[10px] text-stone-600 uppercase tracking-[0.3em] mb-4">Official Verdict</h4>
                    <p className={`text-4xl font-extrabold tracking-tightest uppercase leading-none ${isAccepted ? 'text-red-muted' : 'text-stone-700'}`}>
                      {isAccepted ? 'ACCEPTED' : 'REJECTED'}
                    </p>
                  </div>
                  <p className="text-stone-500 font-serif-brutal italic text-sm leading-relaxed">
                    {isAccepted
                      ? "Your testimony has been immortalized in the digital bone of this project."
                      : "This fragment lacked the necessary truth to survive the curation."}
                  </p>
                </div>
              </div>

              <div className="flex justify-center pt-8">
                <button
                  onClick={() => { setFeedback(null); setSubmission(''); setAuthor(''); }}
                  className="px-12 py-4 border border-stone-800 text-stone-600 font-mono-machine hover:border-red-muted hover:text-white transition-all uppercase text-[10px] tracking-[0.4em]"
                >
                  Initiate New Protocol
                </button>
              </div>
            </div>
          )}
        </section>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-stone-900 border border-stone-900">
          {ARCHIVE_ITEMS.map((item) => (
            <div key={item.id} className="bg-black p-10 flex flex-col min-h-[400px] hover:bg-stone-950 transition-colors group">
              <span className="text-[10px] font-mono-machine text-red-muted mb-4 tracking-[0.4em] uppercase">{item.author || 'ANONYMOUS'}</span>
              {item.type === 'text' ? (
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-6 tracking-tight group-hover:text-red-muted transition-colors uppercase">{item.title}</h3>
                  <p className="text-stone-400 font-serif-brutal text-2xl italic leading-relaxed">
                    "{item.content}"
                  </p>
                </div>
              ) : (
                <div className="flex-1 flex flex-col">
                  <h3 className="text-xl font-bold mb-6 tracking-tight uppercase">{item.title}</h3>
                  <div className="flex-1 overflow-hidden border border-stone-900">
                    <img
                      src={item.content}
                      alt={item.title}
                      className="w-full h-full object-cover grayscale opacity-50 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                    />
                  </div>
                </div>
              )}
              <div className="mt-8 pt-6 border-t border-stone-900 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[9px] font-mono-machine text-stone-600 tracking-widest uppercase">Verified Presence</span>
                <div className="w-1.5 h-1.5 rounded-full bg-red-muted animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      <section className="mt-40 text-center max-w-2xl mx-auto opacity-40 hover:opacity-100 transition-opacity duration-1000">
        <div className="h-px w-24 bg-red-muted mx-auto mb-12"></div>
        <p className="text-[10px] font-mono-machine tracking-[0.4em] uppercase text-stone-500 mb-6">The Pact of the Archive</p>
        <p className="text-stone-500 italic font-serif-brutal text-xl leading-relaxed">
          Every item in this archive is a weight. Every word is a consequence. If you are here to look, be prepared to feel. If you are here to submit, be prepared to be judged by the machine and the collective conscience.
        </p>
      </section>
    </div>
  );
};

export default ResistanceArchive;