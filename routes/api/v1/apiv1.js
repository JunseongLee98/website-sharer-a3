const express = require('express');
const fetch = require('node-fetch');
const { parse } = require('node-html-parser');

const router = express.Router();

// GET /api/v1/urls/preview
router.get('/urls/preview', async (req, res) => {
    try {
        const url = req.query.url;
        
        if (!url) {
            return res.status(400).send('URL parameter is required');
        }

        // Fetch the webpage content
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const html = await response.text();
        const root = parse(html);

        // Extract OpenGraph meta tags
        const metaTags = root.querySelectorAll('meta');
        let ogUrl = url;
        let ogTitle = '';
        let ogImage = '';
        let ogDescription = '';
        let ogSiteName = '';
        let ogType = '';
        let ogLocale = '';

        // Parse meta tags for OpenGraph data
        metaTags.forEach(tag => {
            const property = tag.getAttribute('property');
            const content = tag.getAttribute('content');
            const name = tag.getAttribute('name');

            if (property) {
                switch (property) {
                    case 'og:url':
                        ogUrl = content;
                        break;
                    case 'og:title':
                        ogTitle = content;
                        break;
                    case 'og:image':
                        ogImage = content;
                        break;
                    case 'og:description':
                        ogDescription = content;
                        break;
                    case 'og:site_name':
                        ogSiteName = content;
                        break;
                    case 'og:type':
                        ogType = content;
                        break;
                    case 'og:locale':
                        ogLocale = content;
                        break;
                }
            }
        });

        // Fallback to title tag if og:title is missing
        if (!ogTitle) {
            const titleTag = root.querySelector('title');
            if (titleTag) {
                ogTitle = titleTag.textContent.trim();
            } else {
                ogTitle = url;
            }
        }

        // Create HTML preview with enhanced styling
        let previewHTML = `<div style="max-width: 320px; border: solid 2px #e1e5e9; padding: 15px; text-align: center; border-radius: 12px; box-shadow: 0 4px 8px rgba(0,0,0,0.15); background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%); margin: 10px auto; transition: transform 0.2s ease, box-shadow 0.2s ease;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 12px rgba(0,0,0,0.2)'" onmouseout="this.style.transform='translateY(0px)'; this.style.boxShadow='0 4px 8px rgba(0,0,0,0.15)'">`;
        
        previewHTML += `<a href="${ogUrl}" style="text-decoration: none; color: inherit; display: block;">`;
        
        if (ogSiteName && ogType) {
            previewHTML += `<div style="font-size: 10px; color: #6c757d; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; font-weight: 600;">${ogSiteName} • ${ogType}</div>`;
        } else if (ogSiteName) {
            previewHTML += `<div style="font-size: 10px; color: #6c757d; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; font-weight: 600;">${ogSiteName}</div>`;
        }
        
        if (ogTitle) {
            previewHTML += `<h3 style="font-size: 16px; margin: 0 0 12px 0; color: #212529; font-weight: 600; line-height: 1.3;">${ogTitle}</h3>`;
        }
        
        if (ogImage) {
            previewHTML += `<img src="${ogImage}" style="max-height: 200px; max-width: 290px; border-radius: 8px; margin: 8px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">`;
        }
        
        previewHTML += `</a>`;
        
        if (ogDescription) {
            previewHTML += `<p style="font-size: 13px; margin: 12px 0 8px 0; color: #495057; line-height: 1.5; text-align: left;">${ogDescription}</p>`;
        }

        if (ogLocale) {
            previewHTML += `<div style="font-size: 10px; color: #adb5bd; margin-top: 8px; text-align: right;">${ogLocale}</div>`;
        }

        previewHTML += `</div>`;

        res.send(previewHTML);

    } catch (error) {
        console.error('Error fetching URL preview:', error);
        res.status(500).send(`Error: ${error.message}`);
    }
});

module.exports = router;
