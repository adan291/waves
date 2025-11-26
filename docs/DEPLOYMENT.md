# 🚀 Deployment Guide - Whispers of the Wave

**Versión**: 1.0  
**Fecha**: Noviembre 25, 2025  
**Nivel**: Intermedio

---

## 📋 Requisitos Previos

### Requisitos del Sistema
```
- Servidor web (Apache, Nginx, o similar)
- HTTPS habilitado (recomendado)
- Soporte para archivos estáticos
- Mínimo 10MB de espacio en disco
```

### Requisitos del Cliente
```
- Navegador moderno (Chrome 90+, Firefox 88+, Safari 14+)
- JavaScript habilitado
- localStorage disponible (5MB mínimo)
- Conexión a internet
```

---

## 🌐 Opciones de Deployment

### Opción 1: GitHub Pages (Recomendado para Demo)

**Ventajas**: Gratis, fácil, HTTPS automático

**Pasos**:

1. **Preparar el repositorio**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/tu-usuario/whispers-of-the-wave.git
git push -u origin main
```

2. **Configurar GitHub Pages**
   - Ve a Settings → Pages
   - Source: Deploy from branch
   - Branch: main / (root)
   - Save

3. **Configurar API Key**
   - **IMPORTANTE**: No subas tu API key al repositorio público
   - Usa variables de entorno o configuración local
   - Ver sección [Seguridad de API Key](#seguridad-de-api-key)

4. **Acceder**
   - URL: `https://tu-usuario.github.io/whispers-of-the-wave/`
   - Espera 2-3 minutos para el primer deploy

---

### Opción 2: Netlify

**Ventajas**: Deploy automático, HTTPS, CDN global

**Pasos**:

