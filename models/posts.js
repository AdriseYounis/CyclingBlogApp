/**
 * Created by Adries on 10/04/2016.
 */

var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
    title: String,
    route:{type: mongoose.Schema.Types.ObjectId, ref: 'CyclingRoutes'},//needs to be our routes
    upvotes: {type: Number, default: 0},
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comments' }],
    blogBody:String,
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});


PostSchema.methods.upvote = function(cb) {
    this.upvotes += 1;
    this.save(cb);
};

mongoose.model('posts', PostSchema);