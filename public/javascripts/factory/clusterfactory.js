/**
 * Created by Adries on 12/03/2016.
 */

(function () {
    'use strict';

    var app = angular.module('cyclingblog');

    app.factory('clusterfactory', ['$http', 'auth', '$q',

        function($http, auth, NgMap, $q){

            var clusterData = {};

                //loop through to the data that has been uploaded and return it
            clusterData.processRouteData = function(data){
                var coordinates = data.geom.coordinates.map(function (coor) {
                    var latlon = new L.LatLng(coor[0], coor[1]); //get the lat//lon
                    return latlon;
                });


                return coordinates;
            };

                //creating an array of markers

            clusterData.createMarkers = function (data) {
                var markers = new L.MarkerClusterGroup();

                for(var g = 0; g < data.length; g++){
                    var title = "adrise";
                    var m =  new L.Marker(
                        data[g],
                        {title:title}
                    );

                    m.bindPopup(title);
                    markers.addLayer(m);
                }
                return markers;
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


            //not using


            ////cluster a single route
            //clusterData.clusterMarkers = function (markers) {
            //    return NgMap.getMap().then(function(map) {
            //        return new MarkerClusterer(map, markers, {});
            //    });
            //};
            //
            ////cluster multiple routes
            //clusterData.clusterMultipleRoutes = function(multiMarkerArray){
            //    return NgMap.getMap().then(function(map) {
            //        var flatMarkers = [];
            //        for (var i = 0; i < multiMarkerArray.length; i++) {
            //            Array.prototype.push.apply(flatMarkers, multiMarkerArray[i]);
            //        }
            //        return new MarkerClusterer(map, flatMarkers, {});
            //    });
            //};

        }]);
}());
