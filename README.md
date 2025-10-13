# Manage Petro Setup Guide

AI-powered fuel delivery management system with React frontend and Python backend.

## Prerequisites

**⚠️ Install these first before continuing:**

1. **Git** - Download from https://git-scm.com/downloads and install
2. **Node.js 18+** - Download from https://nodejs.org and install (this includes npm)
3. **Python 3.10+** - Download from https://python.org/downloads
   - ⚠️ **IMPORTANT on Windows**: Check "Add Python to PATH" during installation
4. **Docker Desktop** - Download from https://www.docker.com/products/docker-desktop
   - After installing, restart your computer if prompted
   - Open Docker Desktop and wait for it to fully start (you'll see a whale icon)

**How to test if installed correctly:**

- Open a terminal/command prompt and type: `git --version`, `node --version`, `python --version`
- All should show version numbers (not error messages)

## Step-by-Step Setup

### Step 1: Download the Project

**📍 Where to run:** Any folder on your computer

1. **Open a terminal/command prompt:**

   - Windows: Right-click in a folder → "Open in Terminal" or "Open PowerShell here"
   - Mac: Right-click in Finder → "New Terminal at Folder"
   - Linux: Right-click → "Open in Terminal"

2. **Download the project:**
   ```bash
   git clone <repository-url>
   cd "ISSP Project"
   ```

### Step 2: Start the Database

**📍 Where to run:** Inside the "ISSP Project" folder you just created

1. **Navigate to backend folder:**
   ```bash
   cd backend
   ```
2. **Make sure Docker Desktop is running** (check for whale icon in system tray)

3. **Start the database:**
   ```bash
   docker compose up -d
   ```
   **What this does:** Downloads and starts a MySQL database with sample data
   **First time:** Takes 3-5 minutes to download
   **Success:** You should see "Container manage-petro-mysql Started"

### Step 3: Get Your API Keys (Free!)

**📍 Where to run:** Still in the backend folder

1. **Copy the template file:**

   ```bash
   # Windows users:
   copy .env.example .env

   # Mac/Linux users:
   cp .env.example .env
   ```

2. **Get your free API keys:**

3. **Edit the .env file:**
   - Open the `.env` file in any text editor (Notepad, VS Code, etc.)
   - Replace `your_key_here` with your actual API keys:
   ```env
   WEATHER_API_KEY=paste_weather_key_here
   TOMTOM_API_KEY=paste_tomtom_key_here
   GEMINI_API_KEY=paste_gemini_key_here
   ```
   - Save the file

### Step 4: Setup Backend (Python)

**📍 Where to run:** Still in the backend folder

```bash
pip install -r requirements.txt
```

**What this does:** Downloads all Python packages the app needs
**Success:** You should see "Successfully installed..." messages

### Step 5: Setup Frontend (React)

**📍 Where to run:** Need to navigate to frontend folder

1. **Go back to project root, then frontend:**

   ```bash
   cd ..          # Go back to "ISSP Project" folder
   cd frontend    # Go into frontend folder
   ```

2. **Install frontend packages:**
   ```bash
   npm install
   ```
   **What this does:** Downloads all React components and tools
   **Success:** You should see a folder called "node_modules" created

## Running the Complete App

**⚠️ You need 3 separate terminals/command prompts open at the same time!**

### Terminal 1: Database

**📍 Where to run:** Navigate to backend folder

```bash
cd backend                    # From "ISSP Project" folder
docker compose up -d         # Starts database in background
```

**Success:** Shows "Container manage-petro-mysql Started"

### Terminal 2: Backend Server

**📍 Where to run:** Same backend folder (open a new terminal)

```bash
cd backend                    # Navigate here in new terminal
fastapi dev main.py          # Starts Python server
```

**Success:** Shows "Uvicorn running on http://127.0.0.1:8000"
**⚠️ Keep this terminal open!** Don't close it or the backend stops.

### Terminal 3: Frontend App

**📍 Where to run:** Frontend folder (open a 3rd terminal)

```bash
cd frontend                   # Navigate here in new terminal
npm run dev                   # Starts React app
```

**Success:** Shows "Local: http://localhost:3000/"
**⚠️ Keep this terminal open too!** Don't close it or the frontend stops.

### Open Your Browser

Go to: **http://localhost:3000**

You should see the Manage Petro application! 🎉

## Important URLs (Bookmark These)

- **Main App**: http://localhost:3000 ← This is where you work
- **API Server**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs ← Great for testing

## Troubleshooting Common Problems

### "Docker compose command not found" or database won't start

**📍 Run in backend folder:**

```bash
cd backend
docker compose down    # Stop any running database
docker compose up -d   # Start fresh
```

**If still broken:** Make sure Docker Desktop is running (whale icon visible)

### "ModuleNotFoundError" or "pip not found"

**📍 Run in backend folder:**

```bash
cd backend
pip install -r requirements.txt
```

**If pip not found:** Python wasn't installed correctly or not added to PATH

### "npm not found" or frontend errors

**📍 Run in frontend folder:**

```bash
cd frontend
npm install
```

**If npm not found:** Node.js wasn't installed correctly

### "Port already in use" errors

**Problem:** Another app is using the same port
**Solution:**

- Close other development servers, React apps, or Python servers
- Or restart your computer to clear all ports

### API key errors or "Unauthorized"

**Problem:** Your `.env` file has wrong or missing API keys
**📍 Check:** Open `backend/.env` file and verify:

- All three API keys are filled in (no "your_key_here" left)
- No extra spaces or quotes around the keys
- File is saved

### Nothing works / "I'm completely lost"

**📍 Nuclear option - start completely over:**

```bash
cd backend
docker compose down -v        # Delete everything
docker compose up -d          # Start fresh with new data
pip install -r requirements.txt
```

Then try the frontend setup again.

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

## Daily Development Workflow (For Making Changes)

**📍 Always run these commands from the main "ISSP Project" folder**

### Before You Start Working Each Day:

```bash
git checkout devmain           # Switch to main branch
git pull origin devmain        # Get latest changes from team
```

### When Starting a New Feature:

```bash
git checkout -b feature/describe-your-feature    # Create your branch
# Example: git checkout -b feature/fix-login-button
```

### When You're Done Making Changes:

```bash
git add .                                        # Add all your changes
git commit -m "feat: describe what you did"     # Save with message
git push origin feature/your-branch-name        # Send to GitHub
```

Then create a Pull Request on GitHub to merge into `devmain`

### Branch Names We Use:

- `devmain` - Main development branch (never commit directly here!)
- `feature/something` - New features you're building
- `fix/something` - Bug fixes
- `main` - Production releases (don't touch this)

## ⚠️ Important Daily Reminders

### Every Day Before You Start:

1. **Check Docker Desktop is running** (whale icon visible)
2. **Open your 3 terminals** for database, backend, frontend
3. **Pull latest changes** with `git pull origin devmain`
4. **Start all services** in the right folders

### While Developing:

- **Don't close your terminals** - the app stops working
- **Save your work often** - commit every hour or so
- **Test your changes** at http://localhost:3000 before committing

### Getting Help:

- **Error messages?** Copy the full error and ask someone
- **Can't find a command?** Make sure you're in the right folder
- **App not loading?** Check all 3 terminals are still running
- **Completely stuck?** Ask a team member for help
