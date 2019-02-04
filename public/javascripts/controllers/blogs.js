/**
 * Created by Adries on 15/03/2016.
 */

(function () {
    'use strict';

    var app = angular.module('cyclingblog');

    app.controller('blogs', ['$scope', 'postfactory',
        function ($scope, postfactory) {

            $scope.posts = postfactory.posts;

            $scope.incrementUpvotes = function(post) {
                postfactory.upvote(post);
            };

        }]);

}());