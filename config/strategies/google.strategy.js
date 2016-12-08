var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../../models/userModel');

module.exports = function() {

    passport.use(new GoogleStrategy({
        clientID: '1651225116-3hnnrn62q4eqrklsg84vdngvc7sg8koj.apps.googleusercontent.com',
        clientSecret: 'Jk-jhlfwWz6NWYkoeMDkKe2-',
        callbackURL: 'http://jessethomson.net:3000/auth/google/callback'},
        function(req, accessToken, refreshToken, profile, done) {

            var query = {
                'google.id':profile.id
            };
            User.findOne(query, function(error, user) {
                if(user) {
                    done(null, user);
                }
                else {
                    var user = new User;
                    user.email = profile.emails[0].value;
                    user.image = profile._json.image.url;
                    user.displayName = profile.displayName;

                    user.google = {}
                    user.google.id = profile.id;
                    user.google.token = accessToken;

                    user.save();
                    done(null, user);
                }
            })
        }
    ));
}
