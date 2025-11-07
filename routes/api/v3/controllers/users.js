import express from 'express';

var router = express.Router();

// GET /api/v3/users/myIdentity
router.get('/myIdentity', (req, res) => {
    try {
        const session = req.session;
        
        // Check if user is logged in
        if (!session.isAuthenticated || !session.account) {
            return res.json({ status: "loggedout" });
        }

        // User is logged in, return user info
        const userInfo = {
            name: session.account.name || '',
            username: session.account.username || ''
        };

        res.json({
            status: "loggedin",
            userInfo: userInfo
        });

    } catch (error) {
        console.error('Error in GET /api/v3/users/myIdentity:', error);
        res.status(500).json({
            status: "error",
            error: error.message || "An unexpected error occurred"
        });
    }
});

export default router;

