/**
 * Created by Adries on 25/01/2016.
 */

var mongoose = require('mongoose');

var gpsRoutesSchema = new mongoose.Schema({
    longitude: String,
    latitude: String,
    time: {type: Date}
});

mongoose.model('gpsroutes', gpsRoutesSchema);