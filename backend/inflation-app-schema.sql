-- USERS
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- CATEGORIES
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- TRACKED ITEMS (Subcategories tied to FRED series IDs)
CREATE TABLE tracked_items (
    id SERIAL PRIMARY KEY,
    category_id INT REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    series_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- INFLATION DATA (FRED Observations)
CREATE TABLE inflation_data (
    id SERIAL PRIMARY KEY,
    tracked_item_id INT REFERENCES tracked_items(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    value FLOAT NOT NULL,
    retrieved_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(tracked_item_id, date)
);

-- USER PREFERENCES (for following specific tracked items)
CREATE TABLE user_preferences (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    tracked_item_id INT REFERENCES tracked_items(id) ON DELETE CASCADE,
    notify BOOLEAN DEFAULT true,
    UNIQUE(user_id, tracked_item_id)
);

-- NOTIFICATIONS
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);
