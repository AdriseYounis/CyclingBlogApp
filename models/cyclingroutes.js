/**
 * Created by Adries on 25/01/2016.
 */

var mongoose = require('mongoose');

var CyclingRoutesSchema = new mongoose.Schema({
    location: {type: [Number], required: true},// [Long, Lat]
    htmlverified: String, //Whether or not a user’s location has been
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}

});

// Sets the created_at parameter equal to the current time
CyclingRoutesSchema.pre('save', function(next){
    now = new Date();
    this.updated_at = now;
    if(!this.created_at) {
        this.created_at = now
    }
    next();
});

// Indexes this schema in 2dsphere format (critical for running proximity searches)
CyclingRoutesSchema.index({location: '2dsphere'}); //MongoDB and Mongoose to run geospatial queries on our user data.

mongoose.model('CyclingRoutes', CyclingRoutesSchema);
