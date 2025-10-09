USE manage_petro;

INSERT INTO stations (code, name, lat, lon, city, region, fuel_type, capacity_liters, current_level_liters)
VALUES
('S1', 'FuelLogic Toronto', 43.6510, -79.3470, 'Toronto', 'ON', 'diesel', 120000, 25000),
('S2', 'FuelLogic Vancouver', 49.2827, -123.1207, 'Vancouver', 'BC', 'gasoline', 95000, 18000),
('S3', 'FuelLogic Calgary', 51.0447, -114.0719, 'Calgary', 'AB', 'diesel', 110000, 40000),
('S4', 'FuelLogic Edmonton', 53.5461, -113.4938, 'Edmonton', 'AB', 'propane', 105000, 35000),
('S5', 'FuelLogic Winnipeg', 49.8951, -97.1384, 'Winnipeg', 'MB', 'diesel', 115000, 27000),
('S6', 'FuelLogic Ottawa', 45.4215, -75.6992, 'Ottawa', 'ON', 'gasoline', 98000, 22000),
('S7', 'FuelLogic Montreal', 45.5017, -73.5673, 'Montreal', 'QC', 'diesel', 130000, 41000),
('S8', 'FuelLogic Halifax', 44.6488, -63.5752, 'Halifax', 'NS', 'gasoline', 90000, 20000);

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
