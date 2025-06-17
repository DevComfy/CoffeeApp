import express from 'express';
import cors from 'cors';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { networkInterfaces } from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read config file
const config = JSON.parse(readFileSync(join(__dirname, 'config.json'), 'utf8'));

// Ensure data directory exists
const dataDir = join(__dirname, 'data');
if (!existsSync(dataDir)) {
    mkdirSync(dataDir);
}

// Ensure meetings.json exists with initial structure
const dataPath = join(__dirname, config.dataPath);
if (!existsSync(dataPath)) {
    writeFileSync(dataPath, JSON.stringify([]));
}

// Function to get the machine's IP address
function getIPAddress() {
    const interfaces = networkInterfaces();
    for (const devName in interfaces) {
        const iface = interfaces[devName];
        for (const alias of iface) {
            if (alias.family === 'IPv4' && !alias.internal) {
                return alias.address;
            }
        }
    }
    return '0.0.0.0';
}

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/meetings', (req, res) => {
    try {
        const data = readFileSync(dataPath, 'utf8');
        res.json(JSON.parse(data));
    } catch (error) {
        console.error('Error reading meetings:', error);
        res.json([]);
    }
});

app.post('/api/meetings', (req, res) => {
    try {
        writeFileSync(dataPath, JSON.stringify(req.body, null, 2));
        res.json({ success: true });
    } catch (error) {
        console.error('Error saving meetings:', error);
        res.status(500).json({ error: 'Failed to save meetings' });
    }
});

const IP_ADDRESS = getIPAddress();
const PORT = config.port || 3000;

app.listen(PORT, IP_ADDRESS, () => {
    console.log(`Server running at http://${IP_ADDRESS}:${PORT}`);
});
