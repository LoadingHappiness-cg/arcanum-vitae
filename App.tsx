import React, { useState, useEffect } from 'react';

import { View, Album, WordFragment, VisualItem, FictionDeclaration, AiDeclaration, HumanIdentity, Track, LegalContent, HomeContent, AnalyticsContent } from './types';
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
  AI_DECLARATION as INITIAL_AI_DEC,
  INITIAL_LEGAL_CONTENT,
  INITIAL_HOME_CONTENT,
  INITIAL_ANALYTICS_CONTENT
} from './constants';

const isRecord = (value: unknown): value is Record<string, unknown> => (
  typeof value === 'object' && value !== null && !Array.isArray(value)
);

const isString = (value: unknown): value is string => typeof value === 'string';
const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean';

const isTrack = (value: unknown): value is Track => (
  isRecord(value) &&
  isString(value.title) &&
  isString(value.lyrics) &&
  isString(value.story) &&
  isString(value.audioUrl)
);

const isAlbum = (value: unknown): value is Album => (
  isRecord(value) &&
  isString(value.id) &&
  isString(value.title) &&
  isString(value.year) &&
  isString(value.concept) &&
  isString(value.context) &&
  isString(value.coverUrl) &&
  Array.isArray(value.tracks) &&
  value.tracks.every(isTrack) &&
  (value.isUpcoming === undefined || value.isUpcoming === null || isBoolean(value.isUpcoming))
);

const isFragment = (value: unknown): value is WordFragment => (
  isRecord(value) &&
  isString(value.id) &&
  isString(value.text) &&
  (value.source === undefined || isString(value.source))
);

const isVisual = (value: unknown): value is VisualItem => (
  isRecord(value) &&
  isString(value.id) &&
  isString(value.url) &&
  isString(value.title) &&
  isString(value.description)
);

const isDeclaration = (value: unknown): value is FictionDeclaration => (
  isRecord(value) &&
  isString(value.main) &&
  isString(value.details) &&
  isString(value.tagline)
);

const isAiDeclaration = (value: unknown): value is AiDeclaration => (
  isRecord(value) &&
  isString(value.main) &&
  Array.isArray(value.body) &&
  value.body.every(isString) &&
  isString(value.tagline)
);

const isHumanIdentity = (value: unknown): value is HumanIdentity => (
  isRecord(value) &&
  isString(value.footerQuote) &&
  isString(value.originLabel) &&
  isString(value.veritasName) &&
  isString(value.veritasLink)
);

const isLegalSection = (value: unknown) => (
  isRecord(value) &&
  isString(value.id) &&
  isString(value.title) &&
  isString(value.body) &&
  (value.list === undefined || (Array.isArray(value.list) && value.list.every(isString)))
);

const isLegalContent = (value: unknown): value is LegalContent => (
  isRecord(value) &&
  isString(value.heading) &&
  isString(value.footer) &&
  Array.isArray(value.sections) &&
  value.sections.every(isLegalSection)
);

const isHomeContent = (value: unknown): value is HomeContent => (
  isRecord(value) &&
  isString(value.galleryMessage) &&
  Array.isArray(value.galleryItems) &&
  value.galleryItems.every((item) => (
    isRecord(item) &&
    isString(item.id) &&
    isString(item.title) &&
    isString(item.manifesto)
  ))
);

const isAnalyticsContent = (value: unknown): value is AnalyticsContent => (
  isRecord(value) &&
  isRecord(value.umami) &&
  typeof value.umami.enabled === 'boolean' &&
  isString(value.umami.websiteId) &&
  isString(value.umami.srcUrl) &&
  (value.umami.domains === undefined || isString(value.umami.domains)) &&
  isRecord(value.googleAnalytics) &&
  typeof value.googleAnalytics.enabled === 'boolean' &&
  isString(value.googleAnalytics.measurementId)
);

