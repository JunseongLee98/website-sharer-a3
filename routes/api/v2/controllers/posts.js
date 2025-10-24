import express from 'express';

var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

// POST /api/v2/posts
router.post('/', async (req, res) => {
    try {
        const { url, description, username } = req.body;
        
        if (!url || !description || !username) {
            return res.status(400).json({
                status: "error",
                error: "URL, description, and username are required"
            });
        }

        // Check if MongoDB is connected
        if (!req.models || !req.models.Post) {
            return res.status(500).json({
                status: "error",
                error: "Database not connected. Please set up MongoDB Atlas."
            });
        }

        // Create a new Post object
        const newPost = new req.models.Post({
            url: url,
            description: description,
            username: username,
            created_date: new Date()
        });

        // Save the post to the database
        await newPost.save();

        // Return success response
        res.json({ status: "success" });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "error",
            error: error.message
        });
    }
});

// GET /api/v2/posts
router.get('/', async (req, res) => {
    try {
        // Check if MongoDB is connected
        if (!req.models || !req.models.Post) {
            return res.status(500).json({
                status: "error",
                error: "Database not connected. Please set up MongoDB Atlas."
            });
        }

        // Find all Posts in your MongoDB database
        const posts = await req.models.Post.find({}).sort({ created_date: -1 });

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
