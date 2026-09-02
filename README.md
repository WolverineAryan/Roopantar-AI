# Roopantar-AI — Enterprise Multi-Format Content Transformation Engine
**Production MVP Platform** | Single-Source GenAI Architecture  
**Specification Standard:** IEEE 830 Standard Architecture

---

## 🌟 Overview
**Roopantar-AI** is a single-source Gen-AI content transformation platform built with **Next.js 14 (App Router)** and **FastAPI**. It ingests complex source documents (incident reports, intelligence briefings, articles, audio/video streams, or images) and produces **7 ready-to-use, schema-validated deliverables** from a single unified **Intent Context Object (ICO)**:

1. 🛡️ **Technical & Threat Advisory** (`.docx`, `.pdf`, `.json`) — Severity levels, vector breakdown, mitigations table, references.
2. 📄 **Executive Summary** (`.docx`, `.pdf`, `.json`) — BLUF, strategic mission impact, decisions required, resource needs.
3. 💼 **LinkedIn Post** (Copyable text, `.txt`) — Scroll-stopping hook, core takeaways, call to action, and hashtags.
4. 🧵 **Twitter / X Thread** (Copyable text, `.txt`) — Numbered 4-6 tweet thread, character-bounded with CTA.
5. 📊 **PowerPoint Presentation Deck** (`.pptx`, `.json`) — 16:9 widescreen slides with bullet points and presenter speaker notes.
6. 🎬 **Video Script & Storyboard Package** (`.docx`, `.pdf`) — Scene-by-scene timing, visual directions, voiceover script, and subtitle cues.
7. 📈 **Infographic Architecture Blueprint** (`.pdf`, `.json`) — Stat highlights, visual layout logic, icon specs, and designer notes.

---

## ⚡ Free API Keys & Setup (100% Free / $0 Cost)

Roopantar-AI uses **Groq Cloud API** for ultra-fast, free LLM generation and speech-to-text audio/video transcription.

### 1. Get Your Free Groq API Key (1 Minute)
1. Go to [https://console.groq.com/keys](https://console.groq.com/keys)
2. Sign in with Google / GitHub (no credit card required).
3. Click **"Create API Key"** and copy your key (starts with `gsk_...`).
4. Paste it in `backend/.env`:
   ```env
   GROQ_API_KEY=gsk_your_free_key_here
   LLM_PROVIDER=groq
   ```

*(Note: The system also works in instant Demo/Offline Mode with pre-built schema fallbacks even before adding an API key!)*

---

## 🚀 Quick Start Guide

### 1. Backend Setup (FastAPI)
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
# source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
* Backend API: `http://localhost:8000`
* Interactive Swagger Docs: `http://localhost:8000/docs`

### 2. Frontend Setup (Next.js 14)
```bash
cd frontend
npm install
npm run dev
```
* Next.js Web Dashboard: `http://localhost:3000`

---

## 🛠️ Tech Stack & Architecture

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons, Axios |
| **Backend API** | Python 3.10+, FastAPI, Uvicorn, Pydantic v2, SQLAlchemy Async |
| **LLM Inference** | Groq (`llama-3.3-70b-versatile`), OpenAI/Grok, Ollama (Offline) |
| **Transcription** | Groq Whisper (`whisper-large-v3`) |
| **Ingestion** | `pypdf`, `python-docx`, `pytesseract` (OCR), `python-multipart` |
| **Export Engines** | `python-pptx` (PowerPoint), `python-docx` (Word), `reportlab` (PDF) |
| **Database** | SQLite + `aiosqlite` (Zero configuration, async) |

---

## 📁 Project Structure

```
Roopantar-AI/
├── backend/
│   ├── app/
│   │   ├── api/             # /jobs, /formats, /health endpoints
│   │   ├── core/            # Config & async database session
│   │   ├── ingestion/       # PDF/DOCX parsers, OCR, Whisper audio transcription
│   │   ├── llm/             # Groq/OpenAI client & Intent Context Engine (ICO)
│   │   ├── generators/      # Config-driven YAML formats & registry
│   │   │   ├── advisory.yaml
│   │   │   ├── executive_summary.yaml
│   │   │   ├── linkedin.yaml
│   │   │   ├── twitter.yaml
│   │   │   ├── presentation.yaml
│   │   │   ├── video_package.yaml
│   │   │   └── infographic.yaml
│   │   ├── validators/      # Schema validator & retry engine
│   │   ├── exporters/       # PPTX, DOCX, and PDF generators
│   │   └── models/          # Job, IntentContext, GeneratedOutput DB tables
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js App Router (layout.tsx, page.tsx, globals.css)
│   │   ├── components/      # UI widgets & format preview renderers
│   │   ├── lib/api.ts       # Backend REST API client
│   │   └── types/           # TypeScript interfaces
│   ├── next.config.mjs
│   ├── tailwind.config.js
│   └── package.json
└── sample_inputs/           # Sample NTRO threat briefing test files
```
