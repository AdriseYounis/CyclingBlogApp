/**
 * Created by Adries on 10/03/2016.
 */
(function () {
    'use strict';

    var app = angular.module('cyclingblog');

    app.controller('postcontroller', ['$scope', '$state', 'auth', 'postfactory',
            function ($scope, $state, auth, postfactory) {

                $scope.posts = postfactory.posts;

                $scope.userName = auth.currentUser();
                $('.post-btn').hide();

                $scope.showButtonsPlease = function(){

                    if((!$scope.htmlVariable || $scope.htmlVariable === '')) {
                        $('.post-btn').hide();
                    }
                    else{
                        $('.post-btn').show();
                    }
                };

                $scope.addPost = function(){

                    if(!$scope.htmlVariable || $scope.htmlVariable === '') { return; }

                    $scope.posts.push({title:$scope.htmlVariable, upvotes:0});
                    $scope.htmlVariable ='';

                };

                $scope.incrementUpvotes = function(post) {
                    post.upvotes += 1;
                };

            }]);

}());