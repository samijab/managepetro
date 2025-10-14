USE manage_petro;

-- Clear existing data (safe re-seeding)
DELETE FROM weather_data WHERE id > 0;
DELETE FROM station_fuel_levels WHERE id > 0;
DELETE FROM deliveries WHERE id > 0;
DELETE FROM truck_compartments WHERE id > 0;
DELETE FROM trucks WHERE id > 0;
DELETE FROM stations WHERE id > 0;
DELETE FROM users WHERE id > 0;

-- Reset AUTO_INCREMENT counters
ALTER TABLE weather_data AUTO_INCREMENT = 1;
ALTER TABLE station_fuel_levels AUTO_INCREMENT = 1;
ALTER TABLE deliveries AUTO_INCREMENT = 1;
ALTER TABLE truck_compartments AUTO_INCREMENT = 1;
ALTER TABLE trucks AUTO_INCREMENT = 1;
ALTER TABLE stations AUTO_INCREMENT = 1;
ALTER TABLE users AUTO_INCREMENT = 1;

INSERT INTO stations (code, name, lat, lon, city, region, fuel_type, capacity_liters, current_level_liters, request_method, low_fuel_threshold)
VALUES
('S1', 'FuelLogic Toronto', 43.6510, -79.3470, 'Toronto', 'ON', 'diesel', 120000, 25000, 'IoT', 30000),
('S2', 'FuelLogic Vancouver', 49.2827, -123.1207, 'Vancouver', 'BC', 'gasoline', 95000, 18000, 'IoT', 25000),
('S3', 'FuelLogic Calgary', 51.0447, -114.0719, 'Calgary', 'AB', 'diesel', 110000, 40000, 'Manual', 35000),
('S4', 'FuelLogic Edmonton', 53.5461, -113.4938, 'Edmonton', 'AB', 'propane', 105000, 35000, 'Manual', 30000),
('S5', 'FuelLogic Winnipeg', 49.8951, -97.1384, 'Winnipeg', 'MB', 'diesel', 115000, 27000, 'IoT', 35000),
('S6', 'FuelLogic Ottawa', 45.4215, -75.6992, 'Ottawa', 'ON', 'gasoline', 98000, 22000, 'IoT', 28000),
('S7', 'FuelLogic Montreal', 45.5017, -73.5673, 'Montreal', 'QC', 'diesel', 130000, 41000, 'Manual', 40000),
('S8', 'FuelLogic Halifax', 44.6488, -63.5752, 'Halifax', 'NS', 'gasoline', 90000, 20000, 'IoT', 25000);

INSERT INTO trucks (code, plate, capacity_liters, fuel_level_percent, fuel_type, status)
VALUES
('T01', 'AB-1421', 32000, FLOOR(RAND()*50)+50, 'diesel', 'active'),
('T02', 'BC-4422', 30000, FLOOR(RAND()*50)+50, 'gasoline', 'active'),
('T03', 'QC-9832', 31000, FLOOR(RAND()*50)+50, 'diesel', 'maintenance'),
('T04', 'ON-1742', 34000, FLOOR(RAND()*50)+50, 'propane', 'active'),
('T05', 'MB-2344', 29000, FLOOR(RAND()*50)+50, 'diesel', 'offline'),
('T06', 'AB-8732', 31000, FLOOR(RAND()*50)+50, 'gasoline', 'active'),
('T07', 'NS-1289', 33000, FLOOR(RAND()*50)+50, 'diesel', 'active'),
('T08', 'ON-7742', 30000, FLOOR(RAND()*50)+50, 'propane', 'active');

-- Truck compartments
INSERT INTO truck_compartments (truck_id, compartment_number, fuel_type, capacity_liters, current_level_liters)
VALUES
-- T01 (diesel truck, 32000L total)
(1, 1, 'diesel', 16000, 14000),
(1, 2, 'diesel', 16000, 15000),
-- T02 (gasoline truck, 30000L total)
(2, 1, 'gasoline', 15000, 13000),
(2, 2, 'gasoline', 15000, 12000),
-- T03 (diesel truck, 31000L total)
(3, 1, 'diesel', 10000, 8000),
(3, 2, 'diesel', 11000, 9000),
(3, 3, 'diesel', 10000, 8500),
-- T04 (propane truck, 34000L total)
(4, 1, 'propane', 17000, 16000),
(4, 2, 'propane', 17000, 15500),
-- T05 (diesel truck, 29000L total)
(5, 1, 'diesel', 9500, 7000),
(5, 2, 'diesel', 10000, 8000),
(5, 3, 'diesel', 9500, 7500),
-- T06 (gasoline truck, 31000L total)
(6, 1, 'gasoline', 10000, 9000),
(6, 2, 'gasoline', 11000, 10000),
(6, 3, 'gasoline', 10000, 9500),
-- T07 (diesel truck, 33000L total)
(7, 1, 'diesel', 11000, 10000),
(7, 2, 'diesel', 11000, 10500),
(7, 3, 'diesel', 11000, 10000),
-- T08 (propane truck, 30000L total)
(8, 1, 'propane', 15000, 14000),
(8, 2, 'propane', 15000, 13500);

INSERT INTO deliveries (truck_id, station_id, volume_liters, delivery_date, status)
VALUES
(1, 1, 28000, NOW() + INTERVAL FLOOR(RAND()*7) DAY, 'planned'),
(2, 2, 25000, NOW() + INTERVAL FLOOR(RAND()*7) DAY, 'planned'),
(3, 3, 26000, NOW() + INTERVAL FLOOR(RAND()*7) DAY, 'enroute'),
(4, 4, 27000, NOW() + INTERVAL FLOOR(RAND()*7) DAY, 'planned'),
(5, 5, 31000, NOW() + INTERVAL FLOOR(RAND()*7) DAY, 'planned'),
(6, 6, 33000, NOW() + INTERVAL FLOOR(RAND()*7) DAY, 'delivered'),
(7, 7, 28000, NOW() + INTERVAL FLOOR(RAND()*7) DAY, 'planned'),
(8, 8, 30000, NOW() + INTERVAL FLOOR(RAND()*7) DAY, 'canceled'),
(1, 5, 22000, NOW() + INTERVAL FLOOR(RAND()*7) DAY, 'planned'),
(3, 6, 29000, NOW() + INTERVAL FLOOR(RAND()*7) DAY, 'planned');

INSERT INTO station_fuel_levels (station_id, recorded_at, fuel_level_liters)
VALUES
(1, NOW() - INTERVAL 3 DAY, 30000),
(1, NOW() - INTERVAL 2 DAY, 27000),
(1, NOW() - INTERVAL 1 DAY, 25000),
(2, NOW() - INTERVAL 3 DAY, 20000),
(2, NOW() - INTERVAL 2 DAY, 19000),
(2, NOW() - INTERVAL 1 DAY, 18000),
(3, NOW() - INTERVAL 3 DAY, 36000),
(3, NOW() - INTERVAL 2 DAY, 33000),
(3, NOW() - INTERVAL 1 DAY, 30000),
(4, NOW() - INTERVAL 3 DAY, 38000),
(4, NOW() - INTERVAL 2 DAY, 36000),
(4, NOW() - INTERVAL 1 DAY, 35000),
(5, NOW() - INTERVAL 3 DAY, 28000),
(5, NOW() - INTERVAL 2 DAY, 26000),
(5, NOW() - INTERVAL 1 DAY, 25000);
