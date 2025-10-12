DOCKER MYSQL DB:
Database will populate with some mock data, and run locally

No other integration currently

SETUP:

1. Install Docker desktop
2. Enable WSL if prompted
3. Restart computer -> docker should be running in the system tray

COMMANDS:
While inside /backend:
To start database (will populate if it hasnt been yet) run `docker compose up -d`
To stop the database `docker compose down`
To stop the database and remove data in it `docker compose down -v`
To check docker running `docker ps`
To access MySQL `docker exec -it manage-petro-mysql mysql -ump_app -pdevpass manage_petro`

## 📁 Architecture Overview

```
backend/
├── models/
│   └── data_models.py           # 🎯 Core data structures
├── services/
│   ├── llm_service.py          # 🤖 AI route optimization
│   ├── prompt_service.py       # 📝 AI prompt templates
│   └── api_utils.py            # 🌐 External API calls
├── prompts/
│   └── comprehensive_route_optimization.md  # 🎨 AI instructions
├── db/
│   └── schema.sql              # 🗄️ Database structure
├── main.py                     # 🚪 API endpoints
├── weather_collector.py       # 🌤️ Background weather collection
└── docker-compose.yml         # 🐳 Database setup
```

## 🤖 AI System Components

### 1. **Core AI Service** (`llm_service.py`)

**What it does:** Orchestrates the entire AI optimization process

**Key methods to modify:**

```python
async def optimize_route(from_location, to_location, llm_model):
    # 🎯 MODIFY: Change data sources or add new ones
    db_data = self._get_database_data(from_location, to_location)
    weather_data = self._get_weather_data(from_location, to_location)

    # 🎯 MODIFY: Adjust how data is formatted for AI
    prompt = self.prompt_service.format_comprehensive_prompt(...)

    # 🎯 MODIFY: Change AI model or parameters
    ai_response = await self._call_gemini(prompt, llm_model)
```

**To improve AI accuracy:**

- **Modify database queries** in `_get_database_data()` to include more/different data
- **Add new data sources** (traffic APIs, fuel prices, etc.)
- **Adjust AI parameters** in `_call_gemini()` (temperature, max_tokens)

### 2. **AI Prompt Templates** (`prompts/comprehensive_route_optimization.md`)

**What it does:** Instructions that tell the AI how to analyze data and respond

**To improve AI responses:**

```markdown
# 🎯 MODIFY THIS FILE to change how AI thinks about routes

## Current sections:

- Route analysis instructions
- Data interpretation guidelines
- Response format requirements

## To improve:

1. Add more specific instructions for your use case
2. Include examples of good vs bad responses
3. Add industry-specific terminology
4. Specify exact output formats
```

### 3. **Prompt Service** (`prompt_service.py`)

**What it does:** Combines templates with real data to create AI prompts

**Key methods to modify:**

```python
def _format_stations_data(self, stations):
    # 🎯 MODIFY: Change how fuel station data is presented to AI

def _format_weather_data(self, weather):
    # 🎯 MODIFY: Add more weather factors (visibility, road conditions)

def _format_historical_data(self, deliveries):
    # 🎯 MODIFY: Include delivery efficiency metrics, driver performance
```

## 🛠️ Common Modifications

### Adding New Data Sources

**1. Add to Data Models** (`models/data_models.py`):

```python
@dataclass
class TrafficData:
    """New data structure for traffic info"""
    congestion_level: str
    average_speed: float
    incidents: List[str]

    def to_api_dict(self) -> Dict[str, Any]:
        return {
            "congestion": self.congestion_level,
            "speed": f"{self.average_speed} km/h",
            "incidents": len(self.incidents)
        }
```

**2. Fetch Data** (`services/api_utils.py`):

```python
def get_traffic_data(route_coords) -> TrafficData:
    """Call traffic API and return standardized data"""
    # Your API call here
    return TrafficData.from_api_response(data)
```

**3. Integrate in AI Service** (`llm_service.py`):

