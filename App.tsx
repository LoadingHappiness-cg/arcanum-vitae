import React, { useState, useEffect } from 'react';

import { View, Album, WordFragment, VisualItem, FictionDeclaration, AiDeclaration, HumanIdentity } from './types';
import Navigation from './components/Navigation';
import TheMirror from './components/TheMirror';
import ResistanceArchive from './components/ResistanceArchive';
import AdminDashboard from './components/AdminDashboard';
import HomeView from './components/views/HomeView';
import MusicView from './components/views/MusicView';
import WordsView from './components/views/WordsView';
import VisualsView from './components/views/VisualsView';
import AboutView from './components/views/AboutView';
import LegalView from './components/views/LegalView';
import {
  ALBUMS as INITIAL_ALBUMS,
  FRAGMENTS as INITIAL_FRAGMENTS,
  VISUALS as INITIAL_VISUALS,
  INITIAL_HUMAN_MANIFESTO,
  INITIAL_HUMAN_IDENTITY,
  FICTION_DECLARATION as INITIAL_FICTION_DEC,
  AI_DECLARATION as INITIAL_AI_DEC
} from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [isEntered, setIsEntered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Persistent State for dynamic content
  const [albums, setAlbums] = useState<Album[]>(INITIAL_ALBUMS);
  const [fragments, setFragments] = useState<WordFragment[]>(INITIAL_FRAGMENTS);
  const [visuals, setVisuals] = useState<VisualItem[]>(INITIAL_VISUALS);
  const [humanManifesto, setHumanManifesto] = useState<string>(INITIAL_HUMAN_MANIFESTO);
  const [humanIdentity, setHumanIdentity] = useState<HumanIdentity>(INITIAL_HUMAN_IDENTITY);
  const [fictionDec, setFictionDec] = useState<FictionDeclaration>(INITIAL_FICTION_DEC);
  const [aiDec, setAiDec] = useState<AiDeclaration>(INITIAL_AI_DEC);

  useEffect(() => {
    // Fetch persisted data from server
    fetch('/api/data')
      .then(res => res.json())
      .then(data => {
        if (data) {
          if (data.albums) setAlbums(data.albums);
          if (data.fragments) setFragments(data.fragments);
          if (data.visuals) setVisuals(data.visuals);
          if (data.humanManifesto) setHumanManifesto(data.humanManifesto);
          if (data.humanIdentity) setHumanIdentity(data.humanIdentity);
          if (data.fictionDec) setFictionDec(data.fictionDec);
          if (data.aiDec) setAiDec(data.aiDec);
        }
      })
      .catch(err => console.error("Failed to load server data:", err));

    // Initial loading animation
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  const navigate = (view: View) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentView(view);
      setIsTransitioning(false);
    }, 400);
  };

  const handleAdminSave = async (newData: any) => {
    setAlbums(newData.albums);
    setFragments(newData.fragments);
    setVisuals(newData.visuals);
    setHumanManifesto(newData.humanManifesto);
    setHumanIdentity(newData.humanIdentity);
    setFictionDec(newData.fictionDec);
    setAiDec(newData.aiDec);

    // Save to server
    try {
      await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newData),
      });
      // Also keep a local backup
      localStorage.setItem('av_albums', JSON.stringify(newData.albums));
      localStorage.setItem('av_fragments', JSON.stringify(newData.fragments));
      localStorage.setItem('av_visuals', JSON.stringify(newData.visuals));
      localStorage.setItem('av_manifesto', newData.humanManifesto);
      localStorage.setItem('av_identity', JSON.stringify(newData.humanIdentity));
      localStorage.setItem('av_fiction', JSON.stringify(newData.fictionDec));
      localStorage.setItem('av_ai', JSON.stringify(newData.aiDec));
    } catch (err) {
      console.error("Failed to save to server:", err);
    }
  };


  const renderContent = () => {
    if (isTransitioning) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black">
          <div className="w-32 h-[1px] bg-red-600 animate-pulse mb-4"></div>
          <span className="font-mono-machine text-[8px] text-red-900 tracking-[0.5em] uppercase animate-pulse">
            CALIBRATING_REALITY...
          </span>
        </div>
      );
    }

    switch (currentView) {
      case View.MUSIC: return <MusicView albums={albums} />;
      case View.WORDS: return <WordsView fragments={fragments} />;
      case View.VISUALS: return <VisualsView visuals={visuals} />;
      case View.ABOUT: return (
        <AboutView
          humanManifesto={humanManifesto}
          humanIdentity={humanIdentity}
          fictionDec={fictionDec}
          aiDec={aiDec}
        />
      );
      case View.LEGAL: return <LegalView />;
      // case View.MIRROR: return <TheMirror />; // Disabled
      case View.ARCHIVE: return <ResistanceArchive />;
      case View.ADMIN: return (
        <AdminDashboard
          data={{ albums, fragments, visuals, humanManifesto, humanIdentity, fictionDec, aiDec }}
          onSave={handleAdminSave}
          onExit={() => navigate(View.HOME)}
        />
      );
      default: return <HomeView isEntered={isEntered} onEnter={() => setIsEntered(true)} />;
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black z-[1000] flex flex-col items-center justify-center p-6">
        <div className="scanline-red opacity-20"></div>
        <div className="w-full max-w-xs relative">
          <div className="h-[1px] w-full bg-stone-900 mb-4 overflow-hidden relative">
            <div className="absolute top-0 left-0 h-full bg-red-600 loading-bar"></div>
          </div>
          <div className="flex justify-between items-center font-mono-machine text-[8px] uppercase tracking-[0.3em] text-stone-500">
            <span>[ SYSTEM_INIT ]</span>
            <span className="text-red-600">ARCANUM_VITAE</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="relative selection:bg-red-600 selection:text-white bg-black min-h-screen">
      <div className="fixed inset-0 pointer-events-none opacity-[0.06] grain-overlay z-[100]"></div>

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[-1]">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(139,0,0,0.1)_0%,transparent_50%)]"></div>
      </div>

      {currentView !== View.ADMIN && <Navigation currentView={currentView} onNavigate={navigate} />}

      <div className="fixed inset-0 pointer-events-none brutal-grid z-0"></div>

      <div className="relative z-10">
        {renderContent()}
      </div>

      {/* Subtle Admin & Legal Footer */}
      {currentView !== View.ADMIN && (
        <footer className="py-20 px-6 text-center space-x-8">
          <button
            onClick={() => navigate(View.LEGAL)}
            className="text-[8px] font-mono-machine text-stone-900 hover:text-stone-700 transition-colors tracking-[1em] uppercase group"
          >
            <span className="group-hover:text-red-900 transition-colors">LEGAL</span>
          </button>

          <button
            onClick={() => navigate(View.ADMIN)}
            className="text-[8px] font-mono-machine text-stone-900 hover:text-stone-700 transition-colors tracking-[1em] uppercase group"
          >
            <span className="group-hover:text-red-900 transition-colors">[ ADMIN_CRYPT ]</span>
          </button>
        </footer>
      )}
    </main>
  );
};

export default App;
