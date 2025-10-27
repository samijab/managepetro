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

-- =====================
-- Stations (50)
-- =====================
INSERT INTO stations (code, name, lat, lon, city, region, fuel_type, capacity_liters, current_level_liters, request_method, low_fuel_threshold) VALUES
('S1','FuelLogic Toronto',43.6510,-79.3470,'Toronto','ON','diesel',120000,25000,'IoT',30000),
('S2','FuelLogic Vancouver',49.2827,-123.1207,'Vancouver','BC','gasoline',95000,18000,'IoT',25000),
('S3','FuelLogic Calgary',51.0447,-114.0719,'Calgary','AB','diesel',110000,40000,'Manual',35000),
('S4','FuelLogic Edmonton',53.5461,-113.4938,'Edmonton','AB','propane',105000,35000,'Manual',30000),
('S5','FuelLogic Winnipeg',49.8951,-97.1384,'Winnipeg','MB','diesel',115000,27000,'IoT',35000),
('S6','FuelLogic Ottawa',45.4215,-75.6992,'Ottawa','ON','gasoline',98000,22000,'IoT',28000),
('S7','FuelLogic Montreal',45.5017,-73.5673,'Montreal','QC','diesel',130000,41000,'Manual',40000),
('S8','FuelLogic Halifax',44.6488,-63.5752,'Halifax','NS','gasoline',90000,20000,'IoT',25000),
('S9','FuelLogic Victoria',48.4284,-123.3656,'Victoria','BC','diesel',80000,18000,'IoT',26000),
('S10','FuelLogic Saskatoon',52.1332,-106.6700,'Saskatoon','SK','gasoline',85000,21000,'Manual',28000),
('S11','FuelLogic Regina',50.4452,-104.6189,'Regina','SK','diesel',82000,19000,'IoT',26000),
('S12','FuelLogic London',42.9849,-81.2453,'London','ON','gasoline',88000,23000,'Manual',28000),
('S13','FuelLogic Windsor',42.3149,-83.0364,'Windsor','ON','diesel',90000,24000,'IoT',30000),
('S14','FuelLogic Kelowna',49.8879,-119.4960,'Kelowna','BC','diesel',78000,20000,'IoT',24000),
('S15','FuelLogic Kamloops',50.6745,-120.3273,'Kamloops','BC','gasoline',76000,19000,'Manual',23000),
('S16','FuelLogic Thunder Bay',48.3809,-89.2477,'Thunder Bay','ON','diesel',80000,21000,'IoT',26000),
('S17','FuelLogic Sudbury',46.4917,-80.9930,'Sudbury','ON','gasoline',78000,20000,'Manual',23000),
('S18','FuelLogic St Johns',47.5615,-52.7126,'St John\'s','NL','diesel',74000,18000,'IoT',22000),
('S19','FuelLogic Charlottetown',46.2382,-63.1311,'Charlottetown','PE','diesel',70000,17000,'IoT',20000),
('S20','FuelLogic Red Deer',52.2681,-113.8112,'Red Deer','AB','gasoline',82000,24000,'Manual',26000),

