# Manage Petro Setup Guide

AI-powered fuel delivery management system with React frontend and Python backend.

## Prerequisites

Install these first:

- **Git**: https://git-scm.com/downloads
- **Node.js 18+**: https://nodejs.org (includes npm)
- **Python 3.10+**: https://python.org/downloads (check "Add to PATH" on Windows)
- **Docker Desktop**: https://www.docker.com/products/docker-desktop

## Quick Setup

### 1. Clone & Navigate

```bash
git clone <repository-url>
cd "ISSP Project"
```

### 2. Start Database

```bash
cd backend
docker compose up -d
```

### 3. Configure API Keys

```bash
# Copy template
copy .env.example .env    # Windows
cp .env.example .env      # Mac/Linux
```

Edit `.env` with your API keys (get them free from these sites):

- **Weather**: https://www.weatherapi.com/
- **Maps**: https://developer.tomtom.com/
- **AI**: https://makersuite.google.com/app/apikey

```env
WEATHER_API_KEY=your_key_here
TOMTOM_API_KEY=your_key_here
GEMINI_API_KEY=your_key_here
```

### 4. Setup Backend

```bash
cd backend
pip install -r requirements.txt
```

### 5. Setup Frontend

```bash
cd frontend
npm install
```

## Running the App

**Start all three components** (open 3 terminals):

1. **Database**: `cd backend && docker compose up -d`
2. **Backend**: `cd backend && fastapi dev main.py`
3. **Frontend**: `cd frontend && npm run dev`

Then visit: http://localhost:3000

## URLs

- **App**: http://localhost:3000
- **API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## Troubleshooting

**Database won't start?**

```bash
docker compose down
docker compose up -d
```

**Module errors?**

```bash
pip install -r requirements.txt  # Backend
npm install                      # Frontend
```

**Port conflicts?** Stop other apps using ports 3000, 8000, or 3306.

**API key errors?** Check your `.env` file has valid keys from the websites above.

## Project Structure

```
ISSP Project/
├── backend/           # Python FastAPI + MySQL
│   ├── main.py       # API server
│   ├── .env          # Your API keys (create this)
│   └── services/     # AI & business logic
└── frontend/         # React app
    ├── src/          # Components & pages
    └── package.json  # Dependencies
```

## Development Workflow

1. **Pull latest changes**:

   ```bash
   git checkout devmain
   git pull origin devmain
   ```

2. **Create feature branch**:

   ```bash
   git checkout -b feature/your-feature
   ```

3. **Make changes and commit**:

   ```bash
   git add .
   git commit -m "feat: your description"
   git push origin feature/your-feature
   ```

4. **Create Pull Request** to merge into `devmain`

## Branches

- `devmain` - Main development branch
- `feature/*` - New features
- `fix/*` - Bug fixes
- `main` - Production releases

## Need Help?

1. Check Docker Desktop is running
2. Ensure all terminals stay open while developing
3. Verify you're using the correct URLs above
4. Check terminal output for specific error messages
