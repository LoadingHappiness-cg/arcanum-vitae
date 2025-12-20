
import React, { useState, useEffect } from 'react';
import { Album, WordFragment, VisualItem, View, FictionDeclaration, AiDeclaration, HumanIdentity, LegalContent, HomeContent } from '../types';
import { AI_DECLARATION, FICTION_DECLARATION, INITIAL_HUMAN_IDENTITY, INITIAL_HUMAN_MANIFESTO, INITIAL_LEGAL_CONTENT, INITIAL_HOME_CONTENT } from '../constants';

interface AdminDashboardProps {
  data: {
    albums: Album[];
    fragments: WordFragment[];
    visuals: VisualItem[];
    humanManifesto?: string;
    humanIdentity?: HumanIdentity;
    fictionDec?: FictionDeclaration;
    aiDec?: AiDeclaration;
    legalContent?: LegalContent;
    homeContent?: HomeContent;
  };
  onSave: (newData: any) => void;
  onExit: () => void;
}

const normalizeData = (input: AdminDashboardProps['data']) => ({
  ...input,
  humanManifesto: input.humanManifesto ?? INITIAL_HUMAN_MANIFESTO,
  humanIdentity: { ...INITIAL_HUMAN_IDENTITY, ...(input.humanIdentity ?? {}) },
  fictionDec: { ...FICTION_DECLARATION, ...(input.fictionDec ?? {}) },
  aiDec: { ...AI_DECLARATION, ...(input.aiDec ?? {}) },
  legalContent: input.legalContent ?? INITIAL_LEGAL_CONTENT,
  homeContent: input.homeContent ?? INITIAL_HOME_CONTENT
});

