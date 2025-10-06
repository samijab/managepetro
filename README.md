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

## Git Workflow

### Initial Clone

```bash
git clone <repository-url>
cd "ISSP Project"
```

### Working with devmain Branch

The **devmain** branch is our default development branch.

```bash
# Switch to devmain (if not already there)
git checkout devmain

# Pull latest changes before starting work
git pull origin devmain

# Create a feature branch for your work
git checkout -b feature/your-feature-name

# Make your changes, then commit
git add .
git commit -m "Add your descriptive commit message"

# Push your feature branch
git push origin feature/your-feature-name

# Create a Pull Request to merge into devmain
```

### Daily Workflow

```bash
# Start of day - sync with latest devmain
git checkout devmain
git pull origin devmain

# Create/switch to your feature branch
git checkout -b feature/new-feature
# or: git checkout feature/existing-feature

# After making changes
git add .
git commit -m "Descriptive commit message"
git push origin feature/your-feature-name
```

### Branch Strategy

- **devmain** - Main development branch (default)
- **feature/\*** - Feature branches for new development
- **fix/\*** - Hotfix branches for bug fixes
- **main** - Production branch (stable releases only)

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

## Contributing

1. **Always work on feature branches** - Never commit directly to devmain
2. **Pull latest devmain** before creating new features
3. **Create descriptive commit messages**
4. **Test your changes** before pushing
5. **Create Pull Requests** for code review before merging

### Commit Message Format

```
type: brief description

- More detailed explanation if needed
- Use bullet points for multiple changes
```

Examples:

- `feat: add route optimization form validation`
- `fix: resolve mobile navigation menu overlay issue`
- `refactor: simplify header component logo styling`
- `docs: update API documentation for route endpoints`
