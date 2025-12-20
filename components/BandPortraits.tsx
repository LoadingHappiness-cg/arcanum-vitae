
import React, { useState } from 'react';
// import { generateBandPortrait } from '../services/gemini';

interface Member {
  id: string;
  name: string;
  origin: string;
  function: string;
  bio: string;
  prompt: string;
}

const MEMBERS: Member[] = [
  {
    id: 'eir',
    name: 'EIR',
    origin: 'Northern Europe',
    function: 'Lead Vocalist',
    bio: 'EIR sings like someone crossing thin ice without apology. Her voice does not seduce — it declares. There is a coldness in her, an elevation, and a calm that does not negotiate principles.',
    prompt: 'Nordic female vocalist, minimalist and symbolic portrait. Pale cold light, neutral expression, eyes forward. Dark background, high contrast, no smile, no glamour. Style: fine art photography, restrained, dignified, timeless. Mood of quiet strength and moral clarity.'
  },
  {
    id: 'inigo',
    name: 'ÍÑIGO',
    origin: 'Spain',
    function: 'Guitars / Harmonic Tension',
    bio: 'ÍÑIGO plays like someone tearing veils. Each riff is confrontation, each silence is a choice. The fire is not in the volume — it is in the intent.',
    prompt: 'Spanish male guitarist, symbolic and moody portrait. Strong shadows, warm dark tones, dramatic side lighting. No visible guitar performance pose — presence over action. Expression serious, contained intensity. Cinematic, raw, human.'
  },
  {
    id: 'caio',
    name: 'CAIO',
    origin: 'Portugal',
    function: 'Bass / Foundation',
    bio: 'CAIO is the ground where everything rests. He does not seek the spotlight — he ensures weight. His sound sustains the building when everything else burns.',
    prompt: 'Portuguese male bassist, grounded and minimalist portrait. Earthy tones, low light, strong posture. Feeling of stability, gravity, restraint. No performance, no movement — presence only. Style: documentary fine art.'
  },
  {
    id: 'skadi',
    name: 'SKADI',
    origin: 'Northern Europe',
    function: 'Keys / Atmospheres',
    bio: 'SKADI works the space between sounds. She creates landscapes where silence also speaks. Her music does not push — it clears the way.',
    prompt: 'Nordic female keyboardist, abstract and atmospheric portrait. Soft cold light, layered shadows, ethereal mood. Minimalist composition, introspective presence. No visible instruments, focus on atmosphere. Dreamlike but restrained.'
  },
  {
    id: 'ayllu',
    name: 'AYLLU',
    origin: 'Chile',
    function: 'Flutes / Ancestral Memory',
    bio: 'AYLLU breathes history into the present. His music carries land, exile, and ancient resistance. It is not nostalgia — it is continuity.',
    prompt: 'Chilean flutist, symbolic portrait inspired by ancestral memory. Earth textures, wind motion, subdued natural colors. Face partially in shadow, timeless expression. Connection to land and history, not folklore. Fine art, symbolic realism.'
  },
  {
    id: 'kala',
    name: 'KĀLA',
    origin: 'India',
    function: 'Percussion / Pulse',
    bio: 'KĀLA is time in motion. Her rhythm does not accompany — it forces one forward. Complex, inevitable, alive.',
    prompt: 'Indian percussionist, powerful symbolic portrait. Sense of motion without action, layered rhythm visuals. Warm deep tones, dramatic contrast. Expression focused, intense, timeless. Abstract rhythm translated into image.'
  },
  {
    id: 'amin',
    name: 'AMIN',
    origin: 'Palestine',
    function: 'Spoken Word / Testimony',
    bio: 'AMIN does not interpret — he witnesses. His word is born of reality, not metaphor. It is the voice that cannot be softened.',
    prompt: 'Palestinian male rapper, raw symbolic portrait. Stark lighting, urban textures, serious gaze. No aggression, no victim pose — dignity and truth. Minimalist, documentary-style fine art. Presence that confronts without shouting.'
  }
];

const manifestCache: Record<string, string> = {};

