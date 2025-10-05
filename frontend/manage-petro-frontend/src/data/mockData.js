/**
 * Mock data for development - will be replaced by API calls
 */

export const mockRouteData = {
  eta: {
    arrival: "2:45 PM",
    duration: "1h 23m",
    distance: "67.2 km",
  },
  instructions: [
    {
      id: 1,
      text: "Head north on Main Street toward Highway 1",
      distance: "0.5 km",
    },
    {
      id: 2,
      text: "Turn right onto Highway 1 East",
      distance: "15.2 km",
    },
    {
      id: 3,
      text: "Take exit 42 for Industrial Boulevard",
      distance: "0.8 km",
    },
    {
      id: 4,
      text: "Turn left onto Industrial Boulevard",
      distance: "2.1 km",
    },
    {
      id: 5,
      text: "Destination will be on your right",
      distance: "0.3 km",
    },
  ],
};

export const mockTrucks = [
  {
    truck_id: "truck-001",
    plate_number: "CA-12345",
    capacity_liters: 25000,
    current_location: "Vancouver, BC",
  },
  {
    truck_id: "truck-002",
    plate_number: "CA-67890",
    capacity_liters: 30000,
    current_location: "Calgary, AB",
  },
];

export const mockStations = [
  {
    station_id: "station-001",
    name: "Downtown Fuel Station",
    city: "Vancouver",
    country: "Canada",
    demand_liters: 15000,
  },
  {
    station_id: "station-002",
    name: "Highway 1 Gas Station",
    city: "Burnaby",
    country: "Canada",
    demand_liters: 8000,
  },
  {
    station_id: "station-003",
    name: "Airport Service Center",
    city: "Richmond",
    country: "Canada",
    demand_liters: 25000,
  },
  {
    station_id: "station-004",
    name: "Industrial District Fuel",
    city: "Surrey",
    country: "Canada",
    demand_liters: 12000,
  },
  {
    station_id: "station-005",
    name: "Mountain View Station",
    city: "North Vancouver",
    country: "Canada",
    demand_liters: 9000,
  },
];
