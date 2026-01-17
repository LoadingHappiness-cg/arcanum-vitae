import express from 'express';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';

dotenv.config();

// Global error handling for debugging production crashes
process.on('unhandledRejection', (reason, promise) => {
    console.error('UNHANDLED_REJECTION at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT_EXCEPTION:', err);
    process.exit(1);
});


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_PATH = path.join(__dirname, 'data', 'db.json');

const app = express();
const port = Number(process.env.PORT) || 3000;
const UMAMI_PROXY_BASE = (process.env.UMAMI_PROXY_BASE || '').trim().replace(/\/+$/, '');

// Trust proxy for HAProxy and Cloudflare
app.set('trust proxy', 1);

app.use(express.json({ limit: '10mb' }));

app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

// Security Headers
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "script-src": ["'self'", "'unsafe-inline'", "https://cloud.umami.is", "https://www.googletagmanager.com", "https://cdn.tailwindcss.com", "https://esm.sh"],
            "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.tailwindcss.com"],
            "font-src": ["'self'", "data:", "https://fonts.gstatic.com"],
            "img-src": ["'self'", "data:", "https://images.unsplash.com", "https://www.googletagmanager.com", "https://www.google-analytics.com", "https://grainy-gradients.vercel.app"],
            "connect-src": ["'self'", "https://cloud.umami.is", "https://www.google-analytics.com", "https://analytics.google.com"],
        },
    },
}));

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

// Rate Limiting
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: { error: 'Too many login attempts, please try again after an hour.' },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use('/api/', generalLimiter);
app.use('/api/auth', authLimiter);

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
const isBoolean = (value: unknown): value is boolean => typeof value === 'boolean';

const isTrack = (value: unknown) => (
    isRecord(value) &&
    isString(value.title) &&
    (value.lyrics === undefined || value.lyrics === null || isString(value.lyrics)) &&
    (value.story === undefined || value.story === null || isString(value.story)) &&
    isString(value.audioUrl)
);

const isAlbum = (value: unknown) => (
    isRecord(value) &&
    isString(value.id) &&
    isString(value.title) &&
    isString(value.year) &&
    isString(value.concept) &&
    (value.context === undefined || value.context === null || isString(value.context)) &&
    isString(value.coverUrl) &&
    Array.isArray(value.tracks) &&
    value.tracks.every(isTrack) &&
    (value.isUpcoming === undefined || value.isUpcoming === null || isBoolean(value.isUpcoming))
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
        console.warn('Save rejected (Validation failed):', validation.errors);
        return res.status(400).json({
            error: "INVALID_PROTO_DATA",
            details: validation.errors.join('; ')
        });
    }
    try {
        saveData(req.body);
        res.json({ success: true });
    } catch (error) {
        console.error('Save failed (FS error):', error);
        res.status(500).json({ error: "FS_SAVE_ERROR" });
    }
});

app.post('/api/reset', requireAdmin, (req, res) => {
    try {
        if (fs.existsSync(DATA_PATH)) {
            fs.unlinkSync(DATA_PATH);
        }
        res.json({ success: true, message: "PERSISTENCE_WIPED: SYSTEM_REVERTED_TO_PROTOCOL" });
    } catch (error) {
        console.error('Reset failed:', error);
        res.status(500).json({ error: "Reset failed" });
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

app.post('/api/upload', requireAdmin, (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ error: "NO_FILES_UPLOADED" });
    }

    const uploadedFile = req.files.file as any;
    if (!uploadedFile) {
        return res.status(400).json({ error: "MISSING_FILE_FIELD" });
    }

    const { type } = req.body;
    const isAudio = uploadedFile.mimetype.startsWith('audio/');
    const isImage = uploadedFile.mimetype.startsWith('image/');

    const subDir = type === 'audio' || isAudio ? 'audio' : (type === 'image' || isImage ? 'images' : '');

    if (!subDir) {
        return res.status(400).json({ error: "INVALID_FILE_TYPE_OR_TARGET" });
    }

    const dirPath = path.join(__dirname, 'public', 'media', subDir);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    // Sanitize filename
    const safeName = uploadedFile.name.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
    const finalPath = path.join(dirPath, safeName);

    uploadedFile.mv(finalPath, (err: any) => {
        if (err) {
            console.error('File move failed:', err);
            return res.status(500).json({ error: "UPLOAD_MV_FAILED" });
        }
        res.json({
            success: true,
            url: `/media/${subDir}/${safeName}`
        });
    });
});

app.post('/api/mirror', requireAdmin, async (req, res) => {
    if (!genAI) return res.status(500).json({ error: "API Key not configured" });
    const { input } = req.body;

    try {
        const model = (genAI as any).getGenerativeModel({ model: "gemini-1.5-flash" });
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
        const model = (genAI as any).getGenerativeModel({ model: "gemini-1.5-flash" });
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
        // Forward correct IP to Umami
        const clientIp = req.get('cf-connecting-ip') || req.ip || '';

        const upstream = await fetch(`${UMAMI_PROXY_BASE}/api/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': req.get('user-agent') || '',
                'X-Forwarded-For': clientIp
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

const server = app.listen(port, '0.0.0.0', () => {
    console.log(`Arcanum Vitae active on http://0.0.0.0:${port}`);
    console.log(`Data storage: ${DATA_PATH}`);
    if (!ADMIN_KEY) {
        console.warn('ADMIN_KEY is not configured. Admin actions will be disabled.');
    }
});

server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use.`);
    } else {
        console.error('SERVER_ERROR:', err);
    }
});
