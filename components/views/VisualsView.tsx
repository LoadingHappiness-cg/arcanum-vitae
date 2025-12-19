
import React from 'react';
import { VisualItem } from '../../types';

interface VisualsViewProps {
    visuals: VisualItem[];
}

const VisualsView: React.FC<VisualsViewProps> = ({ visuals }) => {
    return (
        <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto view-transition">
            <h2 className="text-6xl md:text-[10rem] font-extrabold tracking-tightest mb-20 uppercase leading-none text-white quantum-leap">Visuals</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {visuals.map((visual, i) => (
                    <div key={visual.id} className="fade-in stagger-item group" style={{ animationDelay: `${i * 150}ms` }}>
                        <div className="relative aspect-[3/4] overflow-hidden border border-stone-900 bg-stone-950 mb-8 group-hover:border-red-600 transition-colors">
                            <img
                                src={visual.url}
                                alt={visual.title}
                                className="w-full h-full object-cover grayscale opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000"
                            />
                            <div className="absolute inset-0 bg-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                            <div className="absolute top-4 right-4 font-mono-machine text-[8px] text-red-600 tracking-widest uppercase bg-black/80 px-2 py-1 backdrop-blur-sm border border-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity">
                                FRAGMENT_ID: {visual.id}
                            </div>
                        </div>
                        <h3 className="text-2xl font-extrabold tracking-tightest uppercase mb-2 group-hover:text-red-600 transition-colors text-white">{visual.title}</h3>
                        <p className="text-stone-500 font-mono-machine text-[10px] tracking-widest uppercase mb-4">{visual.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VisualsView;
