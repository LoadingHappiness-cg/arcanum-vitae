
export enum View {
  HOME = 'home',
  MUSIC = 'music',
  WORDS = 'words',
  VISUALS = 'visuals',
  ABOUT = 'about',
  MIRROR = 'mirror',
  ARCHIVE = 'archive',
  ADMIN = 'admin',
  LEGAL = 'legal'
}

export interface Album {
  id: string;
  title: string;
  year: string;
  concept: string;
  context: string;
  tracks: Track[];
  coverUrl: string;
}

export interface Track {
  title: string;
  lyrics: string;
  story: string;
  audioUrl: string; // URL to the MP3 file
}

export interface WordFragment {
  id: string;
  text: string;
  source?: string;
}

export interface VisualItem {
  id: string;
  url: string;
  title: string;
  description: string;
}

export interface ArchiveItem {
  id: string;
  type: 'text' | 'image';
  author: string;
  content: string;
  title?: string;
}

export interface FictionDeclaration {
  main: string;
  details: string;
  tagline: string;
}

export interface AiDeclaration {
  main: string;
  body: string[];
  tagline: string;
}

export interface HumanIdentity {
  footerQuote: string;
  originLabel: string;
  veritasName: string;
  veritasLink: string;
}

export interface LegalSection {
  id: string;
  title: string;
  body: string;
  list?: string[];
}

export interface LegalContent {
  heading: string;
  sections: LegalSection[];
  footer: string;
}
