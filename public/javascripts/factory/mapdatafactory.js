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

                mapdata.uploadRoutes = function(route){

                    return $http.post('/uploadRoutes', {route: route},
                        {headers: {Authorization:'Bearer '+ auth.getToken()}}) //only logged users upload routes
                        .then(function(data){
                            return data.data;
                        },
                            function(data){
                        });

                };

                mapdata.getRoutes = function(){

                    return $http.get('/showRoutes', {headers: {Authorization:'Bearer '+ auth.getToken()}})
                        .then(function(data){
                                return data.data;
                            },
                            function(data){
                            });

                };

                mapdata.getCoordinates = function (_id) {
                          return $http.get('/routes/'+_id, {headers: {Authorization:'Bearer '+ auth.getToken()}})
                              .then(function(data){
                                      return data.data;
                                  },
                                  function(data){
                                  });

                };

                return mapdata;
    }]);


}());