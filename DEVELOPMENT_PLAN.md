# nexPDF tool – Development Plan

**Product:** nexPDF tool  
**Tagline:** All Your PDF Needs. One Place.  
**Developer:** Nexzware  
**Date:** 2026-11-25  

---

## Architecture

### Frontend
- React 18 + Vite + TypeScript + Tailwind CSS
- React Router v6 for routing
- Axios for API calls
- Lucide React for icons
- PDF.js for PDF preview thumbnails

### Backend
- Python 3.11 + FastAPI + Uvicorn
- pypdf – merge, split, rotate, encrypt
- Pillow – image processing
- pypdfium2 – PDF rendering
- qpdf – PDF optimization
- LibreOffice Headless – Word to PDF

### Infrastructure
- Docker + Docker Compose
- Nginx reverse proxy
- Ubuntu VPS deployment

---

## Branding Configuration

- **Product name:** nexPDF tool
- **Tagline:** All Your PDF Needs. One Place.
- **Company:** Nexzware
- **Primary colour:** #2563EB
- **Secondary colour:** #0F172A
- **Background:** #FFFFFF
- **Config file:** `frontend/src/config/brand.ts`

---

## Implementation Phases

### Phase 1 – Project Foundation
- [x] Inspect existing directory
- [x] Create full project structure
- [ ] Initialize frontend (Vite + React + TS + Tailwind)
- [ ] Initialize backend (FastAPI + dependencies)
- [ ] Create brand configuration
- [ ] Create README

### Phase 2 – Frontend Development
- [ ] Homepage with all 7 sections
- [ ] Responsive navigation bar
- [ ] 9 PDF tool pages
- [ ] Shared upload component
- [ ] File preview component
- [ ] Settings component
- [ ] Processing component
- [ ] Download component
- [ ] All-tools page
- [ ] About, Contact, Privacy, Terms pages
- [ ] 404 page

### Phase 3 – Backend Development
- [ ] FastAPI app setup
- [ ] File upload endpoint
- [ ] Session management
- [ ] Job manager
- [ ] Download service
- [ ] Auto file cleanup
- [ ] Merge processor
- [ ] Split processor
- [ ] Compress processor
- [ ] JPG-to-PDF processor
- [ ] PDF-to-JPG processor
- [ ] Word-to-PDF processor
- [ ] Rotate processor
- [ ] Protect processor
- [ ] Unlock processor

### Phase 4 – Integration
- [ ] Connect all 9 tool workflows
- [ ] Upload → Process → Download flow
- [ ] Error handling
- [ ] Loading states

### Phase 5 – Testing
- [ ] Backend unit tests
- [ ] API endpoint tests
- [ ] End-to-end tests

### Phase 6 – Deployment
- [ ] Frontend Dockerfile
- [ ] Backend Dockerfile
- [ ] Docker Compose
- [ ] Nginx config
- [ ] Production build

---

## Routes

| Route | Page |
|-------|------|
| / | Homepage |
| /all-tools | All Tools |
| /merge-pdf | Merge PDF |
| /split-pdf | Split PDF |
| /compress-pdf | Compress PDF |
| /jpg-to-pdf | JPG to PDF |
| /pdf-to-jpg | PDF to JPG |
| /word-to-pdf | Word to PDF |
| /rotate-pdf | Rotate PDF |
| /protect-pdf | Protect PDF |
| /unlock-pdf | Unlock PDF |
| /about | About |
| /contact | Contact |
| /privacy-policy | Privacy Policy |
| /terms-and-conditions | Terms |
| * | 404 |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | Health check |
| GET | /api/tools | List tools |
| POST | /api/files/upload | Upload file |
| POST | /api/pdf/merge | Merge PDFs |
| POST | /api/pdf/split | Split PDF |
| POST | /api/pdf/compress | Compress PDF |
| POST | /api/pdf/jpg-to-pdf | JPG to PDF |
| POST | /api/pdf/pdf-to-jpg | PDF to JPG |
| POST | /api/pdf/word-to-pdf | Word to PDF |
| POST | /api/pdf/rotate | Rotate PDF |
| POST | /api/pdf/protect | Protect PDF |
| POST | /api/pdf/unlock | Unlock PDF |
| GET | /api/jobs/{job_id} | Get job status |
| POST | /api/jobs/{job_id}/cancel | Cancel job |
| GET | /api/download/{file_id} | Download file |
| DELETE | /api/files/{file_id} | Delete file |
| DELETE | /api/jobs/{job_id}/files | Delete job files |

---

## Security Checklist
- [ ] File type + signature validation
- [ ] MIME type verification
- [ ] Size limits enforced
- [ ] Rate limiting
- [ ] Session-based authorization
- [ ] Secure download tokens
- [ ] CORS configuration
- [ ] No passwords logged
- [ ] Path traversal prevention
- [ ] Non-root Docker containers
