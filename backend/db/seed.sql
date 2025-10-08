USE manage_petro;

-- Example stations
INSERT INTO stations (code, name, lat, lon, capacity_liters, current_level_liters)
VALUES
('S1', 'Station X', 32.81, -96.75, 120000, 25000),
('S2', 'Station Y', 32.90, -96.85, 100000, 15000);

-- Example trucks
INSERT INTO trucks (code, plate, capacity_liters, fuel_level_percent)
VALUES
('T12', 'ABC123', 30000, 80),
('T34', 'XYZ789', 25000, 65);

-- Example deliveries
INSERT INTO deliveries (truck_id, station_id, volume_liters, delivery_date)
VALUES
(1, 1, 28000, NOW() + INTERVAL 1 DAY),  -- delivery scheduled for tomorrow
(2, 2, 24000, NOW() + INTERVAL 2 DAY);  -- delivery scheduled in 2 days
