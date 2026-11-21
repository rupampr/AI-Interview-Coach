# 🎯 AI Interview Coach

<p align="center">
  <img src="https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Next.js%2016-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/Google%20Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Google Gemini" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
</p>

An intelligent, end-to-end AI-powered mock interview and career preparation platform. **AI Interview Coach** bridges the gap between job seekers and hiring standards by analyzing resumes against target job descriptions, computing semantic alignment and skill gaps, and running dynamic, adaptive technical and behavioral interviews with real-time scoring and multi-dimensional feedback.

---

## 🌐 Live Deployments

- **Frontend (Web Application):** [https://ai-interview-coach-omega-red.vercel.app](https://ai-interview-coach-omega-red.vercel.app)
- **Backend API (Production Engine):** [https://ai-interview-coach-1-h7db.onrender.com](https://ai-interview-coach-1-h7db.onrender.com)
- **API Documentation (Swagger UI):** [https://ai-interview-coach-1-h7db.onrender.com/docs](https://ai-interview-coach-1-h7db.onrender.com/docs)
- **Interactive Health Status:** [https://ai-interview-coach-1-h7db.onrender.com/health](https://ai-interview-coach-1-h7db.onrender.com/health)

---

## 🚀 Key Features

### 1. 📄 Intelligent Resume Parsing & Skill Extraction
- Multi-format resume ingestion (PDF and raw text) powered by **PyMuPDF**.
- Automated NLP extraction of technical skills, education background, and work experience.
- Cloud semantic vectorization via **Google Gemini `gemini-embedding-001`** (3072-dimensional embeddings) with zero local RAM overhead.

### 2. 🎯 Job Description Matching & Gap Analysis
- Deep requirements decomposition: extracts required technologies, years of experience, and responsibilities.
- **Cosine Similarity Engine**: computes mathematical alignment between candidate profile and target job.
- **Skill Matrix Visualization**: categorizes skills into matched strengths vs. missing gaps to focus preparation.

### 3. 🤖 Dynamic Adaptive Mock Interviews
- Supports 4 distinct interview tracks:
  - **Technical Track:** Deep dive into specific frameworks, system architecture, and debugging.
  - **Behavioral Track:** Scenario-based questions evaluated on STAR (Situation, Task, Action, Result) methodology.
  - **Data Structures & Algorithms (DSA):** Complexity analysis, algorithmic paradigms, and edge-case handling.
  - **HR & Culture Fit:** Role motivation, leadership style, and organizational alignment.
- Generates targeted questions that actively probe the candidate's **missing skill gaps** while validating matched competencies.

### 4. 📊 Multi-Dimensional AI Answer Evaluation
- Instant evaluation powered by **Gemini 3.5 Flash Lite** across 5 distinct dimensions (scored 0–10):
  - 🛠️ **Technical Score:** Accuracy, conceptual depth, and technical terminology.
  - 🎯 **Relevance Score:** How directly the response addresses the prompt.
  - 📦 **Completeness Score:** Coverage of edge cases, trade-offs, and critical points.
  - 💎 **Clarity Score:** Structure, brevity, and coherent explanation.
  - 🗣️ **Communication Score:** Professional tone, confidence, and articulation.
- In-depth constructive feedback highlighting what went well and actionable points for improvement.

### 5. 📈 Comprehensive Performance Reports & Analytics
- Complete interview session breakdown with overall score, category breakdown, and time analytics.
- Automated generation of candidate **Strengths**, **Weaknesses**, and **Actionable Next Steps**.
- Longitudinal progress tracking: historic trendlines of performance across sessions.

---

## 🏗️ Architecture & System Design

```
                     ┌──────────────────────────────────────────────┐
                     │         Next.js 16 Web Application          │
                     │  (Tailwind CSS, Glassmorphism, React Hooks)  │
                     └──────────────────────┬───────────────────────┘
                                            │ HTTPS / REST (JWT)
                                            ▼
                     ┌──────────────────────────────────────────────┐
                     │            FastAPI Backend Engine            │
                     │ (Uvicorn, Pydantic V2, Starlette Middleware) │
                     └──────┬──────────────────────┬──────────┬─────┘
                            │                      │          │
         ┌──────────────────┴──┐                   │          └──────────────────┐
         ▼                     ▼                   ▼                             ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐         ┌──────────────────┐
│   PyMuPDF (PDF)  │ │ Google GenAI SDK │ │   PostgreSQL DB  │         │ Matching Service │
│ Resume Ingestion │ │ Gemini 3.5 Lite  │ │ (SQLAlchemy 2.0, │         │ Cosine Similarity│
│   & Clean Text   │ │ & Embeddings-001 │ │  Alembic Schema) │         │  Skill Overlap   │
└──────────────────┘ └──────────────────┘ └──────────────────┘         └──────────────────┘
```

---

## 💻 Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Modern Dark Glassmorphism)
- **Icons:** Lucide React
- **Hosting:** Vercel

### Backend
- **Framework:** FastAPI (Python 3.11)
- **ASGI Server:** Uvicorn
- **ORM & Database:** SQLAlchemy 2.0 + PostgreSQL (`psycopg2-binary`)
- **Authentication:** OAuth2 Password Bearer with JWT (`python-jose`, `bcrypt`, `passlib`)
- **PDF Extraction:** PyMuPDF (`fitz`)
- **AI / LLM Integration:** `google-genai` SDK
  - Generation Model: `gemini-3.5-flash-lite` (with automatic fallback to `gemini-flash-latest`)
  - Embedding Model: `gemini-embedding-001` (3072 dims)
- **Hosting:** Render (Docker Container)

---

## 🛠️ Local Development & Setup

### Prerequisites
- [Docker](https://www.docker.com/) & Docker Compose **OR** Python 3.11+ and Node.js 18+
- [Google AI Studio Gemini API Key](https://aistudio.google.com/)

---

### Option 1: Quickstart with Docker Compose (Recommended)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/rupampr/AI-Interview-Coach.git
   cd AI-Interview-Coach
   ```

2. **Configure Backend Environment:**
   Create a `.env` file inside the `backend/` directory:
   ```env
   DATABASE_URL=postgresql://postgres:postgres@db:5432/interview_coach
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-3.5-flash-lite
   JWT_SECRET_KEY=super-secret-local-jwt-key
   ENVIRONMENT=development
   ```

3. **Start all services (Database, Backend, Frontend):**
   ```bash
   docker compose up --build
   ```

4. **Access the application:**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:8000`
   - Interactive Swagger Docs: `http://localhost:8000/docs`

---

### Option 2: Manual Local Setup

#### 1. Database & Backend
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 📡 API Overview

| Method | Endpoint | Description | Auth Required |
|:---|:---|:---|:---:|
| `POST` | `/auth/register` | Register a new user account | No |
| `POST` | `/auth/login` | Authenticate user & receive JWT token | No |
| `GET` | `/auth/me` | Retrieve profile of authenticated user | Yes |
| `POST` | `/resume/upload` | Upload PDF resume, extract text & skills | Yes |
| `GET` | `/resume/me` | Fetch active user's parsed resume & skills | Yes |
| `POST` | `/job-description/` | Create and parse a new job description | Yes |
| `GET` | `/job-description/` | List all saved job descriptions | Yes |
| `GET` | `/job-description/{id}` | Get detail of a specific job description | Yes |
| `POST` | `/match/{jd_id}` | Compute match score, cosine similarity & skill gaps | Yes |
| `POST` | `/interview/start` | Generate dynamic questions tailored to skill gaps | Yes |
| `GET` | `/interview/{id}` | Fetch interview session state & questions | Yes |
| `POST` | `/answer/submit` | Submit candidate answer & receive multi-score evaluation | Yes |
| `GET` | `/report/{interview_id}` | Retrieve comprehensive report card & AI summary | Yes |
| `GET` | `/report/progress/me` | Historic performance trends and average scores | Yes |
| `GET` | `/health` | API and environment health check | No |

---

## ⚡ Engineering Highlights & Cloud Optimizations

1. **Near-Zero RAM Cloud Footprint (< 60MB):**
   - Traditional local transformer models (`sentence-transformers` + PyTorch) require over 550MB of RAM, causing memory crashes on free cloud tiers.
   - We engineered a cloud-native embedding layer using Google Gemini's vector API and lightweight fallback hashing, running smoothly within Render's 512MB limit.
2. **Resilient AI Pipeline:**
   - Multi-tier fallback architecture: automatically recovers from rate-limits (503) or model deprecations (404) across candidate models.
   - Defensive JSON sanitization using regex matching to handle markdown code block encapsulations cleanly.
3. **Dynamic Cloud Port Binding & CORS Regex:**
   - Container reads `$PORT` dynamically from the host environment.
   - Wildcard regex matching for Vercel preview environments (`https://.*\.vercel\.app`) with credential support.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
