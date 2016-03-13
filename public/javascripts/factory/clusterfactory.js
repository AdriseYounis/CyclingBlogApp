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

            //clustering routes
            clusterData.clusterRoute = function (data) {

                //return NgMap.getMap().then(function (map) {

                    var markers = [];
                    for (var i = 0; i < data.length; i++) {

                        var marker = new google.maps.Marker({position: data[i]});
                        markers.push(marker);
                    }

                    //var markercluster = new MarkerClusterer(map, markers, {});

                    //return $q(function(resolve, reject){
                    //    if(markers){
                    //        resolve(markers);
                    //    }
                    //    else{
                    //        reject("Failed");
                    //    }
                    //});

                return markers;

                //},function(err){
                //    console.log(err);
                //});

            };


            //processing multi-routes
            clusterData.processMultiRoutes = function(routes){

                return routes.map(function (route) {
                       return clusterData.processRouteData(route);
                });
            };


            clusterData.clusterMultipleRoutes = function(multiRouteData){
              return multiRouteData.map(function (route) {
                    return clusterData.clusterRoute(route);
                });

                //return $q.all(promises).then(function(result){
                //   return result;
                //})
            };


            return clusterData;


        }]);
}());
