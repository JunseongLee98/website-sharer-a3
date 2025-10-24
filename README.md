# Website Sharer - URL Preview

A web application that allows users to preview website links using OpenGraph metadata.

## Deployed Website
*Note: To deploy to Render.com, follow these steps:*
1. Push your code to a GitHub repository
2. Connect your GitHub repo to Render.com
3. Set the build command to: `npm install`
4. Set the start command to: `npm start`
5. Deploy!

## Additional OpenGraph Information
The URL previewer extracts and displays the following additional OpenGraph properties beyond the basic requirements:

1. **`og:type`** - Shows the type of content (e.g., "website", "object", "article")
2. **`og:locale`** - Displays the locale/language of the content
3. **`og:site_name`** - Shows the name of the website/site

### Example URLs with Additional Information
Try these URLs to see the additional OpenGraph data in action:

1. **GitHub** (`https://github.com`):
   - Site name: "GitHub"
   - Type: "object"
   - Description and image from OpenGraph metadata

2. **Stack Overflow** (`https://stackoverflow.com`):
   - Site name: "Stack Overflow" 
   - Type: "website"
   - Description and image from OpenGraph metadata

3. **Reddit** (`https://www.reddit.com`):
   - Site name: "Reddit"
   - Type: "website"
   - Logo image and basic metadata

## Visual Style Improvements
I made several visual enhancements to the URL preview HTML:

1. **Enhanced Card Design**: Increased padding, added gradient background, and improved border radius for a more modern look
2. **Hover Effects**: Added smooth hover animations with transform and shadow effects for better interactivity
3. **Typography Hierarchy**: Improved font sizes, weights, and spacing to create better visual hierarchy
4. **Color Scheme**: Used a more sophisticated color palette with better contrast and readability
5. **Layout Improvements**: Better spacing between elements and improved alignment
6. **Site Name & Type Display**: Added a subtle header showing site name and content type in uppercase with letter spacing

These improvements make the preview cards more visually appealing and provide a better user experience with clear information hierarchy and interactive feedback.

## Help Received
No other students helped directly with this code.

## Running Locally
1. Clone the repository
2. Install dependencies: `npm install`
3. Start the server: `npm start`
4. Open your browser to `http://localhost:3000`
5. Enter a URL and click "Preview URL" to see the OpenGraph preview

## Technical Implementation
- **Frontend**: HTML, CSS, JavaScript with fetch API
- **Backend**: Node.js with Express
- **Dependencies**: node-fetch for HTTP requests, node-html-parser for HTML parsing
- **API Endpoint**: `/api/v1/urls/preview?url=<target_url>`
