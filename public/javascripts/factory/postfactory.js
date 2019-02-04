/**
 * Created by Adries on 12/03/2016.
 */

(function () {
    'use strict';

    var app = angular.module('cyclingblog');

    app.factory('postfactory',['$http','auth',
        function($http, auth){

            var o = {
                posts:[]
            };

            //getting all the posts
            o.getAll = function() {
                return $http.get('/posts').success(function(data){
                    angular.copy(data, o.posts);
                });
            };

            //creating new posts
            o.create = function(post) {
                return $http.post('/posts', post,
                    {headers: {Authorization:'Bearer '+ auth.getToken()}}).success(function(data){
                    o.posts.push(data.data);
                });
            };

            //storing our likes
            o.upvote = function(post) {
                return $http.put('/posts/' + post._id + '/upvote', null,
                    {headers: {Authorization:'Bearer '+ auth.getToken()}})
                    .success(function(data){
                        post.upvotes += 1;
                    });
            };

            //retrieving a single post
            o.get = function(id) {
                return $http.get('/posts/' + id).then(function(res){
                    return res.data;
                });
            };

            //adding comments
            o.addComment = function(id, comment) {
                return $http.post('/posts/' + id + '/comments', comment, {headers: {Authorization:'Bearer '+ auth.getToken()}});
            };

            //allows to upvote for a comment
            o.upvoteComment = function(post, comment) {
                return $http.put('/posts/' + post._id + '/comments/'+ comment._id + '/upvote', comment,
                    {headers: {Authorization:'Bearer '+ auth.getToken()}})
                    .success(function(data){
                        comment.upvotes += 1;
                    });
            };

            o.myBlogs = function(){

                return $http.get('/myPosts',
                    {headers: {Authorization:'Bearer '+ auth.getToken()}}).then(function(res){
                    return res.data;
                });
            };


            return o;
        }]);
}());