(function () {
    'use strict';

    var app = angular.module('cyclingblog');

    app.controller('homepage', ['$scope', '$state', 'auth','$window','mapdatafactory', '$interval','routes', 'clusterfactory',
            function ($scope,$state, auth, $window, mapdatafactory, $interval, routes, clusterfactory) {

                //create map
                L.mapbox.accessToken = 'pk.eyJ1IjoiYWRyaXNlMjEyIiwiYSI6ImNpbHZibnQyMzAwN2p3MW02MmU1cnJlejMifQ.YYrz6UXV1v3znvcJLiIj-Q';

                var map = L.map('map')
                    .addLayer(L.mapbox.tileLayer('mapbox.streets'))
                    .setView([52.48624, -1.89040], 8);


                var line_points = clusterfactory.processMultiRoutes(routes);

                L.multiPolyline(line_points, {color: 'red'}).addTo(map); //gets the line

                var multimarkers = clusterfactory.createMultiMarkers(line_points);

                for(var j = 0; j < multimarkers.length; j++){
                    map.addLayer(multimarkers[j]);
                }


                $scope.removeRoutes = function(item, index) {

                    mapdatafactory.removeRoute(item.route._id).then(function(deleteRoute){

                        $scope.routeobjects.splice(index, 1);


                        var LatLng = clusterfactory.processRouteData(deleteRoute);

                        var markers = clusterfactory.createMultiMarkers(LatLng);

                        var multiPolyline =  L.multiPolyline(LatLng, {color: 'red'});

                        map.removeLayer(markers);

                        var indx = -1;

                            for(var i = 0; i< multiPolyline.length; i++){

                                if(angular.equals(item.points, multiPolyline[i])){
                                    indx = i;
                                    break;
                                }
                            }

                                if(indx != -1){
                                    multiPolyline.splice(indx, 1);
                                }
                     });

                };

                //starts here

                $scope.mapCenter  = "current-location";
                $scope.multipoints = clusterfactory.processMultiRoutes(routes);

                //combine routes, multipoints, markers array of object
                $scope.routeobjects = [];
                var markers = [];
                for(var i = 0; i < routes.length; i++){
                    var points = clusterfactory.processRouteData(routes[i]);
                    var markersArr= clusterfactory.createMarkers(points);
                    $scope.routeobjects.push({
                        route:routes[i],
                        points:points,
                        markers:markersArr,
                        selected:true
                    });
                    markers.push(markersArr);
                }

                //clusterfactory.clusterMultipleRoutes(markers).then(function (data) {
                //    $scope.markerClusterer = data;
                //});

                $scope.selectingRoutes = function(index, points){

                    if(!$scope.routeobjects[index].selected){

                        $scope.markerClusterer.removeMarkers($scope.routeobjects[index].markers);

                        var idx = -1;

                        for(var i = 0; i<$scope.multipoints.length;i++){
                            if(angular.equals(points,$scope.multipoints[i])){
                                idx = i;
                                break;
                            }
                        }

                        if(idx != -1){
                            $scope.multipoints.splice(idx, 1);
                        }
                    }else{

                        $scope.multipoints.push(points);
                        $scope.markerClusterer.addMarkers($scope.routeobjects[index].markers);
                    }
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

                //$scope.removeRoutes = function(item, index){
                //    mapdatafactory.removeRoute(item.route._id).then(function(deleteRoute){
                //
                //        $scope.routeobjects.splice(index, 1);
                //
                //        $scope.markerClusterer.removeMarkers(item.markers);
                //
                //            var indx = -1;
                //
                //            for(var i = 0; i<$scope.multipoints.length;i++){
                //
                //                if(angular.equals(item.points,$scope.multipoints[i])){
                //                    indx = i;
                //                    break;
                //                }
                //            }
                //
                //            if(indx != -1){
                //                $scope.multipoints.splice(indx, 1);
                //            }
                //
                //    });
                //};

                $(".file-upload-btns").hide();

                $('input[type=file]').change(function(){

                    progressbarstatus(0);

                    if($("#file").val()) {

                        $(".file-upload-btns").show();
                    }
                });

                $scope.ResetUpload = function(){
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

                        if(extensionName != FileType.kmz || extensionName != FileType.gpx || extensionName != FileType.xml){
                            alert("Unable to upload the file because a unexpected file has been inserted");
                        }

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

                                    L.polyline(LatLng, {color: 'blue'}).addTo(map);

                                    var markers = clusterfactory.createMarkers(LatLng);

                                    map.addLayer(markers);

                                    progressbarstatus(100);

                                    //$scope.mapCenter = LatLng[1];
                                    //$scope.markerClusterer.addMarkers(markers);
                                    //$scope.routeobjects.push({
                                    //        route:data,
                                    //        points:LatLng,
                                    //        markers:markers,
                                    //        selected:true
                                    //});
                                    //$scope.multipoints.push(LatLng);




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