```python
def optimize_route(self, from_location, to_location, llm_model):
    db_data = self._get_database_data(from_location, to_location)
    weather_data = self._get_weather_data(from_location, to_location)
    traffic_data = self._get_traffic_data(from_location, to_location)  # 🆕 ADD

    prompt = self.prompt_service.format_comprehensive_prompt(
        # ... existing params ...
        traffic_data=traffic_data,  # 🆕 ADD
    )
```

**4. Update Prompt Template**:

```markdown
## Traffic Analysis

Current traffic conditions: {traffic_data}

Consider these factors:

- Congestion levels on major routes
- Accident reports and road closures
- Historical traffic patterns
```

### Improving AI Response Parsing

**Modify parsing methods** in `llm_service.py`:

```python
def _extract_route_summary_from_ai(self, ai_response, from_weather, to_weather):
    # 🎯 ADD: Parse new fields from AI response
    if "Fuel Efficiency:" in line:
        summary["fuel_efficiency"] = line.split("Fuel Efficiency:")[1].strip()

    if "Carbon Footprint:" in line:
        summary["carbon_footprint"] = line.split("Carbon Footprint:")[1].strip()
```

### Adjusting AI Behavior

**1. Change AI Model** (in any API call):

```python
# Current: "gemini-2.5-flash" (fast, less detailed)
# Options: "gemini-2.5-pro" (slower, more detailed)
result = await llm_service.optimize_route(from_location, to_location, "gemini-2.5-pro")
```

**2. Adjust AI Parameters**:

```python
def _call_gemini(self, prompt, model):
    response = await self.client.aio.models.generate_content(
        model=model,
        contents=prompt,
        config=types.GenerateContentConfig(
            temperature=0.1,        # 🎯 LOWER = more consistent, HIGHER = more creative
            max_output_tokens=3000, # 🎯 INCREASE for longer responses
        ),
    )
```

## 🗄️ Database Operations

### Adding New Database Tables

**1. Update Schema** (`db/schema.sql`):

```sql
CREATE TABLE fuel_prices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    station_id INT,
    price_per_liter DECIMAL(5,3),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (station_id) REFERENCES stations(id)
);
```

**2. Create Data Model** (`models/data_models.py`):

```python
@dataclass
class FuelPriceData:
    id: int
    station_id: int
    price_per_liter: float
    updated_at: datetime
```

**3. Query in LLM Service**:

```python
def _get_database_data(self, from_location, to_location):
    # Add to existing queries
    prices_query = """
        SELECT id, station_id, price_per_liter, updated_at
        FROM fuel_prices
        WHERE updated_at >= DATE_SUB(NOW(), INTERVAL 1 DAY)
    """
    cursor.execute(prices_query)
    prices_raw = cursor.fetchall()
    prices = [FuelPriceData(**row) for row in prices_raw]
```

## 🌤️ Weather Integration

The system collects weather data in two ways:

### Real-time Weather (for AI analysis)

- **File:** `services/api_utils.py`
- **Function:** `get_weather(city)`
- **Usage:** Called during route optimization

### Background Weather Collection

- **File:** `weather_collector.py`
- **Purpose:** Stores historical weather data
- **Run:** `python weather_collector.py`

**To modify weather factors:**

```python
# In prompt_service.py
def _format_weather_data(self, weather):
    formatted += f"Visibility: {weather.visibility} km\n"      # 🆕 ADD
    formatted += f"Road Conditions: {weather.road_state}\n"    # 🆕 ADD
    formatted += f"Wind Direction: {weather.wind_dir}\n"       # 🆕 ADD
```

## 🔧 Environment Variables

Create `.env` file in backend directory:

```env
# API Keys
WEATHER_API_KEY=your_weather_api_key
TOMTOM_API_KEY=your_tomtom_api_key
gemenikey=your_gemini_api_key

# Database (for production)
DB_HOST=localhost
DB_NAME=manage_petro
DB_USER=mp_app
DB_PASS=devpass
```