const readLocalJson = <T,>(key: string, validator: (value: unknown) => value is T): T | null => {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (validator(parsed)) return parsed;
  } catch (error) {
    console.warn(`Invalid local cache removed for ${key}:`, error);
  }
  localStorage.removeItem(key);
  return null;
};

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
  const [legalContent, setLegalContent] = useState(INITIAL_LEGAL_CONTENT);
  const [homeContent, setHomeContent] = useState(INITIAL_HOME_CONTENT);
  const [analyticsContent, setAnalyticsContent] = useState(INITIAL_ANALYTICS_CONTENT);

  // Umami Event Tracking Utility
  const toGaEventName = (name: string) => (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, 40) || 'event'
  );

  const trackEvent = (eventName: string, data?: any) => {
    const payload = data ? { ...data } : {};
    if ((window as any).umami && typeof (window as any).umami.track === 'function') {
      (window as any).umami.track(eventName, payload);
    }
    const gtag = (window as any).gtag;
    if (typeof gtag === 'function') {
      gtag('event', toGaEventName(eventName), {
        event_label: eventName,
        ...payload,
      });
    }
  };

  const trackPageView = (view: View) => {
    const gtag = (window as any).gtag;
    if (typeof gtag !== 'function') return;
    const pagePath = `/${view}`;
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    gtag('event', 'page_view', {
      page_title: view,
      page_path: hash ? `${pagePath}${hash}` : pagePath,
      page_location: typeof window !== 'undefined' ? window.location.href : undefined,
    });
  };

  const resolveUmamiScriptUrl = () => {
    const fallback = 'https://cloud.umami.is/script.js';
    const raw = (analyticsContent.umami.srcUrl || '').trim();
    if (!raw) return fallback;
    if (raw.includes('/api/send')) {
      return raw.replace(/\/api\/send.*$/, '/script.js');
    }
    if (raw.endsWith('/')) {
      return `${raw}script.js`;
    }
    return raw;
  };

  const applyAnalyticsScripts = () => {
    if (typeof document === 'undefined') return;

    const removeById = (id: string) => {
      const existing = document.getElementById(id);
      if (existing) existing.remove();
    };

    removeById('umami-script');
    removeById('ga-script');
    removeById('ga-inline');

    if (analyticsContent.umami.enabled && analyticsContent.umami.websiteId) {
      const script = document.createElement('script');
      script.id = 'umami-script';
      script.defer = true;
      script.src = resolveUmamiScriptUrl();
      script.setAttribute('data-website-id', analyticsContent.umami.websiteId);
      if (analyticsContent.umami.domains) {
        script.setAttribute('data-domains', analyticsContent.umami.domains);
      }
      document.head.appendChild(script);
    }

    if (analyticsContent.googleAnalytics.enabled && analyticsContent.googleAnalytics.measurementId) {
      const gaScript = document.createElement('script');
      gaScript.id = 'ga-script';
      gaScript.async = true;
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsContent.googleAnalytics.measurementId}`;
      document.head.appendChild(gaScript);

      const inline = document.createElement('script');
      inline.id = 'ga-inline';
      inline.text = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${analyticsContent.googleAnalytics.measurementId}');
      `;
      document.head.appendChild(inline);
    }
  };

  const hydrateFromLocalStorage = () => {
    if (typeof window === 'undefined') return;
    try {
      const storedManifesto = localStorage.getItem('av_manifesto');
      const storedAlbums = readLocalJson<Album[]>('av_albums', (value): value is Album[] => (
        Array.isArray(value) && value.every(isAlbum)
      ));
      const storedFragments = readLocalJson<WordFragment[]>('av_fragments', (value): value is WordFragment[] => (
        Array.isArray(value) && value.every(isFragment)
      ));
      const storedVisuals = readLocalJson<VisualItem[]>('av_visuals', (value): value is VisualItem[] => (
        Array.isArray(value) && value.every(isVisual)
      ));
      const storedIdentity = readLocalJson<HumanIdentity>('av_identity', isHumanIdentity);
      const storedFiction = readLocalJson<FictionDeclaration>('av_fiction', isDeclaration);
      const storedAi = readLocalJson<AiDeclaration>('av_ai', isAiDeclaration);
      const storedLegal = readLocalJson<LegalContent>('av_legal', isLegalContent);
      const storedHome = readLocalJson<HomeContent>('av_home', isHomeContent);
      const storedAnalytics = readLocalJson<AnalyticsContent>('av_analytics', isAnalyticsContent);

      if (storedAlbums) setAlbums(storedAlbums);
      if (storedFragments) setFragments(storedFragments);
      if (storedVisuals) setVisuals(storedVisuals);
      if (storedManifesto !== null) setHumanManifesto(storedManifesto);
      if (storedIdentity) setHumanIdentity(storedIdentity);
      if (storedFiction) setFictionDec(storedFiction);
      if (storedAi) setAiDec(storedAi);
      if (storedLegal) setLegalContent(storedLegal);
      if (storedHome) setHomeContent(storedHome);
      if (storedAnalytics) setAnalyticsContent(storedAnalytics);
    } catch (error) {
      console.error('Failed to hydrate from local storage:', error);
    }
  };

  useEffect(() => {
    // Fetch persisted data from server
    fetch('/api/data')
      .then(res => res.json())
      .then(data => {
        if (data && typeof data === 'object') {
          if (Array.isArray(data.albums)) setAlbums(data.albums);
          if (Array.isArray(data.fragments)) setFragments(data.fragments);
          if (Array.isArray(data.visuals)) setVisuals(data.visuals);
          if (Object.prototype.hasOwnProperty.call(data, 'humanManifesto')) {
            setHumanManifesto(data.humanManifesto ?? '');
          }
          if (Object.prototype.hasOwnProperty.call(data, 'humanIdentity')) {
            setHumanIdentity(data.humanIdentity ?? INITIAL_HUMAN_IDENTITY);
          }
          if (Object.prototype.hasOwnProperty.call(data, 'fictionDec')) {
            setFictionDec(data.fictionDec ?? INITIAL_FICTION_DEC);
          }
          if (Object.prototype.hasOwnProperty.call(data, 'aiDec')) {
            setAiDec(data.aiDec ?? INITIAL_AI_DEC);
          }
          if (Object.prototype.hasOwnProperty.call(data, 'legalContent')) {
            setLegalContent(data.legalContent ?? INITIAL_LEGAL_CONTENT);
          }
          if (Object.prototype.hasOwnProperty.call(data, 'homeContent')) {
            setHomeContent(data.homeContent ?? INITIAL_HOME_CONTENT);
          }
          if (Object.prototype.hasOwnProperty.call(data, 'analyticsContent')) {
            setAnalyticsContent(data.analyticsContent ?? INITIAL_ANALYTICS_CONTENT);
          }
        } else {
          hydrateFromLocalStorage();
        }
      })
      .catch(err => {
        console.error("Failed to load server data:", err);
        hydrateFromLocalStorage();
      });

    // Initial loading animation - disappear when data is ready or timeout
    const timer = setTimeout(() => setIsLoading(false), 500); // Reduced delay
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  useEffect(() => {
    applyAnalyticsScripts();
  }, [analyticsContent]);

  useEffect(() => {
    trackPageView(currentView);
  }, [currentView, analyticsContent]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash || '';
    if (hash.startsWith('#track-')) {
      setCurrentView(View.MUSIC);
      setIsEntered(true);
    }
  }, []);

  const navigate = (view: View) => {
    setIsTransitioning(true);
    trackEvent('View Changed', { view });
    setTimeout(() => {
      setCurrentView(view);
      setIsTransitioning(false);
    }, 400);
  };

  const handleAdminSave = (newData: any) => {
    const updated = {
      albums: newData.albums ?? albums,
      fragments: newData.fragments ?? fragments,
      visuals: newData.visuals ?? visuals,
      humanManifesto: newData.humanManifesto ?? humanManifesto,
      humanIdentity: newData.humanIdentity ?? humanIdentity,
      fictionDec: newData.fictionDec ?? fictionDec,
      aiDec: newData.aiDec ?? aiDec,
      legalContent: newData.legalContent ?? legalContent,
      homeContent: newData.homeContent ?? homeContent,
      analyticsContent: newData.analyticsContent ?? analyticsContent,
    };

    setAlbums(updated.albums);
    setFragments(updated.fragments);
    setVisuals(updated.visuals);
    setHumanManifesto(updated.humanManifesto);
    setHumanIdentity(updated.humanIdentity);
    setFictionDec(updated.fictionDec);
    setAiDec(updated.aiDec);
    setLegalContent(updated.legalContent);
    setHomeContent(updated.homeContent);
    setAnalyticsContent(updated.analyticsContent);

    // Also keep a local backup
    localStorage.setItem('av_albums', JSON.stringify(updated.albums));
    localStorage.setItem('av_fragments', JSON.stringify(updated.fragments));
    localStorage.setItem('av_visuals', JSON.stringify(updated.visuals));
    localStorage.setItem('av_manifesto', updated.humanManifesto ?? '');
    localStorage.setItem('av_identity', JSON.stringify(updated.humanIdentity));
    localStorage.setItem('av_fiction', JSON.stringify(updated.fictionDec));
    localStorage.setItem('av_ai', JSON.stringify(updated.aiDec));
    localStorage.setItem('av_legal', JSON.stringify(updated.legalContent));
    localStorage.setItem('av_home', JSON.stringify(updated.homeContent));
    localStorage.setItem('av_analytics', JSON.stringify(updated.analyticsContent));
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
      case View.MUSIC: return <MusicView albums={albums} trackEvent={trackEvent} />;
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
      case View.LEGAL: return <LegalView legalContent={legalContent} />;
      case View.MIRROR: return <TheMirror trackEvent={trackEvent} />;
      case View.ARCHIVE: return <ResistanceArchive trackEvent={trackEvent} />;
      case View.ADMIN: return (
        <AdminDashboard
          data={{ albums, fragments, visuals, humanManifesto, humanIdentity, fictionDec, aiDec, legalContent, homeContent, analyticsContent }}
          onSave={handleAdminSave}
          onExit={() => navigate(View.HOME)}
          trackEvent={trackEvent}
        />
      );
      default: return <HomeView isEntered={isEntered} onEnter={() => setIsEntered(true)} homeContent={homeContent} />;
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
            className="text-[8px] font-mono-machine text-red-600 hover-red-glow transition-colors tracking-[1em] uppercase group"
          >
            <span className="group-hover:text-red-500 transition-colors">LEGAL</span>
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
