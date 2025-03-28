-- ======= CATEGORIES =======
INSERT INTO categories (name, description) VALUES
('Food', 'Food at home and away from home'),
('Housing', 'Rent, ownership, and household utilities'),
('Transportation', 'Vehicles, gasoline, and public transport'),
('Medical Care', 'Healthcare services and medications'),
('Education & Communication', 'College tuition, internet, and phone services'),
('Recreation', 'TVs, audio equipment, and hobbies'),
('Apparel', 'Clothing and footwear'),
('Miscellaneous Essentials', 'Personal care and tobacco');

-- ======= TRACKED ITEMS =======
-- Food
INSERT INTO tracked_items (category_id, name, series_id) VALUES
(1, 'Food at Home', 'CPIUFDNS'),
(1, 'Food Away from Home', 'CPIUFDSL'),
(1, 'Meats, Poultry, Fish, Eggs', 'CUUR0000SAF11'),
(1, 'Fruits and Vegetables', 'CUUR0000SAF113'),
(1, 'Cereals and Bakery Products', 'CUUR0000SAF111');

-- Housing
INSERT INTO tracked_items (category_id, name, series_id) VALUES
(2, 'Rent of Primary Residence', 'CUUR0000SEHA'),
(2, 'Owners'' Equivalent Rent', 'CUUR0000SEHC'),
(2, 'Household Energy', 'CUUR0000SEHF');

-- Transportation
INSERT INTO tracked_items (category_id, name, series_id) VALUES
(3, 'Gasoline (All Types)', 'CUUR0000SETB01'),
(3, 'New Vehicles', 'CUSR0000SETA01'),
(3, 'Used Cars & Trucks', 'CUSR0000SETA02'),
(3, 'Public Transportation', 'CUUR0000SETG');

-- Medical Care
INSERT INTO tracked_items (category_id, name, series_id) VALUES
(4, 'Medical Care Services', 'CUUR0000SAM2'),
(4, 'Hospital Services', 'CUUR0000SAM21'),
(4, 'Physician Services', 'CUUR0000SAM211'),
(4, 'Prescription Drugs', 'CUUR0000SAM1');

-- Education & Communication
INSERT INTO tracked_items (category_id, name, series_id) VALUES
(5, 'College Tuition & Fees', 'CUUR0000SEEB01'),
(5, 'Internet Services', 'CUUR0000SEEE04'),
(5, 'Wireless Phone Services', 'CUUR0000SEEE03');

-- Recreation
INSERT INTO tracked_items (category_id, name, series_id) VALUES
(6, 'Television Equipment', 'CUUR0000SERA01'),
(6, 'Audio Equipment', 'CUUR0000SERA02'),
(6, 'Sporting Goods', 'CUUR0000SRG01');

-- Apparel
INSERT INTO tracked_items (category_id, name, series_id) VALUES
(7, 'Men’s Apparel', 'CUUR0000SAH1'),
(7, 'Women’s Apparel', 'CUUR0000SAH2'),
(7, 'Footwear', 'CUUR0000SAH3');

-- Miscellaneous
INSERT INTO tracked_items (category_id, name, series_id) VALUES
(8, 'Personal Care Products', 'CUUR0000SEHN01'),
(8, 'Tobacco Products', 'CUUR0000SAF112');
