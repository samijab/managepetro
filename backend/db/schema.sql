CREATE DATABASE IF NOT EXISTS manage_petro;
USE manage_petro;

-- Fuel  Stations
CREATE TABLE stations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(32) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  lat DECIMAL(9,6),
  lon DECIMAL(9,6),
  capacity_liters DECIMAL(12,2),
  current_level_liters DECIMAL(12,2)
);

-- Trucks
CREATE TABLE trucks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(32) UNIQUE NOT NULL,
  plate VARCHAR(32),
  capacity_liters DECIMAL(12,2),
  fuel_level_percent TINYINT
);

-- Deliveries
CREATE TABLE deliveries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  truck_id INT,
  station_id INT,
  volume_liters DECIMAL(12,2),
  delivery_date DATETIME,
  FOREIGN KEY (truck_id) REFERENCES trucks(id),
  FOREIGN KEY (station_id) REFERENCES stations(id)
);
