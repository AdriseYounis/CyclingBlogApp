/**
 * Created by Adries on 10/04/2016.
 */

(function () {
    'use strict';

    var app = angular.module('cyclingblog');

    app.controller('myBlogs', ['$scope', 'postfactory', 'myBlogs',
        function ($scope, postfactory, myBlogs) {

            $scope.posts = myBlogs;

            $scope.incrementUpvotes = function(post) {
                postfactory.upvote(post);
            };


        }]);

}());