const AdminDashboard: React.FC<AdminDashboardProps> = ({ data, onSave, onExit }) => {
  const [authToken, setAuthToken] = useState(() => {
    if (typeof window === 'undefined') return '';
    return sessionStorage.getItem('av_admin_token') || '';
  });
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(authToken));
  const [passkey, setPasskey] = useState('');
  const [activeTab, setActiveTab] = useState<'SOUNDS' | 'WORDS' | 'VISUALS' | 'ABOUT' | 'HOME' | 'LEGAL' | 'SYSTEM'>('SOUNDS');
  const [localData, setLocalData] = useState(() => normalizeData(data));
  const [nodeInfo, setNodeInfo] = useState({
    identifier: 'AV-NODE-01',
    uptime: '00:00:00',
    platform: 'Proxmox Virtual Environment',
    status: 'ACTIVE'
  });

  const [browserSelection, setBrowserSelection] = useState<{ type: 'audio' | 'image', ai: number, ti?: number, vi?: number } | null>(null);
  const [availableFiles, setAvailableFiles] = useState<{ name: string, url: string }[]>([]);

  const clearAuth = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('av_admin_token');
    }
    setAuthToken('');
    setIsAuthenticated(false);
  };

  const authFetch = async (input: RequestInfo | URL, init: RequestInit = {}) => {
    if (!authToken) {
      clearAuth();
      throw new Error('MISSING_AUTH');
    }
    const headers = new Headers(init.headers);
    headers.set('Authorization', `Bearer ${authToken}`);
    const response = await fetch(input, { ...init, headers });
    if (response.status === 401) {
      clearAuth();
      throw new Error('UNAUTHORIZED');
    }
    return response;
  };

  useEffect(() => {
    if (isAuthenticated) {
      const interval = setInterval(() => {
        // Simple uptime simulator
        const now = new Date();
        setNodeInfo(prev => ({ ...prev, uptime: now.toLocaleTimeString() }));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!authToken) return;
    authFetch('/api/auth/verify')
      .then(() => setIsAuthenticated(true))
      .catch(() => {
        clearAuth();
      });
  }, [authToken]);

  const openFileBrowser = async (type: 'audio' | 'image', ai: number, ti?: number, vi?: number) => {
    setBrowserSelection({ type, ai, ti, vi });
    try {
      const res = await authFetch(`/api/files/list?type=${type}`);
      if (!res.ok) {
        throw new Error('FILE_LIST_FAILED');
      }
      const files = await res.json();
      setAvailableFiles(files);
    } catch (err) {
      console.error("Failed to fetch files:", err);
      alert('ACCESS_DENIED: AUTH_REQUIRED');
    }
  };

  const selectFile = (url: string) => {
    if (!browserSelection) return;
    const { type, ai, ti, vi } = browserSelection;

    if (type === 'audio' && ai !== undefined && ti !== undefined) {
      const newAlbums = [...localData.albums];
      newAlbums[ai].tracks[ti].audioUrl = url;
      setLocalData({ ...localData, albums: newAlbums });
    } else if (type === 'image' && vi !== undefined) {
      const newVisuals = [...localData.visuals];
      newVisuals[vi].url = url;
      setLocalData({ ...localData, visuals: newVisuals });
    } else if (type === 'image' && ai !== undefined && ti === undefined) {
      const newAlbums = [...localData.albums];
      newAlbums[ai].coverUrl = url;
      setLocalData({ ...localData, albums: newAlbums });
    }

    setBrowserSelection(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passkey })
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok || !payload.token) {
        throw new Error(payload.error || 'INVALID_MANIFEST_KEY');
      }
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('av_admin_token', payload.token);
      }
      setAuthToken(payload.token);
      setIsAuthenticated(true);
      setPasskey('');
    } catch (error) {
      console.error('Admin auth failed:', error);
      alert('ACCESS_DENIED: INVALID_MANIFEST_KEY');
    }
  };

  const handleSave = async () => {
    try {
      const res = await authFetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(localData),
      });
      if (!res.ok) {
        throw new Error('SAVE_FAILED');
      }
      onSave(localData);
      alert('MANIFEST_UPDATED: CHANGES_COMMITTED_TO_BONE');
    } catch (error) {
      console.error('Save failed:', error);
      alert('SAVE_FAILED: AUTH_OR_SERVER_ERROR');
    }
  };

  const handleExit = () => {
    clearAuth();
    onExit();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-6">
        <div className="max-w-md w-full border border-red-900 p-12 relative overflow-hidden bg-stone-950">
          <div className="scanline-red opacity-20"></div>
          <div className="relative z-10 text-center">
            <h2 className="text-red-600 font-mono-machine text-[10px] tracking-[0.8em] uppercase mb-12 animate-pulse">
              [ SYSTEM_ACCESS_PROTOCOL ]
            </h2>
            <form onSubmit={handleLogin} className="space-y-8">
              <input
                type="password"
                placeholder="ENTER_SECRET_KEY"
                className="w-full bg-black border-b border-stone-800 p-4 text-center text-red-600 font-mono-machine tracking-[0.5em] focus:outline-none focus:border-red-600 transition-colors placeholder:text-stone-900"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
              />
              <button
                type="submit"
                className="w-full py-4 border border-red-900 text-red-900 hover:border-red-600 hover:text-red-600 transition-all font-syne font-bold text-[10px] tracking-widest uppercase brutal-hover"
              >
                AUTHORIZE
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 md:pt-40 pb-20 px-6 max-w-7xl mx-auto flex flex-col view-transition">
      <div className="scanline-red opacity-10"></div>

      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-8 mb-16 md:mb-20">
        <div>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tightest uppercase text-white mb-4">COMMAND_CENTER</h2>
          <div className="flex flex-wrap gap-4">
            {['SOUNDS', 'WORDS', 'VISUALS', 'ABOUT', 'HOME', 'LEGAL', 'SYSTEM'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`text-[10px] font-mono-machine tracking-widest px-4 py-1 border transition-all ${activeTab === tab ? 'bg-red-600 border-red-600 text-black' : 'border-stone-800 text-stone-600 hover:text-white'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleSave}
            className="px-8 py-3 bg-red-600 text-black font-syne font-bold text-[10px] tracking-widest uppercase brutal-hover red-pulse-border"
          >
            COMMIT CHANGES
          </button>
          <button
            onClick={handleExit}
            className="px-8 py-3 border border-stone-800 text-stone-600 font-syne font-bold text-[10px] tracking-widest uppercase hover:text-white hover:border-white transition-all"
          >
            DISCONNECT
          </button>
        </div>
      </div>

      <div className="flex-1 bg-stone-950/30 border border-stone-900 p-8 md:p-12 overflow-y-auto max-h-[70vh]">
        {activeTab === 'SYSTEM' && (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 border border-red-900/20 bg-black/40">
                <h3 className="text-red-900 font-mono-machine text-[10px] tracking-widest uppercase mb-6">DEPLOYMENT_STATUS</h3>
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-stone-900 pb-2">
                    <span className="text-stone-600 font-mono-machine text-[9px] uppercase">Node Identifier</span>
                    <span className="text-stone-200 font-mono-machine text-[9px]">{nodeInfo.identifier}</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-900 pb-2">
                    <span className="text-stone-600 font-mono-machine text-[9px] uppercase">Infrastructure</span>
                    <span className="text-stone-200 font-mono-machine text-[9px]">{nodeInfo.platform}</span>
                  </div>
                  <div className="flex justify-between border-b border-stone-900 pb-2">
                    <span className="text-stone-600 font-mono-machine text-[9px] uppercase">Node Time</span>
                    <span className="text-red-600 font-mono-machine text-[9px]">{nodeInfo.uptime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-600 font-mono-machine text-[9px] uppercase">API Status</span>
                    <span className="text-green-600 font-mono-machine text-[9px] tracking-widest">CONNECTED</span>
                  </div>
                </div>
              </div>
              <div className="p-8 border border-stone-800 bg-black/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-12 h-12 border-2 border-red-900 border-dashed rounded-full mx-auto mb-6 animate-spin duration-[20s]"></div>
                  <p className="text-stone-700 font-mono-machine text-[8px] uppercase tracking-[0.4em]">Node is healthy.<br />Resistance is live.</p>
                </div>
              </div>
            </div>
            <div className="p-8 border border-stone-900">
              <h3 className="text-stone-600 font-mono-machine text-[10px] tracking-widest uppercase mb-4">Self-Hosting Instructions</h3>
              <p className="text-stone-500 font-mono-machine text-[9px] leading-relaxed uppercase">
                1. Clone repository to LXC container.<br />
                2. Run `docker build -t arcanum-vitae .`<br />
                3. Deploy using `docker run -d -p 80:80 arcanum-vitae`<br />
                4. Map internal IP to your reverse proxy on port 80.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'ABOUT' && (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 border border-red-900/20 bg-black/40 space-y-4">
                <h3 className="text-red-900 font-mono-machine text-[10px] tracking-widest uppercase mb-6">AI_DECLARATION</h3>
                <input
                  className="w-full bg-black border border-stone-800 p-4 text-stone-300 font-mono-machine text-[10px] uppercase"
                  value={localData.aiDec?.main || ''}
                  onChange={(e) => setLocalData({
                    ...localData,
                    aiDec: { ...localData.aiDec!, main: e.target.value }
                  })}
                  placeholder="MAIN_HEADER"
                />
                <textarea
                  className="w-full h-40 bg-black border border-stone-800 p-4 text-stone-400 font-serif-brutal italic text-sm"
                  value={localData.aiDec?.body.join('\n') || ''}
                  onChange={(e) => setLocalData({
                    ...localData,
                    aiDec: { ...localData.aiDec!, body: e.target.value.split('\n') }
                  })}
                  placeholder="BODY_PARAGRAPHS (ONE PER LINE)"
                />
              </div>

              <div className="p-8 border border-stone-800 bg-black/20 space-y-4">
                <h3 className="text-stone-600 font-mono-machine text-[10px] tracking-widest uppercase mb-6">FICTION_DECLARATION</h3>
                <input
                  className="w-full bg-black border border-stone-800 p-4 text-stone-300 font-mono-machine text-[10px] uppercase"
                  value={localData.fictionDec?.details || ''}
                  onChange={(e) => setLocalData({
                    ...localData,
                    fictionDec: { ...localData.fictionDec!, details: e.target.value }
                  })}
                  placeholder="DETAILS (ONTOLOGICAL_STATUS)"
                />
                <input
                  className="w-full bg-black border border-stone-800 p-4 text-stone-500 font-mono-machine text-[10px] uppercase tracking-widest"
                  value={localData.fictionDec?.main || ''}
                  onChange={(e) => setLocalData({
                    ...localData,
                    fictionDec: { ...localData.fictionDec!, main: e.target.value }
                  })}
                  placeholder="MAIN_STATEMENT"
                />
              </div>
            </div>

            <div className="p-8 border border-red-900/20 bg-black/40 space-y-4">
              <h3 className="text-red-900 font-mono-machine text-[10px] tracking-widest uppercase mb-6">HUMAN_MANIFESTO_SOURCE</h3>
              <textarea
                className="w-full h-[600px] bg-black border border-stone-800 p-6 font-serif-brutal text-stone-300 italic text-lg leading-relaxed focus:outline-none focus:border-red-900 resize-none whitespace-pre-wrap"
                value={localData.humanManifesto || ''}
                onChange={(e) => {
                  setLocalData({ ...localData, humanManifesto: e.target.value });
                }}
                placeholder="Enter personal manifesto here..."
              />
              <p className="text-stone-600 font-mono-machine text-[9px] uppercase tracking-widest text-right">
                [ THIS CONTENT APPEARS AT THE BOTTOM OF THE ABOUT PAGE ]
              </p>
            </div>

            <div className="p-8 border border-stone-800 bg-black/20 space-y-4">
              <h3 className="text-stone-600 font-mono-machine text-[10px] tracking-widest uppercase mb-6">HUMAN_IDENTITY (FOOTER)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  className="w-full bg-black border border-stone-800 p-4 text-stone-500 font-mono-machine text-[10px] uppercase tracking-widest"
                  value={localData.humanIdentity?.footerQuote || ''}
                  onChange={(e) => setLocalData({
                    ...localData,
                    humanIdentity: { ...localData.humanIdentity!, footerQuote: e.target.value }
                  })}
                  placeholder="FOOTER_QUOTE"
                />
                <input
                  className="w-full bg-black border border-stone-800 p-4 text-stone-500 font-mono-machine text-[10px] uppercase tracking-widest"
                  value={localData.humanIdentity?.originLabel || ''}
                  onChange={(e) => setLocalData({
                    ...localData,
                    humanIdentity: { ...localData.humanIdentity!, originLabel: e.target.value }
                  })}
                  placeholder="ORIGIN_LABEL"
                />
                <input
                  className="w-full bg-black border border-stone-800 p-4 text-stone-300 font-syne font-bold uppercase"
                  value={localData.humanIdentity?.veritasName || ''}
                  onChange={(e) => setLocalData({
                    ...localData,
                    humanIdentity: { ...localData.humanIdentity!, veritasName: e.target.value }
                  })}
                  placeholder="VERITAS_NAME"
                />
                <input
                  className="w-full bg-black border border-stone-800 p-4 text-stone-500 font-mono-machine text-[10px]"
                  value={localData.humanIdentity?.veritasLink || ''}
                  onChange={(e) => setLocalData({
                    ...localData,
                    humanIdentity: { ...localData.humanIdentity!, veritasLink: e.target.value }
                  })}
                  placeholder="LINK_URL"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'HOME' && localData.homeContent && (
          <div className="space-y-12">
            <div className="p-8 border border-stone-900 bg-black/40 space-y-4">
              <h3 className="text-stone-600 font-mono-machine text-[10px] tracking-widest uppercase mb-4">HOME_GALLERY_MESSAGE</h3>
              <textarea
                className="w-full h-40 bg-black border border-stone-800 p-4 text-stone-400 font-mono-machine text-[10px] uppercase leading-relaxed whitespace-pre-wrap"
                value={localData.homeContent.galleryMessage}
                onChange={(e) => setLocalData({
                  ...localData,
                  homeContent: { ...localData.homeContent!, galleryMessage: e.target.value }
                })}
                placeholder="GALLERY_MESSAGE (ONE LINE PER ROW)"
              />
            </div>
            <div className="space-y-8">
              {localData.homeContent.galleryItems.map((item, i) => (
                <div key={item.id} className="p-8 border border-stone-900 bg-black/30 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-red-900 font-mono-machine text-[10px] uppercase tracking-widest">RELIC_{String(i + 1).padStart(2, '0')}</span>
                    <button
                      onClick={() => {
                        const nextItems = localData.homeContent!.galleryItems.filter((_, idx) => idx !== i);
                        setLocalData({
                          ...localData,
                          homeContent: { ...localData.homeContent!, galleryItems: nextItems }
                        });
                      }}
                      className="text-red-600 font-mono-machine text-[10px] hover:underline"
                    >
                      [ DELETE ]
                    </button>
                  </div>
                  <input
                    className="w-full bg-black border border-stone-800 p-3 text-stone-300 font-mono-machine text-[10px] uppercase tracking-widest"
                    value={item.id}
                    onChange={(e) => {
                      const nextItems = [...localData.homeContent!.galleryItems];
                      nextItems[i] = { ...nextItems[i], id: e.target.value };
                      setLocalData({
                        ...localData,
                        homeContent: { ...localData.homeContent!, galleryItems: nextItems }
                      });
                    }}
                    placeholder="IMAGE_ID (FILENAME WITHOUT .JPG)"
                  />
                  <input
                    className="w-full bg-black border border-stone-800 p-3 text-stone-500 font-mono-machine text-[10px] uppercase tracking-widest"
                    value={item.title}
                    onChange={(e) => {
                      const nextItems = [...localData.homeContent!.galleryItems];
                      nextItems[i] = { ...nextItems[i], title: e.target.value };
                      setLocalData({
                        ...localData,
                        homeContent: { ...localData.homeContent!, galleryItems: nextItems }
                      });
                    }}
                    placeholder="RELIC_TITLE"
                  />
                  <textarea
                    className="w-full h-24 bg-black border border-stone-800 p-4 text-stone-400 font-serif-brutal italic text-sm leading-relaxed"
                    value={item.manifesto}
                    onChange={(e) => {
                      const nextItems = [...localData.homeContent!.galleryItems];
                      nextItems[i] = { ...nextItems[i], manifesto: e.target.value };
                      setLocalData({
                        ...localData,
                        homeContent: { ...localData.homeContent!, galleryItems: nextItems }
                      });
                    }}
                    placeholder="MANIFESTO_LINE"
                  />
                </div>
              ))}
              <button
                onClick={() => {
                  const nextItems = [
                    ...localData.homeContent!.galleryItems,
                    { id: `manifest-${Date.now()}`, title: 'RELIC_NEW', manifesto: 'NEW_MANIFESTO' }
                  ];
                  setLocalData({
                    ...localData,
                    homeContent: { ...localData.homeContent!, galleryItems: nextItems }
                  });
                }}
                className="w-full py-6 border-2 border-dashed border-stone-900 text-stone-700 font-mono-machine uppercase tracking-[0.5em] hover:text-red-900 hover:border-red-900 transition-all"
              >
                + APPEND_RELIC
              </button>
            </div>
          </div>
        )}

        {activeTab === 'LEGAL' && localData.legalContent && (
          <div className="space-y-12">
            <div className="p-8 border border-stone-900 bg-black/40 space-y-4">
              <h3 className="text-stone-600 font-mono-machine text-[10px] tracking-widest uppercase mb-4">LEGAL_HEADER</h3>
              <input
                className="w-full bg-black border border-stone-800 p-4 text-stone-300 font-mono-machine text-[10px] uppercase tracking-widest"
                value={localData.legalContent.heading}
                onChange={(e) => setLocalData({
                  ...localData,
                  legalContent: { ...localData.legalContent!, heading: e.target.value }
                })}
                placeholder="LEGAL_PAGE_HEADING"
              />
              <input
                className="w-full bg-black border border-stone-800 p-4 text-stone-500 font-mono-machine text-[10px] uppercase tracking-widest"
                value={localData.legalContent.footer}
                onChange={(e) => setLocalData({
                  ...localData,
                  legalContent: { ...localData.legalContent!, footer: e.target.value }
                })}
                placeholder="FOOTER_LABEL"
              />
            </div>

            <div className="space-y-8">
              {localData.legalContent.sections.map((section, i) => (
                <div key={section.id} className="p-8 border border-stone-900 bg-black/30 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-red-900 font-mono-machine text-[10px] uppercase tracking-widest">SECTION_{i + 1}</span>
                    <button
                      onClick={() => {
                        const nextSections = localData.legalContent!.sections.filter((_, idx) => idx !== i);
                        setLocalData({
                          ...localData,
                          legalContent: { ...localData.legalContent!, sections: nextSections }
                        });
                      }}
                      className="text-red-600 font-mono-machine text-[10px] hover:underline"
                    >
                      [ DELETE ]
                    </button>
                  </div>
                  <input
                    className="w-full bg-black border border-stone-800 p-3 text-stone-300 font-mono-machine text-[10px] uppercase tracking-widest"
                    value={section.title}
                    onChange={(e) => {
                      const nextSections = [...localData.legalContent!.sections];
                      nextSections[i] = { ...nextSections[i], title: e.target.value };
                      setLocalData({
                        ...localData,
                        legalContent: { ...localData.legalContent!, sections: nextSections }
                      });
                    }}
                    placeholder="SECTION_TITLE"
                  />
                  <textarea
                    className="w-full h-40 bg-black border border-stone-800 p-4 text-stone-400 font-mono-machine text-[10px] uppercase leading-relaxed whitespace-pre-wrap"
                    value={section.body}
                    onChange={(e) => {
                      const nextSections = [...localData.legalContent!.sections];
                      nextSections[i] = { ...nextSections[i], body: e.target.value };
                      setLocalData({
                        ...localData,
                        legalContent: { ...localData.legalContent!, sections: nextSections }
                      });
                    }}
                    placeholder="SECTION_BODY (LINE BREAKS OK)"
                  />
                  <textarea
                    className="w-full h-28 bg-black border border-stone-800 p-4 text-stone-500 font-mono-machine text-[10px] uppercase leading-relaxed whitespace-pre-wrap"
                    value={(section.list || []).join('\n')}
                    onChange={(e) => {
                      const nextSections = [...localData.legalContent!.sections];
                      const listValue = e.target.value.trim();
                      nextSections[i] = {
                        ...nextSections[i],
                        list: listValue ? listValue.split('\n') : []
                      };
                      setLocalData({
                        ...localData,
                        legalContent: { ...localData.legalContent!, sections: nextSections }
                      });
                    }}
                    placeholder="OPTIONAL_LIST_ITEMS (ONE PER LINE)"
                  />
                </div>
              ))}
              <button
                onClick={() => {
                  const nextSections = [
                    ...localData.legalContent!.sections,
                    {
                      id: `legal-${Date.now()}`,
                      title: '[ NEW_SECTION ]',
                      body: 'NEW_BODY',
                      list: []
                    }
                  ];
                  setLocalData({
                    ...localData,
                    legalContent: { ...localData.legalContent!, sections: nextSections }
                  });
                }}
                className="w-full py-6 border-2 border-dashed border-stone-900 text-stone-700 font-mono-machine uppercase tracking-[0.5em] hover:text-red-900 hover:border-red-900 transition-all"
              >
                + APPEND_SECTION
              </button>
            </div>
          </div>
        )}

        {activeTab === 'WORDS' && (
          <div className="space-y-12">
            {localData.fragments.map((frag, i) => (
              <div key={frag.id} className="p-8 border border-stone-900 space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-red-900 font-mono-machine text-[10px]">FRAGMENT_ID: {frag.id}</span>
                  <button
                    onClick={() => {
                      const newFrags = localData.fragments.filter((_, idx) => idx !== i);
                      setLocalData({ ...localData, fragments: newFrags });
                    }}
                    className="text-red-600 font-mono-machine text-[10px] hover:underline"
                  >
                    [ DELETE ]
                  </button>
                </div>
                <textarea
                  className="w-full bg-black border border-stone-800 p-4 font-serif-brutal italic text-xl text-stone-300 focus:outline-none focus:border-red-900"
                  value={frag.text}
                  onChange={(e) => {
                    const newFrags = [...localData.fragments];
                    newFrags[i].text = e.target.value;
                    setLocalData({ ...localData, fragments: newFrags });
                  }}
                />
                <input
                  className="w-full bg-black border border-stone-800 p-2 font-mono-machine text-[10px] text-stone-500 uppercase focus:outline-none"
                  value={frag.source || ''}
                  placeholder="SOURCE"
                  onChange={(e) => {
                    const newFrags = [...localData.fragments];
                    newFrags[i].source = e.target.value;
                    setLocalData({ ...localData, fragments: newFrags });
                  }}
                />
              </div>
            ))}
            <button
              onClick={() => {
                setLocalData({
                  ...localData,
                  fragments: [...localData.fragments, { id: `f${Date.now()}`, text: 'New Fragment' }]
                });
              }}
              className="w-full py-8 border-2 border-dashed border-stone-900 text-stone-700 font-mono-machine uppercase tracking-[0.5em] hover:text-red-900 hover:border-red-900 transition-all"
            >
              + APPEND_NEW_FRAGMENT
            </button>
          </div>
        )}

        {activeTab === 'VISUALS' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {localData.visuals.map((vis, i) => (
              <div key={vis.id} className="p-8 border border-stone-900 space-y-4 bg-black/40">
                <div className="flex justify-between items-center">
                  <span className="text-red-900 font-mono-machine text-[10px]">VISUAL_ID: {vis.id}</span>
                  <button
                    onClick={() => {
                      const newVis = localData.visuals.filter((_, idx) => idx !== i);
                      setLocalData({ ...localData, visuals: newVis });
                    }}
                    className="text-red-600 font-mono-machine text-[10px] hover:underline"
                  >
                    [ DELETE ]
                  </button>
                </div>
                <div className="flex gap-2">
                  <input
                    className="flex-1 bg-black border border-stone-800 p-2 font-mono-machine text-[10px] text-stone-300"
                    value={vis.url}
                    onChange={(e) => {
                      const newVis = [...localData.visuals];
                      newVis[i].url = e.target.value;
                      setLocalData({ ...localData, visuals: newVis });
                    }}
                    placeholder="IMAGE_URL"
                  />
                  <button
                    onClick={() => openFileBrowser('image', 0, undefined, i)}
                    className="px-3 bg-stone-900 text-[8px] font-mono-machine text-stone-500 hover:text-white"
                  >
                    BROWSE
                  </button>
                </div>
                <input
                  className="w-full bg-black border border-stone-800 p-2 font-syne font-bold uppercase text-white"
                  value={vis.title}
                  onChange={(e) => {
                    const newVis = [...localData.visuals];
                    newVis[i].title = e.target.value;
                    setLocalData({ ...localData, visuals: newVis });
                  }}
                  placeholder="TITLE"
                />
                <textarea
                  className="w-full bg-black border border-stone-800 p-4 font-mono-machine text-[10px] text-stone-500 uppercase"
                  value={vis.description}
                  onChange={(e) => {
                    const newVis = [...localData.visuals];
                    newVis[i].description = e.target.value;
                    setLocalData({ ...localData, visuals: newVis });
                  }}
                  placeholder="DESCRIPTION"
                />
              </div>
            ))}
            <button
              onClick={() => {
                setLocalData({
                  ...localData,
                  visuals: [...localData.visuals, { id: `v${Date.now()}`, url: '', title: 'NEW_VISUAL', description: 'NEW_DESC' }]
                });
              }}
              className="border-2 border-dashed border-stone-900 aspect-square flex items-center justify-center text-stone-700 font-mono-machine uppercase tracking-[0.5em] hover:text-red-900 hover:border-red-900 transition-all"
            >
              + APPEND_VISUAL
            </button>
          </div>
        )}

        {activeTab === 'SOUNDS' && (
          <div className="space-y-20">
            {localData.albums.map((album, ai) => (
              <div key={album.id} className="border border-red-900/20 p-8 md:p-12 space-y-8 bg-black/20">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-extrabold uppercase text-white">ALBUM: {album.title}</h3>
                  <button
                    className="text-red-600 font-mono-machine text-[10px] hover:underline"
                    onClick={() => {
                      const newAlbums = localData.albums.filter((_, idx) => idx !== ai);
                      setLocalData({ ...localData, albums: newAlbums });
                    }}
                  >
                    [ PURGE_ALBUM ]
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <input
                    className="w-full bg-black border border-stone-800 p-4 font-syne font-bold uppercase text-white"
                    value={album.title}
                    onChange={(e) => {
                      const newAlbums = [...localData.albums];
                      newAlbums[ai].title = e.target.value;
                      setLocalData({ ...localData, albums: newAlbums });
                    }}
                    placeholder="ALBUM_TITLE"
                  />
                  <div className="flex gap-2">
                    <input
                      className="flex-1 bg-black border border-stone-800 p-4 font-mono-machine text-stone-300"
                      value={album.coverUrl}
                      onChange={(e) => {
                        const newAlbums = [...localData.albums];
                        newAlbums[ai].coverUrl = e.target.value;
                        setLocalData({ ...localData, albums: newAlbums });
                      }}
                      placeholder="ALBUM_COVER_URL"
                    />
                    <button
                      onClick={() => openFileBrowser('image', ai)}
                      className="px-4 bg-stone-900 text-[10px] font-mono-machine text-stone-500 hover:text-white"
                    >
                      BROWSE
                    </button>
                    <input
                      className="w-32 bg-black border border-stone-800 p-4 font-mono-machine text-stone-300"
                      value={album.year}
                      onChange={(e) => {
                        const newAlbums = [...localData.albums];
                        newAlbums[ai].year = e.target.value;
                        setLocalData({ ...localData, albums: newAlbums });
                      }}
                      placeholder="YEAR"
                    />
                  </div>
                </div>
                <textarea
                  className="w-full h-40 bg-black border border-stone-800 p-4 font-serif-brutal text-stone-400 italic"
                  value={album.concept}
                  onChange={(e) => {
                    const newAlbums = [...localData.albums];
                    newAlbums[ai].concept = e.target.value;
                    setLocalData({ ...localData, albums: newAlbums });
                  }}
                  placeholder="ALBUM_CONCEPT"
                />

                <div className="space-y-8 pt-8 border-t border-stone-900">
                  <h4 className="text-[10px] font-mono-machine tracking-[0.4em] text-red-900 uppercase">TRACKLIST_DATA</h4>
                  {album.tracks.map((track, ti) => (
                    <div key={ti} className="p-6 border border-stone-900 space-y-4">
                      <div className="flex justify-between">
                        <input
                          className="bg-transparent font-bold text-stone-200 border-b border-stone-800 focus:outline-none uppercase"
                          value={track.title}
                          onChange={(e) => {
                            const newAlbums = [...localData.albums];
                            newAlbums[ai].tracks[ti].title = e.target.value;
                            setLocalData({ ...localData, albums: newAlbums });
                          }}
                        />
                        <button
                          onClick={() => {
                            const newAlbums = [...localData.albums];
                            newAlbums[ai].tracks = newAlbums[ai].tracks.filter((_, idx) => idx !== ti);
                            setLocalData({ ...localData, albums: newAlbums });
                          }}
                          className="text-red-900 text-[8px] font-mono-machine hover:text-red-600"
                        >
                          [ DROP_TRACK ]
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <input
                          className="flex-1 bg-black border border-stone-800 p-2 text-[10px] text-stone-500 font-mono-machine"
                          value={track.audioUrl}
                          onChange={(e) => {
                            const newAlbums = [...localData.albums];
                            newAlbums[ai].tracks[ti].audioUrl = e.target.value;
                            setLocalData({ ...localData, albums: newAlbums });
                          }}
                          placeholder="AUDIO_URL"
                        />
                        <button
                          onClick={() => openFileBrowser('audio', ai, ti)}
                          className="px-4 border border-stone-800 text-[10px] font-mono-machine text-red-600 hover:bg-red-600 hover:text-black transition-colors"
                        >
                          [ BROWSE ]
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <textarea
                          className="w-full h-32 bg-black border border-stone-800 p-2 font-serif-brutal text-stone-400 italic text-sm placeholder:font-mono-machine placeholder:not-italic focus:outline-none focus:border-red-900 transition-colors"
                          value={track.story}
                          onChange={(e) => {
                            const newAlbums = [...localData.albums];
                            newAlbums[ai].tracks[ti].story = e.target.value;
                            setLocalData({ ...localData, albums: newAlbums });
                          }}
                          placeholder="TRACK_MANIFESTO (STORY)"
                        />
                        <textarea
                          className="w-full h-32 bg-black border border-stone-800 p-2 font-mono-machine text-stone-500 text-[10px] leading-relaxed whitespace-pre focus:outline-none focus:border-red-900 transition-colors"
                          value={track.lyrics}
                          onChange={(e) => {
                            const newAlbums = [...localData.albums];
                            newAlbums[ai].tracks[ti].lyrics = e.target.value;
                            setLocalData({ ...localData, albums: newAlbums });
                          }}
                          placeholder="LYRICS (TESTIMONY)"
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      const newAlbums = [...localData.albums];
                      newAlbums[ai].tracks.push({ title: 'NEW_TRACK', lyrics: '', story: '', audioUrl: '' });
                      setLocalData({ ...localData, albums: newAlbums });
                    }}
                    className="w-full py-4 border border-dashed border-stone-900 text-stone-700 font-mono-machine uppercase text-[9px] hover:text-red-900"
                  >
                    + APPEND_TRACK
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={() => {
                setLocalData({
                  ...localData,
                  albums: [...localData.albums, { id: `a${Date.now()}`, title: 'NEW_ALBUM', year: '2025', concept: '', context: '', coverUrl: '', tracks: [] }]
                });
              }}
              className="w-full py-12 border-2 border-dashed border-stone-900 text-stone-700 font-mono-machine uppercase tracking-[0.5em] hover:text-red-900 hover:border-red-900 transition-all"
            >
              + INITIATE_NEW_ALBUM
            </button>
          </div>
        )}
      </div>

      {browserSelection && (
        <div className="fixed inset-0 z-[2000] bg-black/95 backdrop-blur-md flex items-center justify-center p-6">
          <div className="max-w-4xl w-full border border-red-900 bg-stone-950 p-12 max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-extrabold uppercase text-white font-mono-machine tracking-[0.3em]">
                SELECT_{browserSelection.type.toUpperCase()}_ASSET
              </h3>
              <button
                onClick={() => setBrowserSelection(null)}
                className="text-stone-500 hover:text-white font-mono-machine text-[10px]"
              >
                [ ESCAPE ]
              </button>
            </div>

            <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableFiles.length === 0 ? (
                <div className="col-span-2 py-20 text-center border border-dashed border-stone-900 text-stone-700 font-mono-machine uppercase text-[10px]">
                  NO_FILES_DETECTED_IN_MEDIA/{browserSelection.type}S/
                </div>
              ) : (
                availableFiles.map((file) => (
                  <button
                    key={file.url}
                    onClick={() => selectFile(file.url)}
                    className="p-4 border border-stone-900 text-left hover:border-red-600 group transition-all"
                  >
                    <div className="text-[10px] text-stone-500 font-mono-machine mb-2 group-hover:text-red-900 transition-colors uppercase">
                      FILE_PATH (READY)
                    </div>
                    <div className="text-sm font-syne font-bold text-stone-200 group-hover:text-white truncate">
                      {file.name}
                    </div>
                    {browserSelection.type === 'audio' && (
                      <div className="mt-2" onClick={(e) => e.stopPropagation()}>
                        <audio controls src={file.url} className="w-full h-6 opacity-50 hover:opacity-100 transition-opacity" />
                      </div>
                    )}
                  </button>
                ))
              )}
            </div>

            <div className="mt-10 pt-8 border-t border-stone-900">
              <p className="text-[8px] font-mono-machine text-stone-700 uppercase leading-relaxed">
                MANUAL_OVERRIDE: PLACE FILES IN `public/media/{browserSelection.type === 'audio' ? 'audio' : 'images'}/` DIRECTORY TO LIST THEM HERE.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
