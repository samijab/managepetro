# Manage Petro – ISSP Project

Monorepo with a React (Vite) frontend and a Python FastAPI backend.

## Prerequisites

- Node.js 18+ and npm
- Python 3.10+ and pip
- Git

## Project Structure

```
ISSP Project/
├─ backend/                 # FastAPI app (main.py, requirements.txt)
└─ frontend/
   └─ manage-petro-frontend # Vite + React app
```

## One-time Setup

### Backend (FastAPI)

```powershell
cd "backend"           # macOS/Linux: source venv/bin/activate
pip install -r requirements.txt      # requirements.txt contains: fastapi[standard]
```

### Frontend (Vite + React)

```powershell
cd "frontend/manage-petro-frontend"
npm install
```

## Run in Development

Open two terminals.

1. Backend (FastAPI)

```powershell
cd "backend"
fastapi dev main.py
# API: http://localhost:8000  |  Docs: http://localhost:8000/docs
```

2. Frontend (Vite)

```powershell
cd "frontend/manage-petro-frontend"
npm run dev
# App: http://localhost:3000
```
