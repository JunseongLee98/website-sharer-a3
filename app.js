import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import models from './models.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security headers to prevent XSS attacks
app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; img-src 'self' data: https:; connect-src 'self';");
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// Add models to request
app.use((req, res, next) => {
    req.models = models;
    next();
});

// API routes - must come before static middleware
try {
    const apiV1Router = (await import('./routes/api/v1/apiv1.js')).default;
    app.use('/api/v1', apiV1Router);
} catch (error) {
    console.error('Failed to load API v1 routes:', error);
}

try {
    const apiV2Router = (await import('./routes/api/v2/apiv2.js')).default;
    app.use('/api/v2', apiV2Router);
} catch (error) {
    console.error('Failed to load API v2 routes:', error);
}

// Static files and root route - must come after API routes
app.use(express.static(path.join(__dirname)));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

export default app;
