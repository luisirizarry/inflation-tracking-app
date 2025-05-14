## Documentation

# Inflation Tracking App

A web application that allows users to track inflation data for various products and services over time. Users can create accounts to save their preferences, view historical trends, and analyze inflation patterns across different categories.

## Key Features

- **Inflation Data Visualization**: Interactive charts showing inflation trends
- **Category-based Organization**: Browse items by categories like Food, Housing, Transportation
- **User Accounts**: Create accounts to save preferences
- **Item Tracking**: Personalized dashboard of tracked items
- **Date Range Analysis**: Compare inflation rates across custom time periods
- **Statistics**: View key metrics like min/max values, average, and percentage change

## Technologies Used

### Frontend
- React.js
- Recharts for data visualization
- CSS for styling
- Context API for state management

### Backend
- Node.js with Express
- PostgreSQL database
- JWT authentication

### Frontend Components
- **Authentication Module**: Handles user login, registration, and session management
- **Dashboard**: Displays user's tracked items and summary statistics
- **Item Explorer**: Browse and search available inflation data items
- **Item Detail**: Detailed view with charts and statistics
- **User Preferences**: Settings and tracked item management

### Backend Services
- **Authentication Service**: Manages user accounts and authentication
- **Inflation Data Service**: Provides inflation data with filtering capabilities
- **User Preferences Service**: Stores and retrieves user preferences
- **Category Service**: Manages item categories and relationships

### API Used
https://fred.stlouisfed.org/docs/api/fred/

### PROJECT PROPOSAL (Pasted FROM Google Doc, but I put better formatting)
**Project**: Inflation Tracking Web Application

### Database Schema
- **Users**  
  `id`, `email`, `password_hash`, `created_at`
- **Inflation Data**  
  `id`, `tracked_item_id`, `date`, `value`
- **Tracked Items**  
  `id`, `name`, `category_id`, `fred_series_id`
- **User Preferences**  
  `id`, `user_id`, `tracked_item_id`, `notifications_enabled`
- **Notifications**  
  `id`, `user_id`, `tracked_item_id`, `message`, `is_read`, `created_at`

### API Integration
- **Source**: [FRED API](https://fred.stlouisfed.org/docs/api/fred/)
- **Error Handling**: Custom Express middleware for API and database errors
- **Security**: JWT authentication, bcrypt for password hashing

### Core Features
1. **User Authentication** (Sign up / Log in / Log out)  
2. **Inflation Dashboard**: Interactive charts with Recharts  
3. **Category-Based Tracking**: Filter and browse items by category  
4. **Notifications**: In-app alerts for major inflation shifts  
5. **Date Range Analysis**: Compare weekly, monthly, yearly trends  
6. **Search**: Look up specific goods or services

### User Flows
- **Visitor**  
  1. View public inflation trends  
  2. Sign up to save preferences  
  3. Track items & receive notifications  

### Stretch Goals
- **Inflation Calculator**: Let users input their expenses to see real-time impact  
- **Comparative Analysis**: Side-by-side period comparisons  
- **Email Reports**: Send periodic inflation summaries to subscribers

---

## Initial Project Ideas (Also Pasted from doc)

### 1. Personalized Movie & TV Show Tracker
**Description**  
A full-stack app to search for movies/TV shows, build watchlists, rate content, and get tailored recommendations.

**Features**  
- User Authentication (email & password)  
- Search & details via **TMDb API**  
- Watchlist & viewing history saved in database  
- Rating & review system  
- (Optional) Community discussion forum  

**API**: [TMDb API](https://developers.themoviedb.org/)

---

### 2. Interactive Music Playlist Generator
**Description**  
Create and manage playlists by mood, genre, or activity using real music data.

**Features**  
- User Authentication  
- Music search & playback via **Spotify Web API**  
- Drag-and-drop playlist builder  
- (Optional) Social sharing & collaborative playlists  

**API**: [Spotify Web API](https://developer.spotify.com/documentation/web-api/)

---

### 3. Food Recipe & Meal Planner
**Description**  
Discover recipes, save favorites, plan weekly meals, and auto-generate shopping lists.

**Features**  
- User Authentication  
- Recipe search via **Spoonacular** or **Edamam API**  
- Weekly meal calendar  
- Auto-generated shopping list  
- Nutrition info & user comments  

**APIs**  
- [Spoonacular API](https://spoonacular.com/food-api)  
- [Edamam API](https://developer.edamam.com/)

**More APIs**  
- [apilist.fun](https://apilist.fun/)  
- [public-apis/public-apis](https://github.com/public-apis/public-apis)

---

Repository: [github.com/luisirizarry/Capstone-Project](https://github.com/luisirizarry/Capstone-Project)

### Deployed Site URL
(https://inflation-tracking-app-frontend.onrender.com/)