# Website Sharer - URL Preview with Database

A web application that allows users to share website links, preview them using OpenGraph metadata, and store them in a MongoDB database.

## A3

### Deployed Website
**GitHub Repository**: https://github.com/JunseongLee98/website-sharer-a3
**Render URL**: https://website-sharer-a3.onrender.com (To be deployed)

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
3. Set up MongoDB Atlas:
   - Go to [MongoDB Atlas](https://www.mongodb.com/free-cloud-database)
   - Create a free account and cluster
   - Create a database user
   - Get your connection string
   - Update the `MONGODB_URI` in `models.js` with your connection string
4. Start the server: `npm start`
5. Open your browser to `http://localhost:3000`

## Security Features
- **XSS Protection**: All HTML content from URLs is sanitized to prevent malicious JavaScript execution
- **Content Security Policy**: Headers prevent unauthorized script execution
- **Input Validation**: All user inputs are validated and sanitized
- **Error Handling**: Graceful handling of database connection failures

## Deployment
The application is deployed on Render.com (or Azure) with MongoDB Atlas for the database. The connection string is configured to use environment variables for security.

### MongoDB Atlas Setup for Deployment
1. Create a MongoDB Atlas cluster
2. Create a database user with read/write permissions
3. Add your IP address to the whitelist (or use 0.0.0.0/0 for Render)
4. Get your connection string
5. Set the `MONGODB_URI` environment variable in Render with your connection string

## A4

### Deployed Website (Custom Domain + HTTPS)
- URL: https://njs05153.shop

### What Changed in A4
- XSS mitigations added on the client when rendering `username`, `description`, and status messages using HTML escaping.
- Safer preview rendering: plain error strings are inserted via `textContent` instead of `innerHTML`.
- Deployment instructions updated for custom domain and HTTPS.

### Custom Domain & HTTPS (Render)
1. Purchase/claim a domain (e.g., from `https://nc.me`).
2. In Render, open your Web Service → Settings → Custom Domains → Add Custom Domain.
3. Copy the provided DNS records and add them at your domain registrar:
   - Typically a CNAME from `www` → your Render subdomain, and optionally an A/ALIAS for apex.
4. Wait for DNS to propagate; Render will auto-provision TLS (HTTPS) via Let’s Encrypt.
5. Set your primary domain in Render and verify the site loads over HTTPS.

### Custom Domain & HTTPS (Azure App Service alternative)
1. Deploy Node app to Azure App Service.
2. In App Service → Custom domains → Add custom domain → Verify via TXT/CNAME.
3. Map domain (CNAME or A record) at registrar to your Azure app hostname.
4. Enable HTTPS: TLS/SSL settings → Private Key Certificates (App Service Managed) → Create binding.
5. Confirm site loads over HTTPS at the custom domain.
