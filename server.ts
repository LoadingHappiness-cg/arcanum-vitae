
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';

dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_PATH = path.join(__dirname, 'data', 'db.json');

const app = express();
const port = Number(process.env.PORT) || 3000;
const UMAMI_PROXY_BASE = (process.env.UMAMI_PROXY_BASE || '').trim().replace(/\/+$/, '');

const defaultCorsOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173'
];
const corsOrigins = (process.env.CORS_ORIGINS || '')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const allowedOrigins = corsOrigins.length > 0 ? corsOrigins : defaultCorsOrigins;
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(null, false);
    }
}));
app.use(express.json({ limit: '2mb' }));

// Serve static files from the Vite build
app.use(express.static(path.join(__dirname, 'dist')));

// Serve media with no-cache to support hot-swapping files
app.use('/media', express.static(path.join(__dirname, 'public', 'media'), {
    setHeaders: (res) => {
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    }
}));

// Also serve public files (robots.txt, etc)
app.use(express.static(path.join(__dirname, 'public')));

const API_KEY = process.env.GEMINI_API_KEY || "";
const genAI = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;
const ADMIN_KEY = process.env.ADMIN_KEY?.trim() || '';
const TOKEN_TTL_MS = Number(process.env.ADMIN_TOKEN_TTL_MS) || 1000 * 60 * 60 * 6;
const tokenStore = new Map<string, number>();

const pruneTokens = () => {
    const now = Date.now();
    for (const [token, expiresAt] of tokenStore.entries()) {
        if (expiresAt <= now) tokenStore.delete(token);
    }
};

const issueToken = () => {
    const token = crypto.randomBytes(32).toString('hex');
    tokenStore.set(token, Date.now() + TOKEN_TTL_MS);
    return token;
};

const safeEqual = (a: string, b: string) => {
    const aBuf = Buffer.from(a);
    const bBuf = Buffer.from(b);
    if (aBuf.length !== bBuf.length) return false;
    return crypto.timingSafeEqual(aBuf, bBuf);
};