1. **Crear cuenta en Netlify**
   - Ve a [netlify.com](https://netlify.com)
   - Regístrate gratis

2. **Deploy desde Git**
```bash
# Conecta tu repositorio
# Netlify detectará automáticamente que es un sitio estático
```

3. **Configurar Build Settings**
```yaml
# netlify.toml
[build]
  publish = "."
  command = "echo 'No build needed'"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
```

4. **Variables de Entorno**
   - Site settings → Environment variables
   - Agregar `GEMINI_API_KEY`

5. **Deploy**
   - Push a main → Deploy automático
   - URL: `https://tu-sitio.netlify.app`

---

### Opción 3: Vercel

**Ventajas**: Deploy instantáneo, preview automático

**Pasos**:

1. **Instalar Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
cd whispers-of-the-wave
vercel
```

3. **Configurar**
```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "index.html",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

4. **Variables de Entorno**
```bash
vercel env add GEMINI_API_KEY
```

---

### Opción 4: Servidor Propio (Apache/Nginx)

**Ventajas**: Control total, personalización completa

#### Apache

1. **Copiar archivos**
```bash
# Copiar al directorio web
sudo cp -r whispers-of-the-wave /var/www/html/
```

2. **Configurar Virtual Host**
```apache
# /etc/apache2/sites-available/whispers.conf
<VirtualHost *:80>
    ServerName whispers.tudominio.com
    DocumentRoot /var/www/html/whispers-of-the-wave
    
    <Directory /var/www/html/whispers-of-the-wave>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    # Habilitar compresión
    <IfModule mod_deflate.c>
        AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript
    </IfModule>
    
    # Cache headers
    <IfModule mod_expires.c>
        ExpiresActive On
        ExpiresByType text/css "access plus 1 year"
        ExpiresByType application/javascript "access plus 1 year"
        ExpiresByType text/html "access plus 0 seconds"
    </IfModule>
</VirtualHost>
```

3. **Habilitar sitio**
```bash
sudo a2ensite whispers.conf
sudo systemctl reload apache2
```

#### Nginx

1. **Copiar archivos**
```bash
sudo cp -r whispers-of-the-wave /var/www/
```

2. **Configurar Server Block**
```nginx
# /etc/nginx/sites-available/whispers
server {
    listen 80;
    server_name whispers.tudominio.com;
    root /var/www/whispers-of-the-wave;
    index index.html;
    
    # Compresión
    gzip on;
    gzip_types text/css application/javascript text/html;
    
    # Cache
    location ~* \.(css|js)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Security headers
    add_header X-Frame-Options "DENY";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
}
```

3. **Habilitar sitio**
```bash
sudo ln -s /etc/nginx/sites-available/whispers /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🔒 Seguridad de API Key

### ⚠️ NUNCA subas tu API key al repositorio público

### Opción 1: Configuración Local (Desarrollo)

Crea un archivo `config.local.js` (agregado a .gitignore):
```javascript
// config.local.js
window.GEMINI_API_KEY = 'tu-api-key-aqui';
```

Modifica `index.html`:
```html
<!-- Antes de geminiService.js -->
<script src="config.local.js"></script>
<script src="js/geminiService.js"></script>
```

Modifica `geminiService.js`:
```javascript
const geminiConfig = {
    apiKey: window.GEMINI_API_KEY || 'YOUR_API_KEY_HERE',
    // ...
};
```

### Opción 2: Variables de Entorno (Producción)

Para Netlify/Vercel, usa variables de entorno y un build script:

```javascript
// build-config.js
const fs = require('fs');
const apiKey = process.env.GEMINI_API_KEY;

const config = `window.GEMINI_API_KEY = '${apiKey}';`;
fs.writeFileSync('config.js', config);
```

### Opción 3: Proxy Backend (Más Seguro)

Crea un backend que maneje las llamadas a la API:

```javascript
// backend/api.js (Node.js example)
const express = require('express');
const app = express();

app.post('/api/chat', async (req, res) => {
    const response = await fetch('https://generativelanguage.googleapis.com/...', {
        headers: {
            'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`
        },
        body: JSON.stringify(req.body)
    });
    res.json(await response.json());
});
```

---

## 🔧 Configuración Post-Deployment

### 1. Verificar Funcionalidad

**Checklist**:
- [ ] Página carga correctamente
- [ ] CSS y JS se cargan sin errores
- [ ] API key funciona
- [ ] Mensajes se envían y reciben
- [ ] Historial se guarda
- [ ] Responsive funciona en móvil

### 2. Configurar Analytics (Opcional)

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 3. Configurar Monitoring (Opcional)

```javascript
// Error tracking con Sentry
<script src="https://browser.sentry-cdn.com/7.x.x/bundle.min.js"></script>
<script>
  Sentry.init({
    dsn: 'YOUR_SENTRY_DSN',
    environment: 'production'
  });
</script>
```

---

## 🚨 Troubleshooting

### Problema: CORS Errors

**Síntoma**: Error en consola sobre CORS

**Solución**:
```nginx
# Nginx
add_header Access-Control-Allow-Origin "*";
add_header Access-Control-Allow-Methods "GET, POST, OPTIONS";
```

### Problema: 404 en archivos JS/CSS

**Síntoma**: Archivos no se cargan

**Solución**:
1. Verifica rutas relativas en `index.html`
2. Confirma que los archivos existen
3. Revisa permisos de archivos (644)

### Problema: API Key no funciona

**Síntoma**: Errores de autenticación

**Solución**:
1. Verifica que la key esté activa
2. Confirma que no hay espacios extra
3. Revisa límites de cuota en Google AI Studio

---

## 📊 Optimización de Performance

### 1. Habilitar Compresión

**Apache**:
```apache
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css text/javascript application/javascript
</IfModule>
```

**Nginx**:
```nginx
gzip on;
gzip_types text/css application/javascript text/html;
gzip_min_length 1000;
```

### 2. Configurar Cache

**Apache**:
```apache
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
</IfModule>
```

**Nginx**:
```nginx
location ~* \.(css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. Minificar Archivos (Opcional)

```bash
# Instalar herramientas
npm install -g terser csso-cli

# Minificar JS
terser js/main.js -o js/main.min.js
terser js/ui.js -o js/ui.min.js
terser js/geminiService.js -o js/geminiService.min.js

# Minificar CSS
csso css/style.css -o css/style.min.css
```

---

## 🔐 SSL/HTTPS

### Opción 1: Let's Encrypt (Gratis)

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obtener certificado
sudo certbot --nginx -d whispers.tudominio.com

# Renovación automática
sudo certbot renew --dry-run
```

### Opción 2: Cloudflare (Gratis)

1. Agrega tu dominio a Cloudflare
2. Cambia los nameservers
3. Habilita SSL/TLS (Full)
4. Habilita "Always Use HTTPS"

---

## 📈 Monitoreo

### Logs de Acceso

**Apache**:
```bash
tail -f /var/log/apache2/access.log
```

**Nginx**:
```bash
tail -f /var/log/nginx/access.log
```

### Logs de Errores

**Apache**:
```bash
tail -f /var/log/apache2/error.log
```

**Nginx**:
```bash
tail -f /var/log/nginx/error.log
```

---

## 🔄 Actualización

### Deploy de Nuevas Versiones

**GitHub Pages**:
```bash
git add .
git commit -m "Update to v1.1"
git push origin main
```

**Netlify/Vercel**:
```bash
# Push automático
git push origin main
```

**Servidor Propio**:
```bash
# Backup
sudo cp -r /var/www/whispers-of-the-wave /var/www/whispers-backup

# Actualizar
sudo cp -r whispers-of-the-wave/* /var/www/whispers-of-the-wave/

# Limpiar cache del navegador
# Ctrl + Shift + R
```

---

## ✅ Checklist de Deployment

### Pre-Deployment
- [ ] Código testeado localmente
- [ ] API key configurada correctamente
- [ ] Archivos minificados (opcional)
- [ ] .gitignore configurado
- [ ] README actualizado

### Deployment
- [ ] Archivos subidos al servidor
- [ ] Permisos configurados
- [ ] HTTPS habilitado
- [ ] Compresión habilitada
- [ ] Cache configurado

### Post-Deployment
- [ ] Sitio accesible
- [ ] Funcionalidad verificada
- [ ] Performance optimizada
- [ ] Monitoring configurado
- [ ] Backup configurado

---

## 🆘 Soporte

### Recursos
- [Documentación Técnica](./ARCHITECTURE.md)
- [Guía de Configuración](./CONFIGURATION.md)
- [FAQ](../USER_GUIDE.md#faq)

### Contacto
- GitHub Issues
- Email: support@whispers.example.com

---

**Documento creado**: Noviembre 25, 2025  
**Versión**: 1.0  
**Estado**: Completo

🚀 **Deploy exitoso para producción**
