const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require("./models/User");

// Serialize User: Determines what informaiton about the user should be stored inside of the session cookie
passport.serializeUser((user, done) => {
    done(null, user._id);
});

// Deserialize User: Determines what i
passport.deserializeUser(async(id, done) => {
    try{
        const user = await User.findById(id)
        done(null, user);
    }
    catch(err){
        done(err, null);
    }
});

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:8000/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            try{
                const user = await User.findOne({ googleID: profile.id });
                if (user){
                    return done(null, user);
                }
                const googleID = profile.id;
                const name = profile.displayName;
                const email = profile.emails?.[0]?.value || null
                const newUser = await User.create({ name: name, email: email, googleID: googleID})
                done(null, newUser)
            }
            catch(err){
                return done(err, null)
            }
        }
    )
);