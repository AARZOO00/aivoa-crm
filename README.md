<<<<<<< HEAD
# AIVOA Life Sciences CRM — HCP Interaction Module

> AI-First CRM for Medical Sales Representatives. Log HCP interactions via structured form or natural language AI chat — powered by LangGraph, Groq (gemma2-9b-it), FastAPI, and React.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    AIVOA CRM System                     │
├─────────────────┬───────────────────────────────────────┤
│   Frontend      │           Backend                     │
│   React 18      │           FastAPI + Python 3.11       │
│   Redux Toolkit │                                       │
│   TailwindCSS   │   ┌─────────────────────────────┐    │
│                 │   │     LangGraph Agent          │    │
│  ┌───────────┐  │   │  ┌──────────────────────┐   │    │
│  │Structured │  │   │  │  Router Node         │   │    │
│  │   Form    │  │   │  │  (Groq gemma2-9b-it) │   │    │
│  │  (Left)   │◄─┼───┼──│  ↓ routes to tool    │   │    │
│  └───────────┘  │   │  └──────────────────────┘   │    │
│                 │   │  ┌───┐┌───┐┌───┐┌───┐┌───┐  │    │
│  ┌───────────┐  │   │  │L  ││E  ││S  ││SF ││AS │  │    │
│  │AI Chat    │  │   │  │og ││dit││rch││ug ││en │  │    │
│  │Interface  │──┼───┼─►│   ││   ││   ││   ││t  │  │    │
│  │  (Right)  │  │   │  └───┘└───┘└───┘└───┘└───┘  │    │
│  └───────────┘  │   │         ↓ Response Node       │    │
│                 │   └─────────────────────────────┘    │
│                 │                  ↓                    │
│                 │        PostgreSQL Database            │
└─────────────────┴───────────────────────────────────────┘

Tools: [L]og · [E]dit · [S]earch HCP · [SF] Suggest Followup · [AS] Analyze Sentiment
```

---

## Features

- **Split-panel UI** — Structured form (left) + AI chat (right)
- **5 AI Agent Tools** via LangGraph StateGraph
- **Auto-fill** — AI chat extracts entities and fills the form automatically
- **HCP Search** — Live PostgreSQL ILIKE search with dropdown
- **Sentiment Analysis** — Groq-powered HCP sentiment detection
- **Follow-up Suggestions** — AI generates 3 specific, time-bound actions
- **Multi-turn chat** — Session-based conversation history
- **Sample HCP data** — Seeded automatically on startup

---

## Quick Start — Local Development

### Prerequisites
- Python 3.11+
- Node.js 20+
- PostgreSQL 15+
- Groq API key (free at [console.groq.com](https://console.groq.com))

### 1. Clone & Setup Backend

```bash
cd aivoa-crm/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your DATABASE_URL and GROQ_API_KEY
```

### 2. Create Database

```bash
# Create PostgreSQL database
createdb aivoa_crm

# Or with psql:
psql -c "CREATE DATABASE aivoa_crm;"
psql -c "CREATE USER aivoa WITH PASSWORD 'aivoa_password';"
psql -c "GRANT ALL PRIVILEGES ON DATABASE aivoa_crm TO aivoa;"
```

### 3. Run Backend

```bash
cd aivoa-crm/backend
uvicorn app.main:app --reload --port 8000
```

The backend will auto-create tables and seed 8 sample HCPs on first start.

### 4. Setup & Run Frontend

```bash
cd aivoa-crm/frontend
npm install

# Create .env.local
echo "VITE_API_URL=http://localhost:8000" > .env.local

npm run dev
# → http://localhost:5173
```

---

## Docker Setup

```bash
# Copy and configure environment
cp backend/.env.example .env
# Edit .env — at minimum set GROQ_API_KEY

# Build and start all services
docker compose up --build

# Access:
# Frontend → http://localhost
# Backend API → http://localhost:8000
# API Docs → http://localhost:8000/docs
```

---

## API Documentation

### HCP Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/hcp/` | List all HCPs |
| GET | `/api/hcp/search?q={query}` | Search HCPs by name/specialty/hospital |
| GET | `/api/hcp/{id}` | Get single HCP |
| POST | `/api/hcp/` | Create new HCP |
| PUT | `/api/hcp/{id}` | Update HCP |
| DELETE | `/api/hcp/{id}` | Delete HCP |

