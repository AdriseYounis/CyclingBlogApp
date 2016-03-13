/**
 * Created by Adries on 12/03/2016.
 */

(function () {
    'use strict';

    var app = angular.module('cyclingblog');

    app.factory('postfactory',['$http','auth',
        function($http, $auth){

            var o = {
                posts:[]
            };

            return o;
        }]);
}());