('S21','FuelLogic Seattle',47.6062,-122.3321,'Seattle','WA','diesel',120000,30000,'IoT',32000),
('S22','FuelLogic Portland',45.5051,-122.6750,'Portland','OR','gasoline',95000,26000,'Manual',26000),
('S23','FuelLogic San Francisco',37.7749,-122.4194,'San Francisco','CA','diesel',115000,45000,'IoT',30000),
('S24','FuelLogic Los Angeles',34.0522,-118.2437,'Los Angeles','CA','gasoline',130000,52000,'IoT',35000),
('S25','FuelLogic San Diego',32.7157,-117.1611,'San Diego','CA','diesel',100000,38000,'Manual',28000),
('S26','FuelLogic Phoenix',33.4484,-112.0740,'Phoenix','AZ','gasoline',98000,25000,'IoT',26000),
('S27','FuelLogic Denver',39.7392,-104.9903,'Denver','CO','diesel',105000,30000,'Manual',30000),
('S28','FuelLogic Dallas',32.7767,-96.7970,'Dallas','TX','diesel',140000,60000,'IoT',40000),
('S29','FuelLogic Houston',29.7604,-95.3698,'Houston','TX','gasoline',135000,50000,'Manual',38000),
('S30','FuelLogic Austin',30.2672,-97.7431,'Austin','TX','diesel',100000,32000,'IoT',30000),
('S31','FuelLogic Chicago',41.8781,-87.6298,'Chicago','IL','gasoline',120000,42000,'Manual',33000),
('S32','FuelLogic Detroit',42.3314,-83.0458,'Detroit','MI','diesel',110000,35000,'IoT',30000),
('S33','FuelLogic Minneapolis',44.9778,-93.2650,'Minneapolis','MN','diesel',90000,28000,'Manual',25000),
('S34','FuelLogic St Louis',38.6270,-90.1994,'St Louis','MO','gasoline',98000,30000,'IoT',27000),
('S35','FuelLogic Kansas City',39.0997,-94.5786,'Kansas City','MO','diesel',95000,26000,'Manual',26000),
('S36','FuelLogic Atlanta',33.7490,-84.3880,'Atlanta','GA','diesel',115000,37000,'IoT',32000),
('S37','FuelLogic Miami',25.7617,-80.1918,'Miami','FL','diesel',110000,34000,'Manual',30000),
('S38','FuelLogic Orlando',28.5383,-81.3792,'Orlando','FL','gasoline',96000,24000,'IoT',26000),
('S39','FuelLogic New York',40.7128,-74.0060,'New York','NY','diesel',130000,50000,'Manual',36000),
('S40','FuelLogic Boston',42.3601,-71.0589,'Boston','MA','gasoline',100000,30000,'IoT',28000),
('S41','FuelLogic Philadelphia',39.9526,-75.1652,'Philadelphia','PA','diesel',105000,31000,'Manual',30000),
('S42','FuelLogic Baltimore',39.2904,-76.6122,'Baltimore','MD','gasoline',92000,23000,'IoT',24000),
('S43','FuelLogic Washington DC',38.9072,-77.0369,'Washington','DC','diesel',98000,26000,'Manual',25000),
('S44','FuelLogic Charlotte',35.2271,-80.8431,'Charlotte','NC','gasoline',97000,25000,'IoT',25000),
('S45','FuelLogic Raleigh',35.7796,-78.6382,'Raleigh','NC','diesel',93000,24000,'Manual',24000),
('S46','FuelLogic Nashville',36.1627,-86.7816,'Nashville','TN','gasoline',96000,26000,'IoT',25000),
('S47','FuelLogic Indianapolis',39.7684,-86.1581,'Indianapolis','IN','diesel',94000,24000,'Manual',24000),
('S48','FuelLogic Columbus',39.9612,-82.9988,'Columbus','OH','gasoline',96000,25000,'IoT',25000),
('S49','FuelLogic Pittsburgh',40.4406,-79.9959,'Pittsburgh','PA','diesel',90000,22000,'Manual',23000),
('S50','FuelLogic Las Vegas',36.1699,-115.1398,'Las Vegas','NV','gasoline',98000,26000,'IoT',26000);

-- =====================
-- Trucks (30)
-- =====================
INSERT INTO trucks (code, plate, capacity_liters, fuel_level_percent, fuel_type, status) VALUES
('T01','AB-1421',32000,FLOOR(RAND()*50)+50,'diesel','active'),
('T02','BC-4422',30000,FLOOR(RAND()*50)+50,'gasoline','active'),
('T03','QC-9832',31000,FLOOR(RAND()*50)+50,'diesel','maintenance'),
('T04','ON-1742',34000,FLOOR(RAND()*50)+50,'propane','active'),
('T05','MB-2344',29000,FLOOR(RAND()*50)+50,'diesel','offline'),
('T06','AB-8732',31000,FLOOR(RAND()*50)+50,'gasoline','active'),
('T07','NS-1289',33000,FLOOR(RAND()*50)+50,'diesel','active'),
('T08','ON-7742',30000,FLOOR(RAND()*50)+50,'propane','active'),
('T09','WA-8811',40000,FLOOR(RAND()*50)+50,'diesel','active'),
('T10','CA-2211',36000,FLOOR(RAND()*50)+50,'gasoline','active'),
('T11','TX-3344',42000,FLOOR(RAND()*50)+50,'diesel','active'),
('T12','NY-5566',38000,FLOOR(RAND()*50)+50,'diesel','active'),
('T13','FL-7788',30000,FLOOR(RAND()*50)+50,'gasoline','active'),
('T14','IL-9900',37000,FLOOR(RAND()*50)+50,'diesel','active'),
('T15','CO-1122',45000,FLOOR(RAND()*50)+50,'diesel','active'),
('T16','AZ-3344',32000,FLOOR(RAND()*50)+50,'gasoline','active'),
('T17','NV-5566',38000,FLOOR(RAND()*50)+50,'diesel','active'),
('T18','GA-7788',40000,FLOOR(RAND()*50)+50,'diesel','active'),
('T19','MO-9900',35000,FLOOR(RAND()*50)+50,'diesel','active'),
('T20','MN-1111',33000,FLOOR(RAND()*50)+50,'gasoline','active'),
('T21','OH-2222',38000,FLOOR(RAND()*50)+50,'diesel','active'),
('T22','IN-3333',36000,FLOOR(RAND()*50)+50,'diesel','active'),
('T23','NC-4444',34000,FLOOR(RAND()*50)+50,'gasoline','active'),
('T24','TN-5555',40000,FLOOR(RAND()*50)+50,'diesel','active'),
('T25','PA-6666',37000,FLOOR(RAND()*50)+50,'diesel','active'),
('T26','MI-7777',35000,FLOOR(RAND()*50)+50,'gasoline','active'),
('T27','OR-8888',39000,FLOOR(RAND()*50)+50,'diesel','active'),
('T28','UT-9999',36000,FLOOR(RAND()*50)+50,'diesel','active'),
('T29','MA-1234',34000,FLOOR(RAND()*50)+50,'gasoline','active'),
('T30','WA-2345',38000,FLOOR(RAND()*50)+50,'diesel','active');

