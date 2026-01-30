import React from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import App from './App';
import { ALBUMS } from './constants';

const BASE_URL = (process.env.SITE_BASE_URL || 'https://arcanumvitae.art').replace(/\/$/, '');

const toAbsoluteUrl = (raw: string) => {
  const u = (raw || '').trim();
  if (!u) return '';
  if (u.startsWith('http://') || u.startsWith('https://')) return u;
  if (u.startsWith('./')) return `${BASE_URL}/${u.slice(2)}`;
  if (u.startsWith('/')) return `${BASE_URL}${u}`;
  return `${BASE_URL}/${u}`;
};

const collapse = (s: string) => (s || '').replace(/\s+/g, ' ').trim();
const truncate = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1).trim()}…` : s);

const buildMetaForUrl = (url: string) => {
  const path = url.split('?')[0].split('#')[0] || '/';

  const baseTitle = 'Arcanum Vitae | AI Music Manifesto & Digital Fiction';
  const baseDesc = 'A human-guided, machine-shaped manifesto of music, resistance, and testimony. Explore the sonic and visual fracture.';
  const baseImage = `${BASE_URL}/og-image.jpg`;

  // Defaults
  let title = baseTitle;
  let description = baseDesc;
  let image = baseImage;

  // View pages
  if (path === '/music') {
    title = 'Music | Arcanum Vitae';
    description = 'Listen to Arcanum Vitae: AI-generated music guided and shaped by human intent. Albums, track manifests, and the newest signal.';
  } else if (path === '/words') {
    title = 'Words | Arcanum Vitae';
    description = 'Fragments, declarations, and the textual protocol behind Arcanum Vitae.';
  } else if (path === '/visuals') {
    title = 'Visuals | Arcanum Vitae';
    description = 'Relics and visual fragments from the Arcanum Vitae system.';
  } else if (path === '/archive') {
    title = 'Archive | Arcanum Vitae';
    description = 'Resistance Archive: a collective testimony of defiance.';
  } else if (path === '/about') {
    title = 'About | Arcanum Vitae';
    description = 'The human-machine dialogue: AI-generated sound, human meaning, and ethical responsibility.';
  } else if (path === '/legal') {
    title = 'Legal | Arcanum Vitae';
    description = 'Legal & privacy protocol for Arcanum Vitae.';
  }

  // Music deep links
  // /music/:albumId
  // /music/:albumId/:trackNo
  if (path.startsWith('/music/')) {
    const parts = path.split('/').filter(Boolean); // ['music', 'albumId', 'trackNo?']
    const albumId = parts[1];
    const trackNoRaw = parts[2];
    const trackNo = trackNoRaw ? Number(trackNoRaw) : NaN;

    const album = ALBUMS.find((a) => a.id === albumId);
    if (album) {
      title = `${album.title} | Arcanum Vitae`;
      description = truncate(collapse(album.concept || album.context || baseDesc), 170);
      image = toAbsoluteUrl(album.coverUrl) || baseImage;

      if (Number.isFinite(trackNo) && trackNo > 0 && trackNo <= album.tracks.length) {
        const track = album.tracks[trackNo - 1];
        title = `${track.title} — ${album.title} | Arcanum Vitae`;
        const rawDesc = track.story || track.lyrics || album.concept || baseDesc;
        description = truncate(collapse(rawDesc), 170);
      }
    }
  }

  const canonical = `${BASE_URL}${path === '/' ? '/' : path}`;

  return { title, description, image, canonical, path };
};

const buildJsonLdForUrl = (meta: { canonical: string; title: string; description: string; image: string; path: string }) => {
  const creator = { '@type': 'Person', name: 'Carlos Gavela' };

  // Homepage as WebSite
  if (meta.path === '/') {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Arcanum Vitae',
      url: meta.canonical,
      description: meta.description,
      inLanguage: 'en',
      creator,
    };
  }

  // Music pages: /music/:albumId(/:trackNo)
  if (meta.path.startsWith('/music/')) {
    const parts = meta.path.split('/').filter(Boolean);
    const albumId = parts[1];
    const trackNoRaw = parts[2];
    const trackNo = trackNoRaw ? Number(trackNoRaw) : NaN;
    const album = ALBUMS.find((a) => a.id === albumId);

    if (album) {
      const albumUrl = `${BASE_URL}/music/${album.id}`;
      const albumImg = toAbsoluteUrl(album.coverUrl) || meta.image;

      // Track page
      if (Number.isFinite(trackNo) && trackNo > 0 && trackNo <= album.tracks.length) {
        const t = album.tracks[trackNo - 1];
        return {
          '@context': 'https://schema.org',
          '@type': 'MusicRecording',
          name: t.title,
          url: meta.canonical,
          description: meta.description,
          inLanguage: 'en',
          image: albumImg,
          position: trackNo,
          audio: {
            '@type': 'AudioObject',
            contentUrl: toAbsoluteUrl(t.audioUrl),
          },
          inAlbum: {
            '@type': 'MusicAlbum',
            name: album.title,
            url: albumUrl,
            image: albumImg,
            byArtist: creator,
          },
          byArtist: creator,
        };
      }

      // Album page
      return {
        '@context': 'https://schema.org',
        '@type': 'MusicAlbum',
        name: album.title,
        url: meta.canonical,
        description: meta.description,
        inLanguage: 'en',
        image: albumImg,
        byArtist: creator,
        numTracks: album.tracks.length,
        track: album.tracks.map((t, idx) => ({
          '@type': 'MusicRecording',
          name: t.title,
          position: idx + 1,
          url: `${BASE_URL}/music/${album.id}/${idx + 1}`,
        })),
      };
    }
  }

  // Other views as WebPage
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: meta.title,
    url: meta.canonical,
    description: meta.description,
    inLanguage: 'en',
    isPartOf: {
      '@type': 'WebSite',
      name: 'Arcanum Vitae',
      url: BASE_URL,
    },
    creator,
  };
};

// Vite-prerender-plugin calls this during `vite build`.
export async function prerender(data: { url: string }) {
  const url = data?.url || '/';
  const meta = buildMetaForUrl(url);
  const jsonLd = buildJsonLdForUrl(meta);

  const html = renderToString(
    <React.StrictMode>
      <MemoryRouter initialEntries={[url]}>
        <App />
      </MemoryRouter>
    </React.StrictMode>
  );

  return {
    html,
    head: {
      title: meta.title,
      elements: new Set([
        { type: 'link', props: { rel: 'canonical', href: meta.canonical } },
        { type: 'meta', props: { name: 'description', content: meta.description } },

        // OpenGraph
        { type: 'meta', props: { property: 'og:type', content: 'website' } },
        { type: 'meta', props: { property: 'og:site_name', content: 'Arcanum Vitae' } },
        { type: 'meta', props: { property: 'og:url', content: meta.canonical } },
        { type: 'meta', props: { property: 'og:title', content: meta.title } },
        { type: 'meta', props: { property: 'og:description', content: meta.description } },
        { type: 'meta', props: { property: 'og:image', content: meta.image } },

        // Twitter
        { type: 'meta', props: { property: 'twitter:card', content: 'summary_large_image' } },
        { type: 'meta', props: { property: 'twitter:url', content: meta.canonical } },
        { type: 'meta', props: { property: 'twitter:title', content: meta.title } },
        { type: 'meta', props: { property: 'twitter:description', content: meta.description } },
        { type: 'meta', props: { property: 'twitter:image', content: meta.image } },

        // JSON-LD
        { type: 'script', props: { type: 'application/ld+json' }, children: JSON.stringify(jsonLd) },
      ] as any),
    },
  };
}
