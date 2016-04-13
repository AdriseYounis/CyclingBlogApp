/**
 * Created by Adries on 10/04/2016.
 */

var mongoose = require('mongoose');

//definition of the comments schema
var CommentSchema = new mongoose.Schema({
    body: String,
    author: String,
    upvotes: {type: Number, default: 0},
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'posts' }
});

//method for upvote that saves the vote number
CommentSchema.methods.upvote = function(cb) {
    this.upvotes += 1;
    this.save(cb);
};

mongoose.model('comments', CommentSchema);