const requireAdmin: express.RequestHandler = (req, res, next) => {
    pruneTokens();
    const authHeader = req.get('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : (req.get('x-admin-token') || '');
    if (!token || !tokenStore.has(token)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const expiresAt = tokenStore.get(token);
    if (!expiresAt || expiresAt <= Date.now()) {
        tokenStore.delete(token);
        return res.status(401).json({ error: 'Unauthorized' });
    }
    return next();
};

// Persistence Helpers
const isRecord = (value: unknown): value is Record<string, unknown> => (
    typeof value === 'object' && value !== null && !Array.isArray(value)
);

const isString = (value: unknown): value is string => typeof value === 'string';

const isTrack = (value: unknown) => (
    isRecord(value) &&
    isString(value.title) &&
    isString(value.lyrics) &&
    isString(value.story) &&
    isString(value.audioUrl)
);

const isAlbum = (value: unknown) => (
    isRecord(value) &&
    isString(value.id) &&
    isString(value.title) &&
    isString(value.year) &&
    isString(value.concept) &&
    (value.context === undefined || isString(value.context)) &&
    isString(value.coverUrl) &&
    Array.isArray(value.tracks) &&
    value.tracks.every(isTrack)
);

const isFragment = (value: unknown) => (
    isRecord(value) &&
    isString(value.id) &&
    isString(value.text) &&
    (value.source === undefined || isString(value.source))
);

const isVisual = (value: unknown) => (
    isRecord(value) &&
    isString(value.id) &&
    isString(value.url) &&
    isString(value.title) &&
    isString(value.description)
);

const isDeclaration = (value: unknown) => (
    isRecord(value) &&
    isString(value.main) &&
    isString(value.details)
);

const isAiDeclaration = (value: unknown) => (
    isRecord(value) &&
    isString(value.main) &&
    Array.isArray(value.body) &&
    value.body.every(isString)
);

const isHumanIdentity = (value: unknown) => (
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

const isLegalContent = (value: unknown) => (
    isRecord(value) &&
    isString(value.heading) &&
    isString(value.footer) &&
    Array.isArray(value.sections) &&
    value.sections.every(isLegalSection)
);

const isHomeContent = (value: unknown) => (
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

const isAnalyticsContent = (value: unknown) => (
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

const validateData = (data: unknown) => {
    const errors: string[] = [];
    if (!isRecord(data)) {
        return { ok: false, errors: ['Payload must be an object.'] };
    }

    if (!Array.isArray(data.albums) || !data.albums.every(isAlbum)) {
        errors.push('Invalid albums payload.');
    }

    if (!Array.isArray(data.fragments) || !data.fragments.every(isFragment)) {
        errors.push('Invalid fragments payload.');
    }

    if (!Array.isArray(data.visuals) || !data.visuals.every(isVisual)) {
        errors.push('Invalid visuals payload.');
    }

    if ('humanManifesto' in data && data.humanManifesto !== undefined && !isString(data.humanManifesto)) {
        errors.push('Invalid humanManifesto payload.');
    }

    if ('humanIdentity' in data && data.humanIdentity !== undefined && !isHumanIdentity(data.humanIdentity)) {
        errors.push('Invalid humanIdentity payload.');
    }

    if ('fictionDec' in data && data.fictionDec !== undefined && !isDeclaration(data.fictionDec)) {
        errors.push('Invalid fictionDec payload.');
    }

    if ('aiDec' in data && data.aiDec !== undefined && !isAiDeclaration(data.aiDec)) {
        errors.push('Invalid aiDec payload.');
    }

    if ('legalContent' in data && data.legalContent !== undefined && !isLegalContent(data.legalContent)) {
        errors.push('Invalid legalContent payload.');
    }

    if ('homeContent' in data && data.homeContent !== undefined && !isHomeContent(data.homeContent)) {
        errors.push('Invalid homeContent payload.');
    }

    if ('analyticsContent' in data && data.analyticsContent !== undefined && !isAnalyticsContent(data.analyticsContent)) {
        errors.push('Invalid analyticsContent payload.');
    }

    return { ok: errors.length === 0, errors };
};

const loadData = () => {
    if (!fs.existsSync(DATA_PATH)) {
        return null;
    }

    try {
        const parsed = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
        const validation = validateData(parsed);
        if (!validation.ok) {
            console.warn('Invalid persisted data ignored:', validation.errors);
            return null;
        }
        return parsed;
    } catch (error) {
        console.error('Failed to load persisted data:', error);
        return null;
    }
};

const saveData = (data: any) => {
    if (!fs.existsSync(path.dirname(DATA_PATH))) {
        fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true });
    }
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
};

// API Endpoints
app.get('/api/health', (req, res) => {
    res.json({
        status: "active",
        timestamp: new Date().toISOString(),
        identity: "ARCANUM_VITAE_SYSTEM"
    });
});

app.get('/api/data', (req, res) => {
    const data = loadData();
    res.json(data); // Returns null if no data saved yet, client will use INITIAL_DATA
});

app.post('/api/save', requireAdmin, (req, res) => {
    const validation = validateData(req.body);
    if (!validation.ok) {
        return res.status(400).json({ error: "Invalid data", details: validation.errors });
    }
    try {
        saveData(req.body);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Failed to save data" });
    }
});

app.get('/api/files/list', requireAdmin, (req, res) => {
    const { type } = req.query;
    const subDir = type === 'audio' ? 'audio' : type === 'image' ? 'images' : '';
    const dirPath = path.join(__dirname, 'public', 'media', subDir);

    if (!fs.existsSync(dirPath)) {
        return res.json([]);
    }

    try {
        const files = fs.readdirSync(dirPath)
            .filter(file => !file.startsWith('.'))
            .map(file => ({
                name: file,
                url: `/media/${subDir ? subDir + '/' : ''}${file}`
            }));
        res.json(files);
    } catch (error) {
        res.status(500).json({ error: "Failed to list files" });
    }
});

app.post('/api/mirror', requireAdmin, async (req, res) => {
    if (!genAI) return res.status(500).json({ error: "API Key not configured" });
    const { input } = req.body;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Mirror system prompt... Input: ${input}`;
        const result = await model.generateContent(prompt);
        res.json({ text: result.response.text() });
    } catch (error) {
        console.error("Mirror proxy failed:", error);
        res.status(500).json({ error: "Reflection failed" });
    }
});

app.post('/api/curate', requireAdmin, async (req, res) => {
    if (!genAI) return res.status(500).json({ error: "API Key not configured" });
    const { input } = req.body;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(input);
        res.json({ text: result.response.text() });
    } catch (error) {
        console.error("Curation proxy failed:", error);
        res.status(500).json({ error: "Curation failed" });
    }
});

app.post('/api/auth', (req, res) => {
    if (!ADMIN_KEY) {
        return res.status(503).json({ error: "Admin key not configured" });
    }
    const passkey = typeof req.body?.passkey === 'string' ? req.body.passkey : '';
    if (!passkey) {
        return res.status(400).json({ error: "Missing passkey" });
    }
    if (!safeEqual(passkey, ADMIN_KEY)) {
        return res.status(401).json({ error: "Invalid passkey" });
    }
    const token = issueToken();
    res.json({ token, expiresAt: new Date(Date.now() + TOKEN_TTL_MS).toISOString() });
});

app.get('/umami/script.js', async (_req, res) => {
    if (!UMAMI_PROXY_BASE) {
        return res.status(503).send('Umami proxy is not configured.');
    }
    try {
        const upstream = await fetch(`${UMAMI_PROXY_BASE}/script.js`);
        if (!upstream.ok) {
            return res.status(upstream.status).send('Failed to load Umami script.');
        }
        const contentType = upstream.headers.get('content-type') || 'application/javascript; charset=utf-8';
        res.set('Content-Type', contentType);
        const cacheControl = upstream.headers.get('cache-control');
        if (cacheControl) {
            res.set('Cache-Control', cacheControl);
        }
        const body = Buffer.from(await upstream.arrayBuffer());
        return res.status(200).send(body);
    } catch (error) {
        console.error('Umami script proxy failed:', error);
        return res.status(502).send('Umami proxy failed.');
    }
});

app.post('/umami/api/send', async (req, res) => {
    if (!UMAMI_PROXY_BASE) {
        return res.status(503).json({ error: 'Umami proxy is not configured.' });
    }
    try {
        const upstream = await fetch(`${UMAMI_PROXY_BASE}/api/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': req.get('user-agent') || ''
            },
            body: JSON.stringify(req.body ?? {})
        });
        const contentType = upstream.headers.get('content-type');
        if (contentType) res.set('Content-Type', contentType);
        const payload = await upstream.text();
        return res.status(upstream.status).send(payload);
    } catch (error) {
        console.error('Umami send proxy failed:', error);
        return res.status(502).json({ error: 'Umami proxy failed.' });
    }
});

