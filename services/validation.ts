import { Album, WordFragment, VisualItem, FictionDeclaration, AiDeclaration, HumanIdentity, Track, LegalContent, HomeContent, AnalyticsContent } from '../types';

export const isRecord = (value: unknown): value is Record<string, unknown> => (
    typeof value === 'object' && value !== null && !Array.isArray(value)
);

export const isString = (value: unknown): value is string => typeof value === 'string';
export const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean';

export const isTrack = (value: unknown): value is Track => (
    isRecord(value) &&
    isString(value.title) &&
    isString(value.lyrics) &&
    isString(value.story) &&
    isString(value.audioUrl)
);

export const isAlbum = (value: unknown): value is Album => (
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

export const isFragment = (value: unknown): value is WordFragment => (
    isRecord(value) &&
    isString(value.id) &&
    isString(value.text) &&
    (value.source === undefined || isString(value.source))
);

export const isVisual = (value: unknown): value is VisualItem => (
    isRecord(value) &&
    isString(value.id) &&
    isString(value.url) &&
    isString(value.title) &&
    isString(value.description)
);

export const isDeclaration = (value: unknown): value is FictionDeclaration => (
    isRecord(value) &&
    isString(value.main) &&
    isString(value.details) &&
    isString(value.tagline)
);

export const isAiDeclaration = (value: unknown): value is AiDeclaration => (
    isRecord(value) &&
    isString(value.main) &&
    Array.isArray(value.body) &&
    value.body.every(isString) &&
    isString(value.tagline)
);

export const isHumanIdentity = (value: unknown): value is HumanIdentity => (
    isRecord(value) &&
    isString(value.footerQuote) &&
    isString(value.originLabel) &&
    isString(value.veritasName) &&
    isString(value.veritasLink)
);

export const isLegalSection = (value: unknown) => (
    isRecord(value) &&
    isString(value.id) &&
    isString(value.title) &&
    isString(value.body) &&
    (value.list === undefined || (Array.isArray(value.list) && value.list.every(isString)))
);

export const isLegalContent = (value: unknown): value is LegalContent => (
    isRecord(value) &&
    isString(value.heading) &&
    isString(value.footer) &&
    Array.isArray(value.sections) &&
    value.sections.every(isLegalSection)
);

export const isHomeContent = (value: unknown): value is HomeContent => (
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

export const isAnalyticsContent = (value: unknown): value is AnalyticsContent => (
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
