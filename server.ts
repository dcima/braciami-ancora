import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Permissive public access headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Serve built assets
app.use(express.static(path.join(__dirname, 'dist')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// OAuth OTP Email dispatch endpoint
app.post('/api/send-oauth-otp-email', (req, res) => {
  const { to, providerName, otpCode, verifyUrl, subject } = req.body || {};
  console.log(`[GMAIL API / SENDER] From: samantamanderioli083@gmail.com | To: ${to} | Provider: ${providerName} | OTP: ${otpCode}`);
  res.json({
    ok: true,
    sender: 'samantamanderioli083@gmail.com',
    to,
    providerName,
    otpCode,
    verifyUrl,
    timestamp: new Date().toISOString()
  });
});

// Proxy endpoint to fetch an image from a Web URL and return DataURL + suggested fileName
app.get('/api/fetch-web-image', async (req, res) => {
  const rawUrl = String(req.query.url || '').trim();
  if (!rawUrl || !/^https?:\/\//i.test(rawUrl)) {
    res.status(400).json({ ok: false, error: 'URL immagine non valido.' });
    return;
  }
  try {
    const response = await fetch(rawUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BraciamiAncoraBot/1.0)',
        Accept: 'image/*,*/*;q=0.8'
      }
    });
    if (!response.ok) {
      res.status(400).json({ ok: false, error: `Impossibile scaricare l'immagine (HTTP ${response.status}).` });
      return;
    }
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    const mime = contentType.split(';')[0].trim() || 'image/jpeg';
    const dataUrl = `data:${mime};base64,${base64}`;

    const urlObj = new URL(rawUrl);
    const rawBaseName = path.basename(urlObj.pathname) || `web_photo_${Date.now()}.jpg`;
    const cleanFileName = rawBaseName.replace(/[^a-zA-Z0-9._-]/g, '_') || `web_photo_${Date.now()}.jpg`;

    res.json({
      ok: true,
      dataUrl,
      contentType: mime,
      fileName: cleanFileName
    });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err?.message || 'Errore nel recupero immagine dal web.' });
  }
});

// SPA fallback to index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
