/**
 * Created by Adries on 10/04/2016.
 */

(function () {
    'use strict';

    var app = angular.module('cyclingblog');

    app.controller('navBar', ['$state','$scope', 'auth',
        function ($state, $scope, auth) {

            $scope.logout = function(){
                auth.logout();
                $state.go('preview');
            };

            //assigns username to the scope
            $scope.userName = auth.currentUser();

        }]);

}());