/**
 * Created by Adries on 29/01/2016.
 */
var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var cyclingroutesSchema  = mongoose.model('CyclingRoutes');

var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});
//GET first page
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });

});

/* POST signup submit. */
router.post('/signup', function(req, res, next) {
  //checking username and password
    if(!req.body.email || !req.body.password || !req.body.name || !req.body.username){
      return res.status(400).json({message:"Please fill out all fields"});
    }

    var user = new User();

    user.email = req.body.email;
    user.username = req.body.username;
    user.setPassword(req.body.password);
    user.name = req.body.name;

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
  if(!req.body.email || !req.body.password){
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
module.exports = router;


//Getting routes from DB
router.get('/showRoutes', auth , function (req,res,next){

    console.log(req.payload._id);
    //returns a user with all cycling routes data
    User.findById(req.payload._id).populate("routes")
        //cyclingroutesSchema.find({})
        //    .select("_id routename");

    .exec(function(err, user) {
        if(err){
            next(err);
        }
        console.log(user);
            res.json(user.routes);

    });

});


//
//user.routes = [];
//user.save(function(err){
//    if(err){
//        next(err);
//    }
//    res.json("dslk;xfk");
//});


router.get('/routes/:id', function(req,res,next){
    var id = req.params.id;

    var query = cyclingroutesSchema.findById(id);

    query.exec(function(err, route) {
        if(err){
            next(err);
            res.send(err);
        }else{
            res.json(route);
        }
    });
});

    //storing the cycling routes
router.post('/uploadRoutes', auth, function(req,res, next){

    //check if the body isnt empty
    if(!req.body){
        return res.status(400).json({message:"Empty file"});
    }
    //creating a route and putting the information from the req in the schema
    var routes = new cyclingroutesSchema();
    routes.createdBy = req.payload._id; //gets the current user id
    routes.geom.coordinates = req.body.route.routesArray;
    routes.routename = req.body.route.routeName;

    routes.save(function (err, route) {
        if(err){
            next(err);
            console.log(err);
            res.send(err);

        }

        //assosicating routes to user
        User.findById(req.payload._id)  //getting id from token
            .exec(function(err, user, next){
                if(err){
                    next(err);
                    console.log(err);
                }
                user.routes.push(route._id);
                user.save(function(err){
                    if(err){
                        next(err);
                        console.log(err);
                    }
                    res.json(route);
                });
            });
    });
});
