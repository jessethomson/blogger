var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	if(req.user) {
  		res.render('users', { user: req.user });
	}
	else {
		res.redirect("../login")
	}
});

module.exports = router;
