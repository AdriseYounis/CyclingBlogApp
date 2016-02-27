(function () {
    'use strict';

    var app = angular.module('cyclingblog');

    app.controller('homepage', ['$scope', '$state', 'auth','$window','mapdatafactory', 'NgMap', '$interval',
            function ($scope,$state, auth, $window, mapdatafactory, NgMap, $interval) {

                $scope.markers = [];

            $scope.logout = function(){
                auth.logout();
                $state.go('preview');
            };

            $scope.userName = auth.currentUser();
                $scope.mapCenter  = "current-location";

            $(".route-upload").hide();

            $('#file').change(function(evt) {
                $("#btnuploadremove").removeAttr("disabled");
                $("#btnuploadremove1").removeAttr("disabled");
            });

            function AddBlog() {

                window.location = "/addblog.html";
            }

            $( "#showFileUpload" ).click(function() {
                $(this).attr("disabled", "disabled");
                $(".route-upload").show();
            });

            $scope.GetFile = function() {

                var routesArray = [];
                var file = document.getElementById('file').files[0];

                if (!file) {
                        alert("File not uploaded");
                } else {

                    var reader = new FileReader();

                    reader.onloadend = function (theFile) {
                        var fileData = theFile.target.result;
                        var parser = new DOMParser();
                        var doc = parser.parseFromString(fileData, "application/xml");

                        var trkpt = doc.getElementsByTagName('trkpt');

                        for(var i = 0; i< trkpt.length; i++){
                            var lat = trkpt[i].getAttribute('lat');
                            var lon = trkpt[i].getAttribute('lon');
                            routesArray.push([parseFloat(lat), parseFloat(lon)]);
                        }

                        mapdatafactory.uploadRoutes(routesArray).then(function(data){

                            var coordinates = data.geom.coordinates.map(function(coor){

                                var latlon = new google.maps.LatLng(coor[0],coor[1]);

                                return latlon;
                            });

                            $scope.points = coordinates;
                            $scope.mapCenter = coordinates[0];

                            NgMap.getMap().then(function(map) {
                                var count = 0;
                                var line = map.shapes.foo;
                                $interval(function() {
                                    count = (count + 1) % 200;
                                    var icons = line.get('icons');
                                    icons[0].offset = (count / 2) + '%';
                                    line.set('icons', icons);
                                }, 20);
                            });




                            for(var i = 0; i < coordinates.length; i=Math.floor(i+coordinates.length/7)){
                                console.log(i);
                                var marker = [];
                                marker.push(coordinates[i].lat());
                                marker.push(coordinates[i].lng());

                                $scope.markers.push(marker);
                            }
                            console.log($scope.markers);

                            var progress = parseInt(theFile.loaded / theFile.total * 100, 10);
                            $('#progress .progress-bar').css(
                                'width', progress + '%'
                            );
                        });

                    };

                    reader.readAsText(file);
                }
            };

    }]);

}());
