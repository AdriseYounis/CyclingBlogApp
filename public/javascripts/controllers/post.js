/**
 * Created by Adries on 10/03/2016.
 */
(function () {
    'use strict';

    var app = angular.module('cyclingblog');

    app.controller('post', ['$scope', '$state', 'auth', 'postfactory',
            function ($scope, $state, auth, postfactory) {

                $scope.posts = postfactory.posts;

                console.log(postfactory.posts);

                $scope.userName = auth.currentUser();

                $('.post-btn').hide();
                $('.cancel-btn').show();

                $scope.showButtonsPlease = function(){

                    if((!$scope.htmlVariable || $scope.htmlVariable === '' && !$scope.title || $scope.title)) {
                        $('.post-btn').hide();
                    }
                    else{
                        $('.post-btn').show();
                    }
                };

                $scope.addPost = function(){

                    if(!$scope.htmlVariable || $scope.htmlVariable === '') { return; }

                    $scope.posts.push({title:$scope.title, message: $scope.htmlVariable, upvotes:0});
                    $scope.title ='';
                    $scope.htmlVariable ='';
                };

                $scope.incrementUpvotes = function(post) {
                    post.upvotes += 1;
                };

            }]);

}());