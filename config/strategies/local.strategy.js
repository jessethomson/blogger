var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var User = require('../../models/userModel');

module.exports = function () {
	passport.use(new LocalStrategy({
			usernameField: "userName",
			passwordField: "password"
		},
		function(username, password, done) {
				User.findOne({
						email: username
					},
					function(err, results) {
						if(err) {
							done(null, false, {message:"Bad password"});
						}
						else {
							if(results) {
								console.log(results)
								if(results.local.password === password) {
									var user = results;
									user.local.password == null;
									done(null, user);							
								}
							}
							else {
								done(null, false, {message:"Bad password"});
							}
						}
					}
				);
		}));
};