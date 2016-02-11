/**
 * Created by Adries on 31/01/2016.
 */

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');

//created a LocalStrategy where a user username and password is authenticated
passport.use(new LocalStrategy({usernameField:"email", passwordField:"password"},
    function(email, password, done) {
        //checking the email field is matching with the one passed in
        User.findOne({ email: email }, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, { message: 'Incorrect email.' });
            }
            if (!user.validPassword(password)) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });
    }
));
