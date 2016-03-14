(function () {
    'use strict';

    var app = angular.module('cyclingblog');

    app.controller('homepage', ['$scope', '$state', 'auth','$window','mapdatafactory', 'NgMap', '$interval','routes','$location', 'clusterfactory',
            function ($scope,$state, auth, $window, mapdatafactory, NgMap, $interval, routes, $location, clusterfactory) {

                $scope.mapCenter  = "current-location";
                $scope.multipoints = clusterfactory.processMultiRoutes(routes);

                //combine routes, multipoints, markers array of object

                $scope.routeobjects = [];
                var markers = [];
                for(var i = 0; i < routes.length; i++){
                    var points = clusterfactory.processRouteData(routes[i]);
                    var markersArr= clusterfactory.createMarkers(points);
                    $scope.routeobjects.push({route:routes[i],points:points,markers:markersArr,selected:true});
                    markers.push(markersArr);
                }

                clusterfactory.clusterMultipleRoutes(markers).then(function (data) {
                    $scope.markerClusterer = data;
                });

                $scope.selectingRoutes = function(index, points){
                    if(!$scope.routeobjects[index].selected){
                        $scope.markerClusterer.removeMarkers($scope.routeobjects[index].markers);
                        var idx = -1;

                        for(var i = 0; i<$scope.multipoints.length;i++){
                            if(angular.equals(points,$scope.multipoints[i])){
                                idx = i;
                                break;
                            };
                        }
                        console.log(idx);


                        if(idx != -1){
                            $scope.multipoints.splice(idx, 1);
                        }
                    }else{

                        $scope.multipoints.push(points);
                        $scope.markerClusterer.addMarkers($scope.routeobjects[index].markers);
                    }
                };

                $scope.WriteBlog = function() {
                    $location.path("post");
                };

                $scope.displayRoute = function(_id){

                        mapdatafactory.getSingleRoute(_id)
                            .then(function (data) {

                                 var LatLng = clusterfactory.processRouteData(data);
                                 clusterfactory.clusterRoute(LatLng).then(function(clusterItems){

                                     $scope.multiPoints.push(LatLng);
                                     $scope.color = randomColor({hue: 'random', luminosity: 'random'});
                                     $scope.mapCenter = LatLng[1];
                                     $scope.markerClusterer = clusterItems;
                                 });

                            },
                                function(err){
                                console.log(err);
                            });
                };

                $(".file-upload-btns").hide();

                $('input[type=file]').change(function(){

                    progressbarstatus(0);

                    if($("#file").val()) {

                        $(".file-upload-btns").show();
                    }
                });

                $scope.ResetUpload = function(){
                    $scope.multiPoints = [];
                    $scope.markerClusterer.clearMarkers();
                    $("#file").val('').clone(true);
                    progressbarstatus(0);
                    $(".file-upload-btns").hide();
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


                            //send the array of lat and long values to the uploadroutes factory
                            mapdatafactory.uploadRoutes(route)
                                .then(function(data){

                                    var LatLng = clusterfactory.processRouteData(data);

                                    var markers = clusterfactory.createMarkers(LatLng);

                                    $scope.mapCenter = LatLng[1];
                                    $scope.markerClusterer.addMarkers(markers);
                                    $scope.routeobjects.push({
                                            route:data,
                                            points:LatLng,
                                            markers:markers,
                                            selected:true
                                    });
                                    $scope.multiPoints.push(LatLng);


                                    progressbarstatus(100);

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

                function progressbarstatus(status){

                    $('#progress .progress-bar').css(
                        'width', status + '%'
                    );
                }

    }]);

}());