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
(1, 'Food at Home',                   'CUUR0000SAF11'),
(1, 'Food Away from Home',            'CUSR0000SEFV'),
(1, 'Meats, Poultry, Fish, and Eggs', 'CUSR0000SAF112'),
(1, 'Fruits and Vegetables',          'CUUR0000SAF113'),
(1, 'Cereals and Bakery Products',    'CUUR0000SAF111');

-- Housing
INSERT INTO tracked_items (category_id, name, series_id) VALUES
(2, 'Rent of Primary Residence',   'CUUR0000SEHA'),
(2, 'Owners'' Equivalent Rent',     'CUUR0000SEHC'),
(2, 'Household Energy',             'CUSR0000SAH21');

-- Transportation
INSERT INTO tracked_items (category_id, name, series_id) VALUES
(3, 'Gasoline (All Types)',         'CUUR0000SETB01'),
(3, 'New Vehicles',                 'CUSR0000SETA01'),
(3, 'Used Cars & Trucks',           'CUSR0000SETA02'),
(3, 'Public Transportation',        'CUUR0000SETG');

-- Medical Care
INSERT INTO tracked_items (category_id, name, series_id) VALUES
(4, 'Medical Care Services',       'CUUR0000SAM2'),
(4, 'Hospital Services',           'CUSR0000SEMD'),
(4, 'Physician Services',          'WPS511101'),
(4, 'Prescription Drugs',          'PCU4461104461101');

-- Education & Communication
INSERT INTO tracked_items (category_id, name, series_id) VALUES
(5, 'College Tuition & Fees',      'CUSR0000SEEB'),
(5, 'Internet Services',           'WPU374'),
(5, 'Wireless Phone Services',     'WPS3721');

-- Recreation
INSERT INTO tracked_items (category_id, name, series_id) VALUES
(6, 'Television Equipment',        'WPU585'),
(6, 'Audio Equipment',             'PCU334310334310'),
(6, 'Sporting Goods',              'PCU451110451110');

-- Apparel
INSERT INTO tracked_items (category_id, name, series_id) VALUES
(7, 'Men’s Apparel',               'CUSR0000SAA1'),
(7, 'Women’s Apparel',             'CUSR0000SAA2'),
(7, 'Footwear',                    'CUSR0000SEAE');

-- Miscellaneous
INSERT INTO tracked_items (category_id, name, series_id) VALUES
(8, 'Personal Care Products',      'CUUR0000SEGB'),
(8, 'Tobacco Products',            'CUSR0000SEGA');

