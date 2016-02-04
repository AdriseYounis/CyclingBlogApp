/**
 * Created by Adries on 31/01/2016.
 */
var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

//creating user schema
var userSchema = new mongoose.Schema({
    username:{
        type:String,
        lowercase:true,
        unique:true
    },
    hash:String,
    salt:String
});

//creating setPasswordMethod to set the password and secure it
userSchema.methods.setPassword = function(password){
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex'); //password, salt, iterations, and key length.
};

//method that accepts a password and compares it to the hash stored, returning a boolean.
userSchema.methods.validPassword = function(password){
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
    return this.hash = hash;
};

//generating tokens for a user
userSchema.methods.generateJWT = function(){
    // set expiration to 60 days
    var today = new Date();
    var exp = new Date(today);

    exp.setDate(today.getDate() + 60);

    return jwt.sign({
        _id: this._id, //payload, server and client has access
        username: this.username,
        exp: parseInt(exp.getTime() / 1000), //check if the token expires, exp value in the payload is a Unix timestamp in seconds
    }, 'SECRET'); //secret used to sign our tokens & should be a environment variable for referencing the secret and keep it out of your codebase.
};

mongoose.model('User', userSchema);