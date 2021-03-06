/**
 * Created by Adries on 23/02/2016.
 */

(function () {
    'use strict';

    var app = angular.module('cyclingblog');

    app.factory('mapdatafactory', ['$http', 'auth',
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

                mapdata.getAllRoutes = function(){

                    return $http.get('/showRoutes', {headers: {Authorization:'Bearer '+ auth.getToken()}})
                        .then(function(data){
                                return data.data;
                            },
                            function(data){
                            });
                };

                mapdata.getSingleRoute = function (_id) {

                    return $http.get('/routes/'+_id, {headers: {Authorization:'Bearer '+ auth.getToken()}})
                              .then(function(data){

                                  return data.data;

                                  },
                                  function(data){
                                      console.log(data);
                                  });

                };

                mapdata.removeRoute = function (_id) {

                    return $http.delete('/routes/'+_id, {headers: {Authorization:'Bearer '+ auth.getToken()}})
                        .then(function(data){
                                console.log(data);
                                return data.data;
                            },
                            function(data){
                                console.log(data);
                            });

                };

                return mapdata;
    }]);


}());