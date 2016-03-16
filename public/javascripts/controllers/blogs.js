/**
 * Created by Adries on 15/03/2016.
 */

(function () {
    'use strict';

    var app = angular.module('cyclingblog');

    app.controller('blogs', ['$scope', '$state', '$stateParams','auth', 'postfactory',
        function ($scope, $state, auth, $stateParams, postfactory) {

            $scope.userName = auth.currentUser();

        }]);

}());