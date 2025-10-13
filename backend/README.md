# Backend - Python FastAPI Server

> **📖 For complete setup instructions, see the main [README.md](../README.md) in the project root.**

This directory contains the Python FastAPI backend server for Manage Petro.

## Quick Start (If You've Already Done Main Setup)

1. **Start the database**:

   ```bash
   docker compose up -d
   ```

2. **Start the backend server**:

   ```bash
   fastapi dev main.py
   ```

3. **Access the API**:
   - API Server: http://localhost:8000
   - Interactive Docs: http://localhost:8000/docs

## Key Files

- `main.py` - Main FastAPI application and API routes
- `requirements.txt` - Python dependencies
- `docker-compose.yml` - MySQL database configuration
- `.env` - Your API keys and configuration (create from `.env.example`)
- `config.py` - Centralized configuration management
- `services/` - Business logic and AI integration
- `models/` - Database and API data models
- `db/` - Database schema and seed data

## Database Commands

```bash
# Start database with sample data
docker compose up -d

# Stop database (keeps data)
docker compose down

# Reset database (removes all data)
docker compose down -v

# Check if database is running
docker ps

# Access database directly
docker exec -it manage-petro-mysql mysql -ump_app -pdevpass manage_petro
```

## API Endpoints

Visit http://localhost:8000/docs when the server is running to see all available endpoints interactively.

Key endpoints:

- `/api/stations` - Fuel station management
- `/api/trucks` - Truck fleet information
- `/api/route/optimize` - AI-powered route optimization
- `/api/dispatch/optimize` - Truck dispatch optimization
- `/api/weather/{city}` - Weather information

## Environment Variables Required

Create a `.env` file with your API keys (copy from `.env.example`):

```env
WEATHER_API_KEY=your_weather_api_key
TOMTOM_API_KEY=your_tomtom_api_key
GEMINI_API_KEY=your_gemini_api_key

DB_HOST=localhost
DB_PORT=3306
DB_NAME=manage_petro
DB_USER=mp_app
DB_PASS=devpass
```

## Troubleshooting

**Database won't connect?**

- Make sure Docker Desktop is running
- Run `docker compose up -d` to start the database
- Check `docker ps` to verify the container is running

**Missing module errors?**

- Run `pip install -r requirements.txt`

**API key errors?**

- Check your `.env` file exists and has valid API keys
- The server will show specific missing variables on startup

**Port 8000 already in use?**

- Stop other Python/FastAPI servers
- Or change the port in `main.py`
