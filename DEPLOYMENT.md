# Deployment Guide for Website Sharer A3/A4

## Step 1: MongoDB Atlas Setup

1. Go to https://www.mongodb.com/free-cloud-database
2. Create a free account
3. Create a new cluster (choose the free M0 tier)
4. Create a database user:
   - Go to Database Access
   - Add New Database User
   - Choose Password authentication
   - Create a username and password (save these!)
5. Whitelist IP addresses:
   - Go to Network Access
   - Add IP Address
   - For Render deployment, add 0.0.0.0/0 (allows all IPs)
6. Get your connection string:
   - Go to Database
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace <password> with your database user password

## Step 2: Render Deployment

1. Go to https://render.com
2. Sign up/Login with GitHub
3. Click "New +" and select "Web Service"
4. Connect your GitHub repository: https://github.com/JunseongLee98/website-sharer-a3
5. Select the `a4` branch
6. Configure the service:
   - **Name**: website-sharer-a3
   - **Runtime**: Node
   - **Build Command**: npm install
   - **Start Command**: npm start
7. Add Environment Variables:
   - **Key**: MONGODB_URI
   - **Value**: Your MongoDB Atlas connection string
8. Click "Create Web Service"
9. Wait for deployment to complete
10. Your app will be available at: https://website-sharer-a4.onrender.com (or your custom domain in A4)

## Step 2b: Custom Domain + HTTPS on Render (A4)
1. Go to your Render Web Service → Settings → Custom Domains → Add Custom Domain
2. Enter your domain (from `https://nc.me` or another registrar)
3. Add the DNS records shown by Render at your registrar (CNAME for `www`, ALIAS/A for apex if desired)
4. Wait for DNS propagation; Render auto-provisions HTTPS via Let’s Encrypt
5. Set your primary domain in Render and verify HTTPS works

## Step 3: Test Your Deployment

1. Visit your Render URL
2. Try the URL preview functionality
3. Create a new post with username, description, and URL
4. Verify posts are saved to MongoDB Atlas
5. Check that posts display correctly with previews

## Troubleshooting

- If MongoDB connection fails, check your connection string
- If deployment fails, check the Render logs
- Make sure your MongoDB Atlas cluster is running
- Verify IP whitelist includes 0.0.0.0/0 for Render

## Azure App Service Alternative (A4)
1. Create Azure App Service (Node) and deploy your repo/branch `a4`
2. Configure `MONGODB_URI` in Application Settings
3. Add custom domain in "Custom domains" and verify via CNAME/TXT
4. Enable HTTPS in TLS/SSL settings with App Service Managed Certificate
5. Test the custom domain over HTTPS