-- =====================
-- Truck compartments (2 compartments per truck)
-- =====================
INSERT INTO truck_compartments (truck_id, compartment_number, fuel_type, capacity_liters, current_level_liters) VALUES
(1,1,'diesel',16000,14000),(1,2,'diesel',16000,15000),
(2,1,'gasoline',15000,13500),(2,2,'gasoline',15000,12500),
(3,1,'diesel',15500,13000),(3,2,'diesel',15500,14000),
(4,1,'propane',17000,16000),(4,2,'propane',17000,16500),
(5,1,'diesel',14500,12000),(5,2,'diesel',14500,13000),
(6,1,'gasoline',15500,14000),(6,2,'gasoline',15500,14500),
(7,1,'diesel',16500,15000),(7,2,'diesel',16500,15500),
(8,1,'propane',15000,14000),(8,2,'propane',15000,14500),
(9,1,'diesel',20000,18000),(9,2,'diesel',20000,18500),
(10,1,'gasoline',18000,16000),(10,2,'gasoline',18000,17000),
(11,1,'diesel',21000,18500),(11,2,'diesel',21000,19500),
(12,1,'diesel',19000,17000),(12,2,'diesel',19000,17500),
(13,1,'gasoline',15000,13500),(13,2,'gasoline',15000,14000),
(14,1,'diesel',18500,16500),(14,2,'diesel',18500,17000),
(15,1,'diesel',22500,20500),(15,2,'diesel',22500,21000),
(16,1,'gasoline',16000,15000),(16,2,'gasoline',16000,15500),
(17,1,'diesel',19000,17500),(17,2,'diesel',19000,18000),
(18,1,'diesel',20000,18500),(18,2,'diesel',20000,19000),
(19,1,'diesel',17500,16000),(19,2,'diesel',17500,16500),
(20,1,'gasoline',16500,15000),(20,2,'gasoline',16500,15500),
(21,1,'diesel',19000,17500),(21,2,'diesel',19000,18000),
(22,1,'diesel',18000,16500),(22,2,'diesel',18000,17000),
(23,1,'gasoline',17000,15500),(23,2,'gasoline',17000,16000),
(24,1,'diesel',20000,18500),(24,2,'diesel',20000,19000),
(25,1,'diesel',18500,17000),(25,2,'diesel',18500,17500),
(26,1,'gasoline',17500,16000),(26,2,'gasoline',17500,16500),
(27,1,'diesel',19500,18000),(27,2,'diesel',19500,18500),
(28,1,'diesel',18000,16500),(28,2,'diesel',18000,17000),
(29,1,'gasoline',17000,15500),(29,2,'gasoline',17000,16000),
(30,1,'diesel',19000,17500),(30,2,'diesel',19000,18000);

