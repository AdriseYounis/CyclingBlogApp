/**
 * Created by Adries on 31/01/2016.
 */
(function () {
    'use strict';

    var app = angular.module('cyclingblog');

    app.controller('registration',
        ['$scope', '$state', 'auth',
            function ($scope, $state, auth) {

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
    }]);

}());
