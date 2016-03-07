(function () {
    'use strict';

    var app = angular.module('cyclingblog');

    app.controller('homepage', ['$scope', '$state', 'auth','$window','mapdatafactory', 'NgMap', '$interval','routes',
            function ($scope,$state, auth, $window, mapdatafactory, NgMap, $interval, routes) {

                $scope.markers = [];
                $scope.mapCenter  = "current-location";
                $scope.dynMarkers = [];
                $scope.routes = routes;
                console.log($scope.routes);

                console.log($scope.routes[0]);

                $scope.displayRoute = function(_id){

                    mapdatafactory.getCoordinates(_id)
                        .then(function(data){
                            console.log(data);

                    //loop through to the data that has been uploaded and return it
                    var coordinates1 = data.geom.coordinates.map(function(coor){

                        //get the latlon
                        var latlon = new google.maps.LatLng(coor[0],coor[1]);

                        return latlon;

                    });
                        //assign the latlon values to points which is the path of the route
                        $scope.points = coordinates1;
                        //set the position of the map
                        $scope.mapCenter = coordinates1[1];

                        //animate the dot to go around the route
                        NgMap.getMap().then(function(map) {
                            var count = 0;
                            var line = map.shapes.foo;
                            $interval(function() {
                                count = (count + 1) % 200;
                                var icons = line.get('icons');
                                icons[0].offset = (count / 2) + '%';
                                line.set('icons', icons);
                            }, 100);


                            for (var i = 0; i < coordinates1.length; i++) {
                                var marker = new google.maps.Marker({position: coordinates1[i]});
                                $scope.dynMarkers.push(marker);
                            }

                            $scope.markerClusterer = new MarkerClusterer(map, $scope.dynMarkers, {});

                        });
                    });
                };

                $(".file-upload-btns").hide();

                $('input[type=file]').change(function(){

                    if($("#file").val()) {

                        $(".file-upload-btns").show();
                    }
                });

                $scope.ResetUpload = function(){
                   //reset the file upload
                    // clear the map
                    //file progress is set to 0;
                };

                //logs users out and returns them to the homepage
                $scope.logout = function(){
                    auth.logout();
                    $state.go('preview');
                };

                //assigns username to the scope
                $scope.userName = auth.currentUser();

                //files types
                const FileType = {
                    xml: 'xml',
                    gpx: 'gpx',
                    kmz: 'kmz'
                };

                //gets the file reads the data stores it in an array and send it to the database
                $scope.GetFile = function() {

                    //storing the coordinates that are parsed into a array
                    var routesArray = [];
                    //reading the file
                    var file = document.getElementById('file').files[0];
                    //getting the file name
                    var filename = file.name;
                    //getting the file type
                    var extensionName = filename.split('.').pop();

                    if (!file) {
                            alert("File not uploaded");
                    } else {

                        //file reader to read the file
                        var reader = new FileReader();

                        reader.onloadend = function (theFile) {

                            //get the file data
                            var fileData = theFile.target.result;
                            var parser = new DOMParser();
                            //parse the filedata to the parser
                            var doc = parser.parseFromString(fileData, "application/xml");

                            //check the file type
                            if(extensionName == FileType.kmz){

                                //if its kmz then unzip the file
                                var zip = new JSZip(fileData);
                                //get the doc.kml document from the zip file
                                var xmlFile = zip.file("doc.kml").asText();
                                var document = parser.parseFromString(xmlFile, "application/xml");
                                //get the linestring element
                                var LineString = document.getElementsByTagName("LineString");
                                //get linestring data
                                var coordinate = LineString.item(0).firstChild.textContent;
                                //split the data into a array
                                var coordinateIndex = coordinate.split("\n");

                                //loop through the length of the array
                                for(var i = 0; i < coordinateIndex.length; i++){
                                    var split = coordinateIndex[i].split(',');
                                    //get the lat and long values
                                    var lat = split[1];
                                    var lng = split[0];
                                    //add it to the array
                                    routesArray.push([parseFloat(lat), parseFloat(lng)]);
                                }

                            }

                            //get the trkpt element
                            var trkpt = doc.getElementsByTagName('trkpt');

                            //loop through the length of the trkpt
                            for(var i = 0; i< trkpt.length; i++){

                                //get the lat and lon values
                                var lat = trkpt[i].getAttribute('lat');
                                var lon = trkpt[i].getAttribute('lon');
                                //add the lat long to the array
                                routesArray.push([parseFloat(lat), parseFloat(lon)]);
                            }

                            var route = {
                                routesArray: routesArray,
                                routeName: file.name
                            };


                            //send the array of at and long values to the uploadroutes factory
                            mapdatafactory.uploadRoutes(route)
                                .then(function(data){

                                    routes.push({
                                        _id:data._id,
                                        routename: data.routename
                                    });


                                //loop through to the data that has been uploaded and return it
                                var coordinates = data.geom.coordinates.map(function(coor){

                                    //get the latlon
                                    var latlon = new google.maps.LatLng(coor[0],coor[1]);

                                    return latlon;

                                });

                                //assign the latlon values to points which is the path of the route
                                 $scope.points = coordinates;
                                //set the position of the map
                                $scope.mapCenter = coordinates[1];

                                //animate the circle to go around the line
                                NgMap.getMap().then(function(map) {
                                    var count = 0;
                                    var line = map.shapes.foo;
                                    $interval(function() {
                                        count = (count + 1) % 200;
                                        var icons = line.get('icons');
                                        icons[0].offset = (count / 2) + '%';
                                        line.set('icons', icons);
                                    }, 100);


                                    for (var i = 0; i < coordinates.length; i++) {
                                        var marker = new google.maps.Marker({position: coordinates[i]});
                                        $scope.dynMarkers.push(marker);
                                    }

                                    $scope.markerClusterer = new MarkerClusterer(map, $scope.dynMarkers, {});

                                });


                                var progress = parseInt(theFile.loaded / theFile.total * 100, 10);

                                $('#progress .progress-bar').css(
                                    'width', progress + '%'
                                );

                            });
                        };

                        //checking the filetype
                        if(extensionName == FileType.kmz) {
                            //reading as a array buffer
                            reader.readAsArrayBuffer(file);
                        }
                        else{
                            //reading as text
                            reader.readAsText(file); //only works with gpx and xml
                        }

                    }
                };

    }]);

}());