// backend/middleware/auth.js

const jwt = require('jsonwebtoken');
const User = require('../models/user.js');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // 1. Get token from the "Bearer <token>" header
            token = req.headers.authorization.split(' ')[1];

            // 2. Verify the token using the secret from your .env file
            //    This is the line that was failing.
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Find the user in the database and attach them to the request
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            next(); // Success! Move on to the controller function.
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };