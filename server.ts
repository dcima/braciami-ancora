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

// SPA fallback to index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
