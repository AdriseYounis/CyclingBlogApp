/**
 * Created by Adries on 25/01/2016.
 */

var mongoose = require('mongoose');

var CyclingRoutesSchema = new mongoose.Schema({

    //IMRAN VERSION
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
    //geo : { type: [Number], index: { type: '2dsphere', sparse: true } }

    //test:{type: [mongoose.Schema.Types.Mixed]}

    //FeatureCollection:{
    //    type:{type:String, default:"FeatureCollection"},
    //    Features: {
    //        type:{type:String, default:"Feature"},
                    loccc: {
                    type:{
                        type:String,
                        enum: [

                                    'LineString',
                                    'Polygon',
                                    'MultiPoint',
                                    'Point'
                                ],
                        default:"Point"
                    },
                    geo: {type: [mongoose.Schema.Types.Mixed]}
                    //index: {type: '2dsphere', sparse: true}
                }
            //}
    //}

    //Adrise Younis
    //createdBy: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
    ////geo : { type: [Number], index: { type: '2dsphere', sparse: true } }
    //lo: {
    //    //"type": {
    //    //    type: String,
    //    //    required: true,
    //    //    enum: [
    //    //        'Point',
    //    //        'LineString',
    //    //        'Polygon',
    //    //        'MultiPoint'
    //    //    ],
    //    //    default: 'Point'
    //    //},
    //
    //geo : { type: [Number], index: { type: '2dsphere', sparse: true } }
    //}

    //location: {
    //    'type': {
    //        type: String,
    //        required: true,
    //        enum: [
    //            'Point',
    //            'LineString',
    //            'Polygon',
    //            'MultiPoint'
    //        ],
    //        default: 'MultiPoint'
    //    },
    //    coordinates: [mongoose.Schema.Types.Mixed, {index: '2dsphere'}]
    //}


});
    CyclingRoutesSchema.index({"loccc": "2dsphere", sparse: true});
    mongoose.model('CyclingRoutes', CyclingRoutesSchema);

// Sets the created_at parameter equal to the current time
//CyclingRoutesSchema.pre('save', function(next){
//    now = new Date();
//    this.updated_at = now;
//    if(!this.created_at) {
//        this.created_at = now
//    }
//    next();
//});

// Indexes this schema in 2dsphere format (critical for running proximity searches)
//CyclingRoutesSchema.index({location: '2dsphere'}); //MongoDB and Mongoose to run geospatial queries on our user data.

//CyclingRoutesSchema.index({"location": "2dsphere"});

//coordinates: { type: [
//        { type : mongoose.Schema.Types.Mixed}
//    ] }

//    created_at: {type: Date, default: Date.now},
//updated_at: {type: Date, default: Date.now}


//var LocationObjectSchema = new mongoose.Schema({
//    'type': {
//        type: String,
//        required: true,
//        enum: ['Point', 'LineString', 'Polygon', 'MultiPoint'],
//        default: 'MultiPoint'
//    },
//    coordinates: [
//        [
//            { type: [ Number ]}
//        ]
//    ]
//});
//mongoose.model('LocationObject', LocationObjectSchema);
//
//var CyclingRoutesSchema = new mongoose.Schema({
//
//    createdBy: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
//
//    location: {
//        'type': {
//            type: String,
//            required: true,
//            enum: [
//                'Point',
//                'LineString',
//                'Polygon',
//                'MultiPoint'
//            ],
//            default: 'MultiPoint'
//        },
//        coordinates: [mongoose.Schema.Types.Mixed, {index: '2dsphere'}]
//    }
//});
//mongoose.model('CyclingRoutes', CyclingRoutesSchema);