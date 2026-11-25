# nexPDF tool

**All Your PDF Needs. One Place.**  
Built by [Nexzware](https://nexzware.com)

---

## Overview

nexPDF tool is a free, open-source PDF tools web application providing 9 essential PDF operations:

| Tool | Description |
|------|-------------|
| Merge PDF | Combine multiple PDFs into one |
| Split PDF | Extract pages or split by range |
| Compress PDF | Reduce file size |
| JPG to PDF | Convert images to PDF |
| PDF to JPG | Convert pages to images |
| Word to PDF | Convert DOC/DOCX to PDF |
| Rotate PDF | Rotate pages |
| Protect PDF | Add password encryption |
| Unlock PDF | Remove password protection |

---

## Tech Stack

- **Frontend:** React 18 + Vite + TypeScript + Tailwind CSS
- **Backend:** Python + FastAPI + Uvicorn
- **PDF libs:** pypdf, Pillow, pypdfium2
- **Word conversion:** LibreOffice Headless
- **Deployment:** Docker + Nginx

---

## Local Development

### Prerequisites

- Node.js 20+
- Python 3.11+
- LibreOffice (for Word to PDF)
- qpdf (optional, for better compression)

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: http://localhost:5173

### Backend

**Windows:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Linux/macOS:**
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Backend runs at: http://localhost:8000  
Swagger docs: http://localhost:8000/docs

---

## Docker Deployment

```bash
cp .env.example .env
# Edit .env and set NEXPDF_TOKEN_SECRET to a random 32+ character string
docker compose up --build
```

App runs at: http://localhost:8080

---

## VPS / Hosting Panel Deployment

The project is configured to run behind a hosting panel or reverse proxy.

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```
2. Set a unique secret and the public domain:
   ```dotenv
   NEXPDF_HTTP_PORT=8080
   NEXPDF_TOKEN_SECRET=replace-with-a-random-secret-at-least-32-characters
   NEXPDF_ALLOWED_ORIGINS=https://pdf.your-domain.com
   ```
3. Build and start the containers:
   ```bash
   docker compose up -d --build
   ```
4. In your VPS hosting panel, create a domain or subdomain and configure a reverse proxy to:
   ```text
   http://127.0.0.1:8080
   ```
5. Enable HTTPS/SSL in the hosting panel. Both the web application and `/api` endpoints are served through the same domain.

The external port can be changed with `NEXPDF_HTTP_PORT`. Do not set port `80` when another web server already owns it.

Useful commands:
```bash
docker compose ps
docker compose logs -f
docker compose down
docker compose up -d --build
```

---

## Environment Variables

See `.env.example` for all configurable options.

| Variable | Default | Description |
|----------|---------|-------------|
| NEXPDF_TOKEN_SECRET | (required) | Download token signing secret |
| NEXPDF_MAX_FILE_SIZE_MB | 25 | Max file size per upload |
| NEXPDF_MAX_CONCURRENT_JOBS | 2 | Parallel processing limit |
| NEXPDF_FILE_RETENTION_MINUTES | 60 | Auto-delete after N minutes |
| NEXPDF_ALLOWED_ORIGINS | localhost origins | CORS allowed origins |

---

## System Dependencies

### LibreOffice (Word to PDF)

**Ubuntu/Debian:**
```bash
sudo apt-get install libreoffice-headless
```

**Docker:** Included in backend Dockerfile.

### qpdf (Enhanced compression)

**Ubuntu/Debian:**
```bash
sudo apt-get install qpdf
```

---

## Security

- Files processed in isolated temporary directories
- Session-based file access control
- Files auto-deleted after 60 minutes
- HTTPS-ready Nginx configuration
- Non-root Docker containers
- Passwords never logged or stored
- Rate limiting: 30 requests/minute per IP

---

## License

MIT License – see LICENSE file.

&copy; 2026 Nexzware
