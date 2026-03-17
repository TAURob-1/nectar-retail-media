/**
 * Nectar Retail Media Agent Builder — Express Proxy
 * Bridges React UI → FastAPI backend (port 8001)
 */

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const API_URL = process.env.API_URL || 'http://localhost:8001';

// Proxy all /api/* requests to FastAPI
app.use(
  '/api',
  createProxyMiddleware({
    target: API_URL,
    changeOrigin: true,
    on: {
      error: (err, req, res) => {
        console.error('Proxy error:', err.message);
        res.status(502).json({ error: 'Backend unavailable', detail: err.message });
      },
    },
  })
);

app.use(
  '/health',
  createProxyMiddleware({
    target: API_URL,
    changeOrigin: true,
  })
);

// Serve built React app in production
const distPath = path.join(__dirname, 'ui', 'dist');
app.use(express.static(distPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Nectar Retail Media proxy running on http://localhost:${PORT}`);
  console.log(`🔗 Proxying /api → ${API_URL}`);
});
