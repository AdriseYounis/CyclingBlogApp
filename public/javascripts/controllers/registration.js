/**
 * Created by Adries on 31/01/2016.
 */
(function () {
    'use strict';

    var app = angular.module('cyclingblog');

    app.controller('registration',
        ['$scope', '$state', 'auth','postfactory',
            function ($scope, $state, auth,postfactory) {


                L.mapbox.accessToken = 'pk.eyJ1IjoiYWRyaXNlMjEyIiwiYSI6ImNpbHZibnQyMzAwN2p3MW02MmU1cnJlejMifQ.YYrz6UXV1v3znvcJLiIj-Q';

                var map = L.map('previewMap')
                    .addLayer(L.mapbox.tileLayer('mapbox.streets'))
                    .setView([52.48624, -1.89040], 8);


                $scope.user = {};

        $scope.signup = function(){
            console.log($scope.user);
            auth.signup($scope.user).error(function(error){
                $scope.error = error;
            }).then(function(){
                $state.go('homepage');
            });
        };

         $scope.login = function(){
             auth.logIn($scope.user).error(function(error) {
                $scope.error = error;
            }).then(function(){
                $state.go('homepage');
            });
         };

                $scope.showModal = function(){
                    $('#signupModel').modal('show');
                };

        $scope.posts = postfactory.posts;


        $scope.incrementUpvotes = function(post) {
            postfactory.upvote(post);
        };


    }]);

}());
