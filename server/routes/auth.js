const express = require('express');
const passport = require('passport');

const router = express.Router();

//Initiate Google OAuth
router.get(
    '/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
    })
);

// Callback route for Google to redirect
router.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect: 'http://localhost:3000/#/login',
        successRedirect: 'http://localhost:3000',
    })
);

// Failure Route
router.get('/google/failure', (req, res) => {
    res.send('Failure to Authenticate');
});

// Success Route
router.get('/google/success', (req, res) => {
    res.send('Logged in with Google');
});

module.exports = router;