-- =====================
-- Deliveries (50 mixed)
-- =====================
INSERT INTO deliveries (truck_id, station_id, volume_liters, delivery_date, status) VALUES
(1,1,28000, NOW() + INTERVAL 1 DAY,'planned'),
(2,2,25000, NOW() + INTERVAL 2 DAY,'planned'),
(3,3,26000, NOW() + INTERVAL 1 DAY,'enroute'),
(4,4,27000, NOW() + INTERVAL 3 DAY,'planned'),
(5,5,31000, NOW() + INTERVAL 4 DAY,'planned'),
(6,6,33000, NOW() + INTERVAL 0 DAY,'delivered'),
(7,7,28000, NOW() + INTERVAL 2 DAY,'planned'),
(8,8,30000, NOW() + INTERVAL 5 DAY,'canceled'),
(9,9,26000, NOW() + INTERVAL 1 DAY,'planned'),
(10,10,24000, NOW() + INTERVAL 2 DAY,'planned'),
(11,11,23000, NOW() + INTERVAL 3 DAY,'planned'),
(12,12,27000, NOW() + INTERVAL 1 DAY,'planned'),
(13,13,25000, NOW() + INTERVAL 2 DAY,'planned'),
(14,14,26000, NOW() + INTERVAL 2 DAY,'planned'),
(15,15,28000, NOW() + INTERVAL 1 DAY,'enroute'),
(16,16,22000, NOW() + INTERVAL 3 DAY,'planned'),
(17,17,24000, NOW() + INTERVAL 4 DAY,'planned'),
(18,18,27000, NOW() + INTERVAL 0 DAY,'delivered'),
(19,19,26000, NOW() + INTERVAL 2 DAY,'planned'),
(20,20,22000, NOW() + INTERVAL 1 DAY,'planned'),
(21,21,25000, NOW() + INTERVAL 1 DAY,'planned'),
(22,22,26000, NOW() + INTERVAL 3 DAY,'enroute'),
(23,23,20000, NOW() + INTERVAL 0 DAY,'delivered'),
(24,24,23000, NOW() + INTERVAL 1 DAY,'planned'),
(25,25,24000, NOW() + INTERVAL 2 DAY,'planned'),
(26,26,25000, NOW() + INTERVAL 2 DAY,'planned'),
(27,27,20000, NOW() + INTERVAL 3 DAY,'planned'),
(28,28,21000, NOW() + INTERVAL 1 DAY,'planned'),
(29,29,23000, NOW() + INTERVAL 2 DAY,'planned'),
(30,30,24000, NOW() + INTERVAL 3 DAY,'planned'),
(1,31,22000, NOW() + INTERVAL 1 DAY,'planned'),
(2,32,20000, NOW() + INTERVAL 2 DAY,'planned'),
(3,33,26000, NOW() + INTERVAL 0 DAY,'delivered'),
(4,34,28000, NOW() + INTERVAL 1 DAY,'enroute'),
(5,35,27000, NOW() + INTERVAL 2 DAY,'planned'),
(6,36,23000, NOW() + INTERVAL 3 DAY,'planned'),
(7,37,24000, NOW() + INTERVAL 2 DAY,'planned'),
(8,38,25000, NOW() + INTERVAL 1 DAY,'planned'),
(9,39,26000, NOW() + INTERVAL 1 DAY,'planned'),
(10,40,27000, NOW() + INTERVAL 2 DAY,'planned'),
(11,41,22000, NOW() + INTERVAL 3 DAY,'planned'),
(12,42,21000, NOW() + INTERVAL 2 DAY,'planned'),
(13,43,23000, NOW() + INTERVAL 1 DAY,'planned'),
(14,44,24000, NOW() + INTERVAL 2 DAY,'planned'),
(15,45,25000, NOW() + INTERVAL 0 DAY,'delivered'),
(16,46,26000, NOW() + INTERVAL 1 DAY,'planned'),
(17,47,27000, NOW() + INTERVAL 2 DAY,'planned'),
(18,48,28000, NOW() + INTERVAL 3 DAY,'planned'),
(19,49,20000, NOW() + INTERVAL 1 DAY,'planned'),
(20,50,21000, NOW() + INTERVAL 2 DAY,'planned');

