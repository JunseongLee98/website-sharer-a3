import express from 'express';

var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';
import { waitForConnection } from '../../../../models.js';

// POST /api/v3/posts
router.post('/', async (req, res) => {
    try {
        const session = req.session;
        
        // Check if user is logged in
        if (!session.isAuthenticated || !session.account) {
            return res.status(401).json({
                status: "error",
                error: "not logged in"
            });
        }

        const { url, description } = req.body;
        
        if (!url || !description) {
            return res.status(400).json({
                status: "error",
                error: "URL and description are required"
            });
        }

        // Check if MongoDB is connected
        if (!req.models || !req.models.Post) {
            return res.status(500).json({
                status: "error",
                error: "Database not connected. Please set up MongoDB Atlas."
            });
        }

        // Wait for MongoDB connection before proceeding
        try {
            await waitForConnection();
        } catch (connectionError) {
            console.error('MongoDB connection error:', connectionError);
            return res.status(500).json({
                status: "error",
                error: `Database connection failed: ${connectionError.message}. Please check MONGODB_URI environment variable and MongoDB Atlas Network Access settings.`
            });
        }

        // Get username from session account
        // MSAL AccountInfo may have username directly or in idTokenClaims
        const account = session.account;
        const idTokenClaims = account.idTokenClaims || {};
        const username = account.username || 
                        idTokenClaims.preferred_username || 
                        idTokenClaims.email || 
                        idTokenClaims.upn || 
                        account.localAccountId || 
                        '';

        // Create a new Post object
        const newPost = new req.models.Post({
            url: url,
            description: description,
            username: username,
            created_date: new Date()
        });

        // Save the post to the database
        try {
            await newPost.save();
        } catch (saveError) {
            console.error('Error saving post:', saveError);
            return res.status(500).json({
                status: "error",
                error: `Failed to save post: ${saveError.message}`
            });
        }

        // Return success response
        res.json({ status: "success" });

    } catch (error) {
        console.error('Error in POST /api/v3/posts:', error);
        res.status(500).json({
            status: "error",
            error: error.message || "An unexpected error occurred while creating the post"
        });
    }
});

// GET /api/v3/posts
router.get('/', async (req, res) => {
    try {
        // Check if MongoDB is connected
        if (!req.models || !req.models.Post) {
            return res.status(500).json({
                status: "error",
                error: "Database not connected. Please set up MongoDB Atlas."
            });
        }

        // Wait for MongoDB connection before proceeding
        try {
            await waitForConnection();
        } catch (connectionError) {
            console.error('MongoDB connection error:', connectionError);
            return res.status(500).json({
                status: "error",
                error: "Database connection failed. Please check MONGODB_URI environment variable and MongoDB Atlas settings."
            });
        }

        // Check for username query parameter
        const usernameFilter = req.query.username;
        let query = {};
        if (usernameFilter) {
            query = { username: usernameFilter };
        }

        // Find Posts in your MongoDB database (with optional username filter)
        const posts = await req.models.Post.find(query).sort({ created_date: -1 });

        // For each of the urls, generate the html preview of the webpage
        let postData = await Promise.all(
            posts.map(async post => { 
                try{
                    const htmlPreview = await getURLPreview(post.url);
                    return {
                        description: post.description,
                        htmlPreview: htmlPreview,
                        username: post.username,
                        created_date: post.created_date
                    };
                }catch(error){
                    return {
                        description: post.description,
                        htmlPreview: `Error generating preview: ${error.message}`,
                        username: post.username,
                        created_date: post.created_date
                    };
                }
            })
        );

        // Return an array of json objects
        res.json(postData);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "error",
            error: error.message
        });
    }
});

export default router;

