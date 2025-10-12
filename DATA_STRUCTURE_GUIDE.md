# Data Structure Guide

## Overview

This guide explains how the data structures are organized in the ManagePetro application. The architecture is designed so that **changes to data structures require minimal file edits**.

## Architecture Principles

### Single Source of Truth

Each data structure has a **single source of truth**:

1. **Backend Models** (`backend/models/data_models.py`) - Define data structure and transformations
2. **Frontend Types** (`frontend/src/services/api.js`) - Document expected data shape via JSDoc
3. **Single Transformation Point** - Data is transformed in one place on each side

## Backend Structure

### Core Data Models (`backend/models/data_models.py`)

All data models follow this pattern:

```python
@dataclass
class DataModel:
    """Data fields"""
    field1: type
    field2: type
    
    def to_api_dict(self) -> Dict[str, Any]:
        """Convert to API response format"""
        return {...}
```

#### Key Models

1. **WeatherData** - Weather information
2. **StationData** - Fuel station information
3. **DeliveryData** - Delivery information
4. **TruckData** - Truck information
5. **RouteOptimizationResponse** - Complete route optimization response

### Centralized Response Model

The `RouteOptimizationResponse` class is the **single source of truth** for route optimization API responses:

```python
class RouteOptimizationResponse:
    """
    Centralized data model for route optimization API responses.
    
    If the API response structure needs to change, only this class
    and the frontend transformation need to be updated.
    """
    
    def to_api_dict(self) -> Dict[str, Any]:
        """
        Convert to standardized API response format.
        This is the ONLY method that defines the API response structure.
        """
        return {
            "route_summary": self.route_summary,
            "directions": self.directions,
            # ... other fields
        }
```

### Making Changes

**To add a new field to route optimization:**

1. Update `RouteOptimizationResponse.__init__()` to accept the new field
2. Update `RouteOptimizationResponse.to_api_dict()` to include the new field
3. Update `RouteOptimizationResponse.from_parsed_data()` if needed for data processing
4. Update frontend transformation (see below)

## Frontend Structure

### Single API File (`frontend/src/services/api.js`)

The frontend has **one API file** that handles:

1. **HTTP Client Configuration** - Axios setup with interceptors
2. **Type Definitions** - JSDoc typedefs documenting data structures
3. **HTTP Helpers** - Generic GET, POST, PUT, etc. methods
4. **Domain Methods** - getTrucks(), getStations(), etc.
5. **Data Transformation** - `transformRouteResponse()` method
6. **Business Logic** - Route-specific methods like `optimizeRoute()`

### Data Transformation Layer

The `transformRouteResponse()` method is the **single transformation point** between backend and frontend:

```javascript
/**
 * Transform API response to standardized frontend format.
 * 
 * This is the single transformation layer between backend API and frontend.
 * If backend data structure changes, update this method accordingly.
 */
transformRouteResponse: (apiData) => {
  const routeSummary = apiData.route_summary || {};
  // ... extract data
  
  return {
    eta: { /* frontend format */ },
    instructions: [ /* frontend format */ ],
    // ... other fields
  };
}
```

### Making Changes

**To add a new field to route data:**

1. Update JSDoc typedef `RouteOptimizationResponse` to document backend structure
2. Update JSDoc typedef `TransformedRouteData` to document frontend structure
3. Update `Api.transformRouteResponse()` to transform the new field
4. Update components that need to use the new field

## Example: Adding a New Field

Let's say we want to add `estimated_tolls` to route optimization:

### Backend Changes

1. Update `backend/services/llm_service.py` to extract tolls from AI response
2. Update `backend/models/data_models.py`:

```python
# In RouteOptimizationResponse.__init__
def __init__(
    self,
    # ... existing params
    estimated_tolls: Dict[str, Any],
):
    # ... existing assignments
    self.estimated_tolls = estimated_tolls

# In RouteOptimizationResponse.to_api_dict
def to_api_dict(self) -> Dict[str, Any]:
    return {
        # ... existing fields
        "estimated_tolls": self.estimated_tolls,
    }

# In RouteOptimizationResponse.from_parsed_data
@classmethod
def from_parsed_data(cls, ..., toll_info):
    return cls(
        # ... existing params
        estimated_tolls=toll_info,
    )
```

### Frontend Changes

Update `frontend/src/services/api.js`:

```javascript
// 1. Add to typedef
/**
 * @typedef {Object} RouteOptimizationResponse
 * @property {Object} estimated_tolls - Estimated toll costs
 */

/**
 * @typedef {Object} TransformedRouteData
 * @property {Object} estimatedTolls - Estimated toll costs
 */

// 2. Update transformation
transformRouteResponse: (apiData) => {
  const estimatedTolls = apiData.estimated_tolls || {};
  
  return {
    // ... existing fields
    estimatedTolls: estimatedTolls,
  };
}
```

That's it! Only 2 files need to be edited.

## Benefits of This Structure

1. **Minimal Changes** - Adding/modifying fields requires editing only 2 files
2. **Single Responsibility** - Each component has one clear purpose
3. **Type Safety** - JSDoc provides IDE autocomplete and type checking
4. **Consistency** - All data flows through the same transformation points
5. **Maintainability** - Easy to understand where data comes from and how it's transformed
6. **Testability** - Transformation logic is isolated and easy to test

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────┐
│                    Backend                          │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Database Query → DataModel.to_api_dict()          │
│                          ↓                          │
│  RouteOptimizationResponse.from_parsed_data()      │
│                          ↓                          │
│  RouteOptimizationResponse.to_api_dict()           │
│                          ↓                          │
│                    API Endpoint                     │
│                          ↓                          │
└──────────────────────────┼──────────────────────────┘
                           │ JSON Response
┌──────────────────────────▼──────────────────────────┐
│                    Frontend                         │
├─────────────────────────────────────────────────────┤
│                                                     │
│  API Call → Api.transformRouteResponse()           │
│                          ↓                          │
│              Frontend Data Structure                │
│                          ↓                          │
│                  React Components                   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## Migration Notes

### Previous Structure

- Backend: Data transformation scattered in `llm_service.py`
- Frontend: Two separate files (`api.js` and `routeService.js`)
- Changes required editing multiple locations

### New Structure

- Backend: Centralized in `RouteOptimizationResponse` class
- Frontend: Single `api.js` file with all API logic
- Changes require editing only the transformation methods

## Questions?

If you need to modify the data structure and are unsure where to start:

1. Identify if the change is backend data structure or just frontend display format
2. For backend structure changes: Update `data_models.py` first
3. For frontend display changes: Update `api.js` transformation only
4. Always maintain the type definitions (JSDoc) to document the contract
