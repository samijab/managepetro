CREATE DATABASE IF NOT EXISTS manage_petro;
USE manage_petro;

-- STATIONS

CREATE TABLE stations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(32) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  lat DECIMAL(9,6),
  lon DECIMAL(9,6),
  city VARCHAR(100),
  region VARCHAR(100),
  fuel_type ENUM('diesel', 'gasoline', 'propane') DEFAULT 'diesel',
  capacity_liters DECIMAL(12,2),
  current_level_liters DECIMAL(12,2)
);

-- TRUCKS

CREATE TABLE trucks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(32) UNIQUE NOT NULL,
  plate VARCHAR(32),
  capacity_liters DECIMAL(12,2),
  fuel_level_percent TINYINT,
  fuel_type ENUM('diesel', 'gasoline', 'propane') DEFAULT 'diesel',
  status ENUM('active', 'maintenance', 'offline') DEFAULT 'active'
);

-- DELIVERIES
CREATE TABLE deliveries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  truck_id INT,
  station_id INT,
  volume_liters DECIMAL(12,2),
  delivery_date DATETIME,
  status ENUM('planned', 'enroute', 'delivered', 'canceled') DEFAULT 'planned',
  FOREIGN KEY (truck_id) REFERENCES trucks(id),
  FOREIGN KEY (station_id) REFERENCES stations(id)
);

-- STATION FUEL LEVELS

CREATE TABLE station_fuel_levels (
  id INT AUTO_INCREMENT PRIMARY KEY,
  station_id INT,
  recorded_at DATETIME DEFAULT NOW(),
  fuel_level_liters DECIMAL(12,2),
  FOREIGN KEY (station_id) REFERENCES stations(id)
);

-- WEATHER

CREATE TABLE IF NOT EXISTS weather_data (
  id INT AUTO_INCREMENT PRIMARY KEY,
  city VARCHAR(100),
  temperature FLOAT,
  condition TEXT,
  wind FLOAT,
  humidity FLOAT,
  collected_at TIMESTAMP
)