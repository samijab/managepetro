CREATE DATABASE IF NOT EXISTS manage_petro;
USE manage_petro;

-- USERS (Authentication)

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  hashed_password VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_email (email)
);

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
  current_level_liters DECIMAL(12,2),
  request_method ENUM('IoT', 'Manual') DEFAULT 'Manual',
  low_fuel_threshold DECIMAL(12,2) DEFAULT 5000
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

-- TRUCK COMPARTMENTS

CREATE TABLE IF NOT EXISTS truck_compartments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  truck_id INT NOT NULL,
  compartment_number INT NOT NULL,
  fuel_type ENUM('diesel', 'gasoline', 'propane') NOT NULL,
  capacity_liters DECIMAL(12,2) NOT NULL,
  current_level_liters DECIMAL(12,2) DEFAULT 0,
  FOREIGN KEY (truck_id) REFERENCES trucks(id),
  UNIQUE KEY unique_truck_compartment (truck_id, compartment_number)
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
);