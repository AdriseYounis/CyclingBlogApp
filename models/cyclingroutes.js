/**
 * Created by Adries on 25/01/2016.
 */

var mongoose = require('mongoose');

var CyclingRoutesSchema = new mongoose.Schema({

    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},

    geom: {
        type: {
            type: String,
            required: true,
            enum: [
                'Point',
                'LineString',
                'Polygon',
                'MultiPoint'
            ],
            default:"LineString"
        },
        coordinates: {type: [mongoose.Schema.Types.Mixed]}

    }
});

CyclingRoutesSchema.index({"geom": "2dsphere", sparse: true});
mongoose.model('CyclingRoutes', CyclingRoutesSchema);