-- =====================
-- Station fuel levels (3 days per station)
-- =====================
INSERT INTO station_fuel_levels (station_id, recorded_at, fuel_level_liters) VALUES
-- S1..S10
(1,NOW() - INTERVAL 3 DAY,30000),(1,NOW() - INTERVAL 2 DAY,27000),(1,NOW() - INTERVAL 1 DAY,25000),
(2,NOW() - INTERVAL 3 DAY,20000),(2,NOW() - INTERVAL 2 DAY,19000),(2,NOW() - INTERVAL 1 DAY,18000),
(3,NOW() - INTERVAL 3 DAY,36000),(3,NOW() - INTERVAL 2 DAY,33000),(3,NOW() - INTERVAL 1 DAY,30000),
(4,NOW() - INTERVAL 3 DAY,38000),(4,NOW() - INTERVAL 2 DAY,36000),(4,NOW() - INTERVAL 1 DAY,35000),
(5,NOW() - INTERVAL 3 DAY,28000),(5,NOW() - INTERVAL 2 DAY,26000),(5,NOW() - INTERVAL 1 DAY,25000),
(6,NOW() - INTERVAL 3 DAY,24000),(6,NOW() - INTERVAL 2 DAY,23000),(6,NOW() - INTERVAL 1 DAY,22000),
(7,NOW() - INTERVAL 3 DAY,43000),(7,NOW() - INTERVAL 2 DAY,42000),(7,NOW() - INTERVAL 1 DAY,41000),
(8,NOW() - INTERVAL 3 DAY,22000),(8,NOW() - INTERVAL 2 DAY,21000),(8,NOW() - INTERVAL 1 DAY,20000),
(9,NOW() - INTERVAL 3 DAY,20000),(9,NOW() - INTERVAL 2 DAY,19000),(9,NOW() - INTERVAL 1 DAY,18000),
(10,NOW() - INTERVAL 3 DAY,23000),(10,NOW() - INTERVAL 2 DAY,22000),(10,NOW() - INTERVAL 1 DAY,21000),
-- S11..S20
(11, NOW() - INTERVAL 3 DAY,19000),(11, NOW() - INTERVAL 2 DAY,18500),(11, NOW() - INTERVAL 1 DAY,18000),
(12, NOW() - INTERVAL 3 DAY,24000),(12, NOW() - INTERVAL 2 DAY,23500),(12, NOW() - INTERVAL 1 DAY,23000),
(13, NOW() - INTERVAL 3 DAY,26000),(13, NOW() - INTERVAL 2 DAY,25000),(13, NOW() - INTERVAL 1 DAY,24000),
(14, NOW() - INTERVAL 3 DAY,21000),(14, NOW() - INTERVAL 2 DAY,20500),(14, NOW() - INTERVAL 1 DAY,20000),
(15, NOW() - INTERVAL 3 DAY,20000),(15, NOW() - INTERVAL 2 DAY,19500),(15, NOW() - INTERVAL 1 DAY,19000),
(16, NOW() - INTERVAL 3 DAY,23000),(16, NOW() - INTERVAL 2 DAY,22000),(16, NOW() - INTERVAL 1 DAY,21000),
(17, NOW() - INTERVAL 3 DAY,21000),(17, NOW() - INTERVAL 2 DAY,20500),(17, NOW() - INTERVAL 1 DAY,20000),
(18, NOW() - INTERVAL 3 DAY,19000),(18, NOW() - INTERVAL 2 DAY,18500),(18, NOW() - INTERVAL 1 DAY,18000),
(19, NOW() - INTERVAL 3 DAY,24000),(19, NOW() - INTERVAL 2 DAY,23500),(19, NOW() - INTERVAL 1 DAY,23000),
(20, NOW() - INTERVAL 3 DAY,22000),(20, NOW() - INTERVAL 2 DAY,21500),(20, NOW() - INTERVAL 1 DAY,21000),
-- S21..S30
(21,NOW() - INTERVAL 3 DAY,32000),(21,NOW() - INTERVAL 2 DAY,31000),(21,NOW() - INTERVAL 1 DAY,30000),
(22,NOW() - INTERVAL 3 DAY,27000),(22,NOW() - INTERVAL 2 DAY,26500),(22,NOW() - INTERVAL 1 DAY,26000),
(23,NOW() - INTERVAL 3 DAY,47000),(23,NOW() - INTERVAL 2 DAY,46000),(23,NOW() - INTERVAL 1 DAY,45000),
(24,NOW() - INTERVAL 3 DAY,54000),(24,NOW() - INTERVAL 2 DAY,53000),(24,NOW() - INTERVAL 1 DAY,52000),
(25,NOW() - INTERVAL 3 DAY,39000),(25,NOW() - INTERVAL 2 DAY,38500),(25,NOW() - INTERVAL 1 DAY,38000),
(26,NOW() - INTERVAL 3 DAY,26000),(26,NOW() - INTERVAL 2 DAY,25500),(26,NOW() - INTERVAL 1 DAY,25000),
(27,NOW() - INTERVAL 3 DAY,31000),(27,NOW() - INTERVAL 2 DAY,30500),(27,NOW() - INTERVAL 1 DAY,30000),
(28,NOW() - INTERVAL 3 DAY,61000),(28,NOW() - INTERVAL 2 DAY,60500),(28,NOW() - INTERVAL 1 DAY,60000),
(29,NOW() - INTERVAL 3 DAY,51000),(29,NOW() - INTERVAL 2 DAY,50500),(29,NOW() - INTERVAL 1 DAY,50000),
(30,NOW() - INTERVAL 3 DAY,33000),(30,NOW() - INTERVAL 2 DAY,32500),(30,NOW() - INTERVAL 1 DAY,32000),
-- S31..S40
(31,NOW() - INTERVAL 3 DAY,43000),(31,NOW() - INTERVAL 2 DAY,42500),(31,NOW() - INTERVAL 1 DAY,42000),
(32,NOW() - INTERVAL 3 DAY,36000),(32,NOW() - INTERVAL 2 DAY,35500),(32,NOW() - INTERVAL 1 DAY,35000),
(33,NOW() - INTERVAL 3 DAY,30000),(33,NOW() - INTERVAL 2 DAY,29000),(33,NOW() - INTERVAL 1 DAY,28000),
(34,NOW() - INTERVAL 3 DAY,31000),(34,NOW() - INTERVAL 2 DAY,30500),(34,NOW() - INTERVAL 1 DAY,30000),
(35,NOW() - INTERVAL 3 DAY,28000),(35,NOW() - INTERVAL 2 DAY,27000),(35,NOW() - INTERVAL 1 DAY,26000),
(36,NOW() - INTERVAL 3 DAY,34000),(36,NOW() - INTERVAL 2 DAY,33500),(36,NOW() - INTERVAL 1 DAY,33000),
(37,NOW() - INTERVAL 3 DAY,35000),(37,NOW() - INTERVAL 2 DAY,34500),(37,NOW() - INTERVAL 1 DAY,34000),
(38,NOW() - INTERVAL 3 DAY,25000),(38,NOW() - INTERVAL 2 DAY,24500),(38,NOW() - INTERVAL 1 DAY,24000),
(39,NOW() - INTERVAL 3 DAY,52000),(39,NOW() - INTERVAL 2 DAY,51000),(39,NOW() - INTERVAL 1 DAY,50000),
(40,NOW() - INTERVAL 3 DAY,31000),(40,NOW() - INTERVAL 2 DAY,30500),(40,NOW() - INTERVAL 1 DAY,30000),
-- S41..S50
(41,NOW() - INTERVAL 3 DAY,32000),(41,NOW() - INTERVAL 2 DAY,31500),(41,NOW() - INTERVAL 1 DAY,31000),
(42,NOW() - INTERVAL 3 DAY,24000),(42,NOW() - INTERVAL 2 DAY,23500),(42,NOW() - INTERVAL 1 DAY,23000),
(43,NOW() - INTERVAL 3 DAY,27000),(43,NOW() - INTERVAL 2 DAY,26500),(43,NOW() - INTERVAL 1 DAY,26000),
(44,NOW() - INTERVAL 3 DAY,26000),(44,NOW() - INTERVAL 2 DAY,25500),(44,NOW() - INTERVAL 1 DAY,25000),
(45,NOW() - INTERVAL 3 DAY,25000),(45,NOW() - INTERVAL 2 DAY,24500),(45,NOW() - INTERVAL 1 DAY,24000),
(46,NOW() - INTERVAL 3 DAY,27000),(46,NOW() - INTERVAL 2 DAY,26500),(46,NOW() - INTERVAL 1 DAY,26000),
(47,NOW() - INTERVAL 3 DAY,25000),(47,NOW() - INTERVAL 2 DAY,24500),(47,NOW() - INTERVAL 1 DAY,24000),
(48,NOW() - INTERVAL 3 DAY,26000),(48,NOW() - INTERVAL 2 DAY,25500),(48,NOW() - INTERVAL 1 DAY,25000),
(49,NOW() - INTERVAL 3 DAY,23000),(49,NOW() - INTERVAL 2 DAY,22500),(49,NOW() - INTERVAL 1 DAY,22000),
(50,NOW() - INTERVAL 3 DAY,27000),(50,NOW() - INTERVAL 2 DAY,26500),(50,NOW() - INTERVAL 1 DAY,26000);
