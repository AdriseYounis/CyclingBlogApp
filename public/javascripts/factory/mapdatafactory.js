/**
 * Created by Adries on 23/02/2016.
 */

(function () {
    'use strict';

    var app = angular.module('cyclingblog');

    app.factory('mapdatafactory', [
        '$http',
        'auth',
            function($http, auth){

                var mapdata = {};

                mapdata.uploadRoutes = function(routesArray){

                    return $http.post('/uploadRoutes', {routesArray1: routesArray},
                        {headers: {Authorization:'Bearer '+ auth.getToken()}}) //only logged users upload routes
                        .then(function(data){
                            return data.data;
                        },
                            function(data){
                            console.log(data);
                        });

                };

                mapdata.getRoutes = function(){

                };

                return mapdata;
    }]);


}());