app.post('/api/send', async (req, res) => {
    if (!UMAMI_PROXY_BASE) {
        return res.status(503).json({ error: 'Umami proxy is not configured.' });
    }
    try {
        const upstream = await fetch(`${UMAMI_PROXY_BASE}/api/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': req.get('user-agent') || ''
            },
            body: JSON.stringify(req.body ?? {})
        });
        const contentType = upstream.headers.get('content-type');
        if (contentType) res.set('Content-Type', contentType);
        const payload = await upstream.text();
        return res.status(upstream.status).send(payload);
    } catch (error) {
        console.error('Umami send proxy failed:', error);
        return res.status(502).json({ error: 'Umami proxy failed.' });
    }
});

app.get('/api/auth/verify', requireAdmin, (req, res) => {
    res.json({ ok: true });
});

// Fallback for SPA - Catch-all middleware
app.use((req, res) => {
    if (fs.existsSync(path.join(__dirname, 'dist', 'index.html'))) {
        res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    } else {
        res.status(404).send('Build not found. Run npm run build.');
    }
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Arcanum Vitae active on http://0.0.0.0:${port}`);
    console.log(`Data storage: ${DATA_PATH}`);
    if (!ADMIN_KEY) {
        console.warn('ADMIN_KEY is not configured. Admin actions will be disabled.');
    }
});
