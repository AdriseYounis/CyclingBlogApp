/**
 * Created by Adries on 12/03/2016.
 */

(function () {
    'use strict';

    var app = angular.module('cyclingblog');

    app.factory('clusterfactory', ['$http', 'auth', 'NgMap', '$q',

        function($http, auth, NgMap, $q){

            var clusterData = {};

            //loop through to the data that has been uploaded and return it
            clusterData.processRouteData = function(data){
                var coordinates = data.geom.coordinates.map(function (coor) {
                    var latlon = new google.maps.LatLng(coor[0], coor[1]); //get the lat//lon
                    return latlon;
                });


                return coordinates;
            };


            //cluster a single route
            clusterData.clusterMarkers = function (markers) {
                return NgMap.getMap().then(function(map) {
                    console.log("map ", markers);
                    return new MarkerClusterer(map, markers, {});
                });
            };

            //cluster multiple routes
            clusterData.clusterMultipleRoutes = function(multiMarkerArray){
                return NgMap.getMap().then(function(map) {
                    var flatMarkers = [];
                    for (var i = 0; i < multiMarkerArray.length; i++) {
                        Array.prototype.push.apply(flatMarkers, multiMarkerArray[i]);
                    }
                    return new MarkerClusterer(map, flatMarkers, {});
                });
            };

            //creating an array of markers
            clusterData.createMarkers = function (data) {
                return data.map(function(item){
                    return new google.maps.Marker({position: item});
                });
            };


            //processing multi-routes
            clusterData.processMultiRoutes = function(routes){

                return routes.map(function (route) {
                       return clusterData.processRouteData(route);
                });
            };


            //creating array of markers for multi-routes
            clusterData.createMultiMarkers = function(multiRouteData){
              return multiRouteData.map(function (route) {
                    return clusterData.createMarkers(route);
                });

            };


            return clusterData;


        }]);
}());
