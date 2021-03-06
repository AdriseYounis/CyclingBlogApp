/**
 * Created by Adries on 10/03/2016.
 */
(function () {
    'use strict';

    var app = angular.module('cyclingblog');

    app.controller('post', ['$scope', '$state', 'postfactory', 'route', 'clusterfactory',
            function ($scope, $state, postfactory, route, clusterfactory) {


                L.mapbox.accessToken = 'pk.eyJ1IjoiYWRyaXNlMjEyIiwiYSI6ImNpbHZibnQyMzAwN2p3MW02MmU1cnJlejMifQ.YYrz6UXV1v3znvcJLiIj-Q';

                var map = L.map('blogMap')
                    .addLayer(L.mapbox.tileLayer('mapbox.streets'))
                    .setView([52.48624, -1.89040], 8);


                var line_points = clusterfactory.processRouteData(route);

                L.polyline(line_points, {color: 'blue'}).addTo(map);

                var markers = clusterfactory.createMarkers(line_points);

                map.addLayer(markers);

                map.setView(line_points[0], line_points[line_points -1], 10);


                $('.post-btn').show();
                $('.cancel-btn').show();

                $(".cancel-btn").click(function(){
                    $state.go("homepage");
                });


                $scope.CheckForm = function(){

                    if($scope.htmlVariable === '' && $scope.title === ''){

                        alert("Please insert a title or else the blog would not be posted");

                    }
                };

                $scope.addPost = function(){

                    if(!$scope.title || $scope.title === '') { return; }
                    postfactory.create({
                        title: $scope.title,
                        route: route._id,
                        blogBody: $scope.htmlVariable
                    }).then(function(data){
                        $state.go("blogs");
                    });

                };

            }]);

}());