const BandPortraits: React.FC = () => {
  const [activeMember, setActiveMember] = useState<Member | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const manifestMember = async (member: Member) => {
    setActiveMember(member);
    if (manifestCache[member.id]) return;

    setLoadingId(member.id);

    // Simulate decoding sequence for effect
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Use local image path
    const localUrl = `/media/images/artists/${member.id}.jpg`;
    manifestCache[member.id] = localUrl;

    setLoadingId(null);
  };

  return (
    <div className="py-20 border-t border-stone-900 view-transition relative">
      <div className="scanline-red opacity-5"></div>
      <div className="mb-12 flex justify-between items-end">
        <div>
          <h3 className="text-red-900 font-mono-machine uppercase tracking-[0.5em] text-[10px] mb-2">Manifestations</h3>
          <p className="text-2xl font-extrabold tracking-tightest uppercase text-white">THE SEVEN</p>
        </div>
        <div className="text-right max-w-xs">
          <p className="text-stone-600 font-mono-machine text-[9px] uppercase tracking-widest leading-relaxed border-r-2 border-red-900 pr-6">
            Seven human artists. Seven cultures. One shared refusal to kneel.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-start">
        <div className="space-y-4">
          {MEMBERS.map((m) => (
            <button
              key={m.id}
              onClick={() => manifestMember(m)}
              disabled={loadingId !== null}
              className={`w-full text-left p-6 border transition-all brutal-hover ${loadingId === m.id ? 'bg-black border-red-600 shadow-[0_0_10px_#FF0000]' :
                activeMember?.id === m.id ? 'bg-stone-950 border-red-900' : 'bg-transparent border-stone-900'
                }`}
            >
              <div className="quantum-leap">
                <span className="block text-red-900 font-mono-machine text-[9px] uppercase tracking-[0.4em] mb-1">
                  {m.origin} // {m.function}
                </span>
                <span className={`block text-xl font-serif-brutal transition-colors ${loadingId === m.id || activeMember?.id === m.id ? 'text-white' : 'text-stone-500 group-hover:text-stone-200'}`}>
                  {m.name}
                </span>
              </div>
              <div className="flex flex-col items-end mt-2">
                <span className={`text-red-600 font-mono-machine text-[8px] tracking-[0.5em] transition-opacity ${loadingId === m.id ? 'opacity-100' : 'opacity-0'}`}>
                  [ DECODING_PRESENCE ]
                </span>
              </div>
            </button>
          ))}

          <div className="mt-12 p-8 border border-red-900/20 bg-stone-950/20">
            <h4 className="text-red-900 font-mono-machine text-[9px] uppercase tracking-[0.4em] mb-4">Ethical Protocol</h4>
            <p className="text-stone-500 font-serif-brutal italic text-sm leading-relaxed">
              Avatars are AI-generated visual representations. They do not depict real individuals. The voices, cultures, and responsibility behind Arcanum Vitae are human.
            </p>
          </div>
        </div>

        <div className="sticky top-40 space-y-8">
          <div className={`relative aspect-square bg-black border transition-all duration-500 flex items-center justify-center overflow-hidden group ${loadingId ? 'border-red-600 shadow-[0_0_30px_#8B0000]' : 'border-stone-900'}`}>
            <div className="scanline-red opacity-10"></div>
            {activeMember && manifestCache[activeMember.id] ? (
              <div className="relative w-full h-full quantum-leap">
                <img
                  src={manifestCache[activeMember.id]}
                  alt={`${activeMember.name} Portrait`}
                  className="w-full h-full object-cover grayscale transition-all duration-[1.5s] ease-out reveal-mask group-hover:grayscale-0 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 font-mono-machine text-[8px] text-red-600 tracking-widest uppercase bg-black/80 px-2 py-1 backdrop-blur-sm border border-red-600/30">
                  ARTIFACT_ID: {activeMember.id.toUpperCase()}
                </div>
              </div>
            ) : (
              <div className="text-center p-12 stagger-item">
                <div className="w-16 h-16 border-2 border-red-950 border-dashed rounded-full mx-auto mb-8 animate-spin duration-[15s]"></div>
                <p className="font-serif-brutal text-stone-700 italic text-2xl">Select an identity to witness their presence.</p>
              </div>
            )}

            {loadingId && (
              <div className="absolute inset-0 bg-black/95 flex flex-col items-center justify-center z-10 p-12">
                <div className="w-full max-w-xs h-[1px] bg-red-950 relative mb-4">
                  <div className="loading-bar"></div>
                </div>
                <p className="font-mono-machine text-[9px] text-red-600 uppercase tracking-[0.8em] animate-pulse">
                  SYST_DECODING...
                </p>
              </div>
            )}
          </div>

          {activeMember && (
            <div className="fade-in p-8 border-l-2 border-red-600 bg-black relative overflow-hidden red-pulse-border">
              <div className="scanline-red opacity-10"></div>
              <h5 className="text-red-900 font-mono-machine text-[9px] uppercase tracking-[0.5em] mb-4">Artist Profile</h5>
              <p className="text-stone-100 font-serif-brutal italic text-2xl leading-relaxed selection:bg-red-600">
                "{activeMember.bio}"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BandPortraits;
