var express = require('express');
var router = express.Router();
var User = require("../models/userModel");
var passport = require("passport");

router.get('/', function(req, res, next) {
	console.log("Yahooo!")
	if(req.user) {
		res.redirect("/users/" + req.user._id)
	}
	else {
		res.redirect("/login")
	}
});

router.get('/users', function(req, res, next) {
	
	User.find({}, function(error, users) {
        if(users) {
            res.json(users);
        }
        else {
        	res.send("Error: Problem retrieving users from database");
        }
    });
});

router.get('/users/:id', function(req, res, next) {
	
	User.findById(req.params.id, function(error, pageOwner) {
        if(pageOwner) {
            res.render('users', { authUser: req.user, pageOwner: pageOwner});
        }
        else {
        	res.redirect("/login")
        }
    });
});

router.get('/logout', function(req, res){
	req.logout();
	req.session.destroy();
	res.clearCookie('connect.sid');
	res.redirect('/login');
});


router.post('/users/:id/post', function(req, res, next) {
	
	User.findByIdAndUpdate(req.params.id, 
		{$push: {"posts": req.body}},
		{new: true},
		function(error, user) {
        if(user) {
            res.json(user);
        }
        else {
        	res.send(error)
        }
    });
});

router.post('/users/:id/post/:postId/comment', function(req, res, next) {
	
	User.findById(req.params.id, 
		function(error, user) {
        if(user) {
        	console.log(user.posts)
        	var found = false;
        	for(var i=0; i<user.posts.length; i++) {
        		if(user.posts[i]._id == req.params.postId) {
        			found = true;
        			user.posts[i].comments.push(req.body);
        			user.save();
        			res.json(user.posts[i]);
        			break;
        		}
        	}
        	if(!found) {
        		res.redirect("/login")
        	}
        }
        else {
        	res.send(error)
        }
    });
});

router.get('/login', function(req, res, next) {
	res.render('login', { title: "Blogger" });
});

router.get('/register', function(req, res, next) {
	res.render('register', { title: "Blogger" });
});

router.route("/signIn")
	.post(passport.authenticate("local", {
		failureRedirect: "/login"
	}), function(req, res) {
		res.redirect("/");
	});

router.route("/signUp").post(function(req,res) {

	var user = new User;
    user.email = req.body.userName;
    user.displayName = req.body.userName;

    user.local = {}
    user.local.password = req.body.password;
    // user.save();
	user.save(function(err, results) {
		if(err) {
			console.log(err);
		}
		else {
			console.log(results);
			console.log(user)
			req.login(user, function() {
				res.redirect("/");
			});
		}
	})

});


module.exports = router;
