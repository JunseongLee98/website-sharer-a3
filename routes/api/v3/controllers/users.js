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

        // Extract user info from account object
        // MSAL AccountInfo may have username/name directly or in idTokenClaims
        const account = session.account;
        const idTokenClaims = account.idTokenClaims || {};
        
        // Get username - try account.username first, then idTokenClaims.preferred_username or email
        const username = account.username || 
                        idTokenClaims.preferred_username || 
                        idTokenClaims.email || 
                        idTokenClaims.upn || 
                        account.localAccountId || 
                        '';
        
        // Get name - try account.name first, then idTokenClaims.name
        let name = account.name || idTokenClaims.name || '';
        if (!name && (idTokenClaims.given_name || idTokenClaims.family_name)) {
            name = [idTokenClaims.given_name, idTokenClaims.family_name].filter(Boolean).join(' ');
        }

        // User is logged in, return user info
        const userInfo = {
            name: name.trim() || username,
            username: username
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

