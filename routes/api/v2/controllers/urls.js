import express from 'express';

var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

// GET /api/v2/urls/preview
router.get('/preview', async (req, res) => {
    try {
        const url = req.query.url;
        
        if (!url) {
            return res.status(400).send('URL parameter is required');
        }

        const previewHTML = await getURLPreview(url);
        res.send(previewHTML);

    } catch (error) {
        console.error('Error fetching URL preview:', error);
        res.status(500).send(`Error: ${error.message}`);
    }
});

export default router;
