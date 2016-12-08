var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require("../../models/userModel");

module.exports = function() {

    passport.use(new FacebookStrategy({
        clientID: '684615128368796',
        clientSecret: '512e589d7ffece49422f1315834d85ab',
        callbackURL: 'http://localhost:3000/auth/facebook/callback',
        passReqToCallback: true,
        profileFields: ['id', 'photos', 'emails', 'displayName', 'link']
    },
    function(req, accessToken, refreshToken, profile, done) {

        var query = {
            'facebook.id': profile.id
        };

        User.findOne(query, function(error, user) {
            if(user) {
                console.log('found');
                done(null, user);
            }
            else {
                console.log("not found");
                var user = new User;

                user.email = profile.emails[0].value;
                user.image = profile.photos[0].value;
                user.displayName = profile.displayName;

                user.facebook = {}
                user.facebook.id = profile.id;
                user.facebook.token = accessToken;

                user.save();
                done(null, user);
            }
        });

    }));
}
