/**
 * Created by Adries on 10/04/2016.
 */

(function () {
    'use strict';

    var app = angular.module('cyclingblog');

    app.controller('myBlogs', ['$scope', 'auth', 'postfactory', 'myBlogs',
        function ($scope, auth, postfactory, myBlogs) {

            $scope.userName = auth.currentUser();

            $scope.posts = myBlogs;

            $scope.incrementUpvotes = function(post) {
                postfactory.upvote(post);
            };


        }]);

}());