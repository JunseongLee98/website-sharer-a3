import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import models from './models.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname)));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add models to request
app.use((req, res, next) => {
    req.models = models;
    next();
});

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API v1 routes
app.use('/api/v1', (await import('./routes/api/v1/apiv1.js')).default);

// API v2 routes
app.use('/api/v2', (await import('./routes/api/v2/apiv2.js')).default);

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

export default app;
