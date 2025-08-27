// Vercel Serverless Function için Lavalink Proxy
// Bu dosya Vercel'de çalışacak şekilde optimize edilmiştir

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS ayarları
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// JSON parsing
app.use(express.json());

// Ana sayfa
app.get('/', (req, res) => {
    res.json({
        message: '🎵 Lavalink Proxy Server',
        status: 'active',
        endpoints: {
            health: '/health',
            lavalink: '/lavalink/*',
            info: '/info'
        },
        timestamp: new Date().toISOString()
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// Lavalink bilgileri
app.get('/info', (req, res) => {
    res.json({
        service: 'Lavalink Proxy',
        version: '1.0.0',
        description: 'Vercel üzerinde çalışan Lavalink proxy servisi',
        usage: {
            websocket: 'ws://localhost:' + PORT + '/lavalink',
            rest: 'http://localhost:' + PORT + '/lavalink/v4/',
            password: process.env.LAVALINK_PASSWORD || 'youshallnotpass'
        }
    });
});

// Lavalink proxy (gerçek Lavalink sunucusuna yönlendirme)
const LAVALINK_HOST = process.env.LAVALINK_HOST || 'localhost:2333';
const LAVALINK_PASSWORD = process.env.LAVALINK_PASSWORD || 'youshallnotpass';

app.use('/lavalink', createProxyMiddleware({
    target: `http://${LAVALINK_HOST}`,
    changeOrigin: true,
    pathRewrite: {
        '^/lavalink': ''
    },
    onProxyReq: (proxyReq, req, res) => {
        // Lavalink authentication header ekle
        proxyReq.setHeader('Authorization', LAVALINK_PASSWORD);
    },
    onError: (err, req, res) => {
        console.error('Proxy Error:', err.message);
        res.status(500).json({
            error: 'Lavalink sunucusuna bağlanılamadı',
            message: err.message
        });
    }
}));

// WebSocket proxy için
const { createServer } = require('http');
const server = createServer(app);

// WebSocket upgrade handling
server.on('upgrade', (request, socket, head) => {
    if (request.url.startsWith('/lavalink')) {
        // WebSocket proxy logic burada olacak
        console.log('WebSocket connection attempt to Lavalink');
    }
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({
        error: 'Sunucu hatası',
        message: err.message
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Endpoint bulunamadı',
        path: req.originalUrl
    });
});

// Vercel için export
if (process.env.VERCEL) {
    module.exports = app;
} else {
    // Local development
    server.listen(PORT, () => {
        console.log('🚀 Lavalink Proxy Server');
        console.log('========================');
        console.log(`🌐 Server: http://localhost:${PORT}`);
        console.log(`🎵 Lavalink Proxy: http://localhost:${PORT}/lavalink`);
        console.log(`🔑 Password: ${LAVALINK_PASSWORD}`);
        console.log('\n📝 Kullanım:');
        console.log('- REST API: /lavalink/v4/');
        console.log('- WebSocket: /lavalink');
        console.log('- Health: /health');
        console.log('- Info: /info');
    });
}