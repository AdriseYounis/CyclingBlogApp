/**
 * Created by Adries on 29/01/2016.
 */
var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var jwt = require('express-jwt');

//GET first page
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });

});

/* POST signup submit. */
router.post('/signup', function(req, res, next) {
  //checking username and password
    console.log(req.body);
    if(!req.body.username || !req.body.password){
      return res.status(400).json({message:"Please fill out all fields"});
    }

    var user = new User();

    user.username = req.body.username;
    user.setPassword(req.body.password);

    user.save(function(err){
        if(err){
          return next(err);
        }
      return res.json({token:user.generateJWT()})
    });
});

/* GET login submit. */
router.post('/login', function(req, res, next){
  //checking username and password
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  passport.authenticate('local', function(err, user, info){ //uses the local strategy created in config file
    if(err){ return next(err); }

    if(user){
      return res.json({token: user.generateJWT()}); //create user a token
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

//The userPropery option specifies which property on req to put our payload
//use the middleware we just defined to require authentication on specific routes
//authenticate users whenever they try to write to our application
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

module.exports = router;
