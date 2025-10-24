# Website Sharer - URL Preview with Database

A web application that allows users to share website links, preview them using OpenGraph metadata, and store them in a MongoDB database.

## A3

### Deployed Website
**Render URL**: https://website-sharer-a3.onrender.com

### Additional User Information
I added a **username** field as the creative component. Users must enter their username when posting a URL, and this information is:
- Saved to the MongoDB database
- Displayed with each post in the shared posts section
- Required for all new posts

### Help Received
No other students helped directly with this code.

## Features

### URL Preview
- Extract and display OpenGraph metadata (title, description, image, site name, type, locale)
- Beautiful card-based preview with hover effects
- Fallback to HTML title tag if OpenGraph title is missing
- Error handling for invalid URLs

### Database Integration
- MongoDB database to store shared URLs
- Post schema includes: URL, description, username, and creation date
- RESTful API endpoints for creating and retrieving posts

### User Interface
- Modern Bootstrap-based design
- Form validation and user feedback
- Real-time status messages
- Responsive layout

## API Endpoints

### v1 API (Original)
- `GET /api/v1/urls/preview?url=<target_url>` - Generate URL preview

### v2 API (New with Database)
- `GET /api/v2/urls/preview?url=<target_url>` - Generate URL preview
- `POST /api/v2/posts` - Create a new post (requires url, description, username)
- `GET /api/v2/posts` - Retrieve all posts with previews

## Technical Implementation
- **Frontend**: HTML, CSS, JavaScript with fetch API
- **Backend**: Node.js with Express
- **Database**: MongoDB with Mongoose ODM
- **Dependencies**: 
  - node-fetch for HTTP requests
  - node-html-parser for HTML parsing
  - mongoose for MongoDB integration

## Running Locally
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up MongoDB (local or Atlas)
4. Start the server: `npm start`
5. Open your browser to `http://localhost:3000`

## Deployment
The application is deployed on Render.com with MongoDB Atlas for the database. The connection string is configured to use environment variables for security.
