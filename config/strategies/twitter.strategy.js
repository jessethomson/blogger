var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var User = require("../../models/userModel");

module.exports = function() {
    passport.use(new TwitterStrategy({
        consumerKey: '7PY3pawBBCbhwvXnxgfqAdnk8',
        consumerSecret: 'fVc4Pisvwk5y9iipA3wgTO8ywJtndVK8KG6Hsv28rhShyHt4uM',
        callbackURL: 'http://localhost:3000/auth/twitter/callback',
        passReqToCallback: true
    },
    function(req, token, tokenSecret, profile, done) {

        var query = {
            'twitter.id': profile.id
        };

        User.findOne(query, function(error, user) {
            if(user) {
                console.log("found");
                done(null, user);
            }
            else {
                var user = new User;

                //user.email = profile.emails[0].value;
                user.image = profile._json.profile_image_url;
                user.displayName = profile.displayName;

                user.twitter = {}
                user.twitter.id = profile.id;
                user.twitter.token = token;

                user.save();
                done(null, user);
            }
        });

    }));
};
