# Capstone Project Two

We have broken down the Capstone Project into easy-to-follow steps. Each step of the capstone contains a link with instructions for that step. You may notice this secondCapstone follows a similar pattern to your first Capstone, however, there are key differences. 

## Overview
For your second Capstone Project, you’ll build a more complex database-driven website. Most students will choose to develop this app in React and Node, however, Flask/Python is also an option if you tackle a difficult idea. This website will be powered either off of an external API or an API that you build yourself. Your finished capstone will be an integral part of your portfolio; it will demonstrate to potential employers everything you’ve learned from this course.We want you to work on a challenging project that will incorporate all of the full-stack skills you’ve been developing. The goal of this project isn’t to create something that’s never been done before but should be more ambitious than your last capstone. You could potentially create a website similar to one that already exists, but this time, perhaps add a feature that you wish the website had.We do encourage you to be creative when building your site. You’re free to choose any API you’d like to use or build your own. We encourage you to tap into your imagination throughout the project.

## Examples
You already know about the wealth of APIs available online. Perhaps on this capstone, you can work on one of your ideas that was a bit too complicated for the last project.We also encourage you to create your own API if you cannot find one with the data you are looking for. You can do this through web scraping, importing a CSV, or loading your own data into the API.

Let’s give you an example of what a site could look like. Say you want to make a website or mobile app that was like Facebook for dogs - something that would allow pet owners to connect with other pets in their neighborhood. First, you could load information into the application about various breeds of dogs, which would populate drop down lists and allow users to sort for the kind of dog they would like to sit. This will help users build the profile for their animal. You could add forms with various information about the pets.You could allow them to upload pictures (dog owners love nothing more than to take pictures of their animals). Most importantly, you could allow the pets to connect with other pets through a graph.Now let’s talk about bells and whistles. What if a user of your Dogbook was leaving town and wanted to find users in their neighborhood to watch their dog for the weekend. You could implement a geographical filtering and simple messaging or request system in order to help Spot find the best pet sitter. And since no one wants their dog watched by some kind of monster, you could implement reviews to see if people recommend this sitter. There are a million different features you could add!Verified users, so celebrities could show off their dogs. Hafthor Bjornsson, the actor who plays the Mountain on Game ofThrones, has an adorable pomeranian and people demand picture proof! You could implement an adoption system so people can give shelter pets a good home. Of course, adding in all of these features would be beyond the scope of this project, but you should expect this app to have more functionality than the last Capstone

## Guidelines

1. You can use any technology we’ve taught you in the course, and there’s nothing stopping you from using outside libraries are services.That being said, we recommend you use React, and Node.js for this Capstone.If you completed the optional Redux unit, we recommend you use Redux as well. You can useFlask/Python but will be expected to make a much more fully featured application than last time.
2. Every step of the project has submissions. This will alert your mentor to evaluate your work. Pay attention to the instructions so you submit the right thing. You will submit the link to your GitHub repo several times, this is for your mentor’s convenience. Your URL on GitHub is static and will not change.
3. The first two steps require mentor approval to proceed, but after that, you are free to continue working on the project after you submit your work. For instance, you don’t need your mentor to approve your database schema before you start working on your site. Likewise, you don’t need your mentor to approve the first iteration of your site before you start polishing it.
4. If you get stuck, there is a wealth of resources at your disposal. The course contains all of the material you will need to complete this project, but a well-phrased Google search might yield you an immediate solution to your problem. Don’t forget that your Slack community, TAs, and your mentor there to help you out.
5.Make sure you use a free API or create your own API and deploy your project on Heroku, so everyone can see your work!

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