### Interaction Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/interactions/` | List all interactions |
| GET | `/api/interactions/{id}` | Get single interaction |
| POST | `/api/interactions/` | Create interaction |
| PUT | `/api/interactions/{id}` | Update interaction |
| DELETE | `/api/interactions/{id}` | Delete interaction |

### AI Agent Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/agent/chat` | Send message to AI agent |
| GET | `/api/agent/session/{id}/history` | Get chat history |
| DELETE | `/api/agent/session/{id}` | Clear session |

#### Chat Request Body
```json
{
  "message": "Met Dr. Sharma, discussed Cardio-X efficacy, positive response",
  "session_id": "uuid-optional",
  "interaction_id": null
}
```

#### Chat Response
```json
{
  "response": "✅ Interaction logged. Summary: ...",
  "tool_used": "log_interaction",
  "data": { "hcp_name": "Dr. Sharma", "sentiment": "Positive", ... },
  "session_id": "abc-123"
}
```

---

## LangGraph Agent Tools

| Tool | Trigger Intent | Input | Output |
|------|---------------|-------|--------|
| `log_interaction` | Log/record a meeting | Natural language description | Structured JSON + DB save |
| `edit_interaction` | Edit/update existing record | interaction_id + NL instruction | Updated fields |
| `search_hcp` | Find a doctor/HCP | Name or specialty | List of matching HCPs |
| `suggest_followup` | Get follow-up ideas | Interaction summary | 3 specific suggestions |
| `analyze_sentiment` | Analyze HCP sentiment | Interaction notes | Sentiment + confidence + reasoning |

**Agent Flow:** `START → Router Node → Tool Node → Response Node → END`

The Router uses Groq to classify user intent, then routes to the correct tool. All tools return to the Response Node which formats the final reply.

---

## Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DATABASE_URL` | ✅ | PostgreSQL async connection string | `postgresql+asyncpg://user:pass@localhost:5432/aivoa_crm` |
| `GROQ_API_KEY` | ✅ | Groq API key for LLM calls | `gsk_...` |
| `JWT_SECRET_KEY` | ✅ | Secret for JWT tokens | `change-in-production` |
| `VITE_API_URL` | Frontend | Backend base URL | `http://localhost:8000` |

---

## Project Structure

```
aivoa-crm/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app, CORS, lifespan, seeding
│   │   ├── config.py            # Pydantic settings
│   │   ├── database.py          # SQLAlchemy async engine
│   │   ├── models/              # SQLAlchemy ORM models
│   │   ├── schemas/             # Pydantic request/response schemas
│   │   ├── routers/             # FastAPI route handlers
│   │   ├── agent/               # LangGraph agent
│   │   │   ├── graph.py         # StateGraph with 5 tool nodes
│   │   │   ├── state.py         # AgentState TypedDict
│   │   │   ├── prompts.py       # All Groq system prompts
│   │   │   └── tools/           # 5 agent tools
│   │   └── services/
│   │       └── groq_service.py  # Groq API client
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── store/               # Redux Toolkit store + slices
│   │   ├── components/
│   │   │   ├── Layout/          # Sidebar navigation
│   │   │   └── LogInteractionScreen/  # Main feature screen
│   │   ├── services/api.js      # Axios API client
│   │   └── hooks/useAgent.js    # AI agent React hook
│   ├── Dockerfile
│   └── nginx.conf
└── docker-compose.yml
```

---

## Screenshots

> _Add screenshots of the application here_

- `docs/screenshots/log-interaction-screen.png` — Split panel main screen
- `docs/screenshots/ai-chat-autofill.png` — AI chat auto-filling the form
- `docs/screenshots/sentiment-analysis.png` — Sentiment analysis result

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Redux Toolkit, Vite, TailwindCSS |
| Backend | Python 3.11, FastAPI, SQLAlchemy (async) |
| AI Agent | LangGraph StateGraph, LangChain-Groq |
| LLM | Groq — gemma2-9b-it (fallback: llama-3.3-70b) |
| Database | PostgreSQL 15 |
| Deployment | Docker Compose, Nginx |

---

## License

MIT © AIVOA Life Sciences❤️
=======
# aivoa-crm
>>>>>>> db55ec45ab2ab96a0c201da65b080ad4c13690a3
