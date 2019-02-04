/**
 * Created by Adries on 10/04/2016.
 */

(function () {
    'use strict';

    var app = angular.module('cyclingblog');

    app.controller('blog', ['$scope', '$state', '$stateParams', 'postfactory', 'post','clusterfactory',
        function ($scope, $state, $stateParams, postfactory, post,clusterfactory) {

            $scope.post = postfactory.posts[$stateParams.id];

            $scope.post = post;


            L.mapbox.accessToken = 'pk.eyJ1IjoiYWRyaXNlMjEyIiwiYSI6ImNpbHZibnQyMzAwN2p3MW02MmU1cnJlejMifQ.YYrz6UXV1v3znvcJLiIj-Q';

            var map = L.map('blogMap')
                .addLayer(L.mapbox.tileLayer('mapbox.streets'))
                .setView([52.48624, -1.89040], 8);


            var line_points = clusterfactory.processRouteData(post.route);

            L.polyline(line_points, {color: 'blue'}).addTo(map);

            var markers = clusterfactory.createMarkers(line_points);

            map.addLayer(markers);

            map.setView(line_points[0], line_points[line_points -1], 10);


            //saving the comments
            $scope.addComment = function(){

                if($scope.body === '') {
                    return;
                }
                postfactory.addComment(post._id, {
                    body: $scope.body,
                    author: 'user'
                }).success(function(comment) {
                    $scope.post.comments.push(comment);
                });
                $scope.body = '';

            };

            $(".cancel-btn").click(function(){
                $state.go("blogs");
            });

            $scope.incrementUpvotes = function(comment){
                postfactory.upvoteComment(post, comment);
            };


        }]);

}());