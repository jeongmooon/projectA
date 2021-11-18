var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var userinfo = {
    user_id:req.session["user_id"], 
    username:req.session["username"],
    email:req.session["email"] 
  };

  res.render('index', 
            { title: 'Express', 
              userinfo:userinfo
            });
});

module.exports = router;
