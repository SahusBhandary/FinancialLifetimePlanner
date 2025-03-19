const express = require('express');
const passport = require('passport');
const router = express.Router();
const jwt = require('jsonwebtoken');

//Generate JWT for Auth
const generateToken = (user) => {
    return jwt.sign({ id: user._id, googleID: user.googleID, email: user.email}, process.env.JWT_SECRET);
};

//Initiate Google OAuth
router.get(
    '/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
    })
);

router.get('/getUserCookie', async(req,res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).send('No token found');
    }
    res.status(200).send(token);
})

// Callback route for Google to redirect
router.get('/google/callback', passport.authenticate('google', {failureRedirect: 'http://localhost:3000/#/login', session: false }), (req, res) => {
    if (!req.user){
        res.status(401).json({ message: "Authentication Failed" });
    }
    // Generate Token for authenticated User
    const token = generateToken(req.user);
    //Send token to frontend as cookie
    res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
    })
    res.redirect("http://localhost:3000")
})

//Protected route to test JWT Auth
router.get('/protected', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1] // Extract Token from Authorization

    if (!token){
        return res.status(401).json({ message: "No Token Provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err){
            return res.status(403).json({ message: "Invalid Token"} );
        }
        res.json({ message: "Protected content accessed!", user: decoded });
    });
});

module.exports = router;
