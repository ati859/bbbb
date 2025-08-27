# 🎵 Lavalink Vercel Proxy

Vercel üzerinde çalışan Lavalink proxy servisi. Discord müzik botları için Lavalink sunucusuna proxy görevi görür.

## 🚀 Vercel'e Deploy Etme

### 1. Vercel CLI Kurulumu
```bash
npm i -g vercel
```

### 2. Vercel'e Login
```bash
vercel login
```

### 3. Deploy
```bash
vercel
```

### 4. Environment Variables Ayarlama
Vercel dashboard'da aşağıdaki environment variables'ları ayarlayın:

- `LAVALINK_HOST`: Lavalink sunucunuzun adresi (örn: `your-server.com:2333`)
- `LAVALINK_PASSWORD`: Lavalink sunucunuzun şifresi

## 📋 Kullanım

### REST API
```
GET https://your-vercel-app.vercel.app/lavalink/v4/info
```

### WebSocket
```
ws://your-vercel-app.vercel.app/lavalink
```

### Health Check
```
GET https://your-vercel-app.vercel.app/health
```

## 🔧 Local Development

1. Dependencies yükle:
```bash
npm install
```

2. Environment variables ayarla:
```bash
cp .env.example .env
# .env dosyasını düzenle
```

3. Serveri başlat:
```bash
npm start
```

## 📁 Dosya Yapısı

```
├── index.js          # Ana proxy server
├── package.json      # Dependencies
├── vercel.json       # Vercel konfigürasyonu
├── .env.example      # Environment variables örneği
└── README.md         # Bu dosya
```

## 🌐 Endpoints

- `/` - Ana sayfa ve servis bilgileri
- `/health` - Health check
- `/info` - Lavalink proxy bilgileri
- `/lavalink/*` - Lavalink proxy (tüm Lavalink endpoints)

## ⚙️ Konfigürasyon

### Environment Variables

| Variable | Açıklama | Varsayılan |
|----------|----------|------------|
| `LAVALINK_HOST` | Lavalink sunucu adresi | `localhost:2333` |
| `LAVALINK_PASSWORD` | Lavalink şifresi | `youshallnotpass` |
| `PORT` | Server portu | `3000` |

## 🔒 Güvenlik

- CORS tüm originlere açık (production'da kısıtlayın)
- Lavalink authentication otomatik olarak eklenir
- Rate limiting önerilir (production için)

## 📝 Notlar

- Vercel serverless functions 30 saniye timeout'a sahiptir
- WebSocket bağlantıları için özel konfigürasyon gerekebilir
- Production'da güvenlik ayarlarını gözden geçirin