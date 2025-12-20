
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';

dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_PATH = path.join(__dirname, 'data', 'db.json');

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());

// Serve static files from the Vite build
app.use(express.static(path.join(__dirname, 'dist')));
// Also serve public files (robots.txt, media, etc)
app.use(express.static(path.join(__dirname, 'public')));

const API_KEY = process.env.GEMINI_API_KEY || "";
const genAI = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

// Persistence Helpers
const loadData = () => {
    if (fs.existsSync(DATA_PATH)) {
        return JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
    }
    return null;
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

app.post('/api/save', (req, res) => {
    try {
        saveData(req.body);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Failed to save data" });
    }
});

app.get('/api/files/list', (req, res) => {
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

app.post('/api/mirror', async (req, res) => {
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

app.post('/api/curate', async (req, res) => {
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
});
