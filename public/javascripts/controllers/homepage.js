(function () {
    'use strict';

    var app = angular.module('cyclingblog');

    app.controller('homepage', ['$scope', '$state','$window','mapdatafactory', '$interval','routes', 'clusterfactory',
            function ($scope,$state, $window, mapdatafactory, $interval, routes, clusterfactory) {

                //combine routes, multipoints, markers array of object
                $scope.routeobjects = [];
                var layergroup = L.layerGroup();

                //create map
                L.mapbox.accessToken = 'pk.eyJ1IjoiYWRyaXNlMjEyIiwiYSI6ImNpbHZibnQyMzAwN2p3MW02MmU1cnJlejMifQ.YYrz6UXV1v3znvcJLiIj-Q';

                var map = L.map('map')
                    .addLayer(L.mapbox.tileLayer('mapbox.streets'))
                    .setView([52.48624, -1.89040], 8);

                var line_points = clusterfactory.processMultiRoutes(routes);
                var multimarkers = clusterfactory.createMultiMarkers(line_points);


                for(var j = 0; j < multimarkers.length; j++){
                    var polyline = L.polyline(line_points[j]);
                    layergroup.addLayer(polyline).addTo(map);
                    map.addLayer(multimarkers[j]);

                    $scope.routeobjects.push({
                        route:routes[j],
                        //points:line_points[j],
                        polyline:polyline,
                        markers:multimarkers[j],
                        selected:true
                    });
                }

                //$scope.removeRoutes = function(item, index) {
                //
                //    mapdatafactory.removeRoute(item.route._id).then(function(deleteRoute){
                //
                //        $scope.routeobjects.splice(index, 1);
                //
                //
                //        var LatLng = clusterfactory.processRouteData(deleteRoute);
                //
                //        var markers = clusterfactory.createMultiMarkers(LatLng);
                //
                //        var multiPolyline =  L.multiPolyline(LatLng, {color: 'red'});
                //
                //        map.removeLayer(markers);
                //
                //        var indx = -1;
                //
                //            for(var i = 0; i< multiPolyline.length; i++){
                //
                //                if(angular.equals(item.points, multiPolyline[i])){
                //                    indx = i;
                //                    break;
                //                }
                //            }
                //
                //                if(indx != -1){
                //                    multiPolyline.splice(indx, 1);
                //                }
                //     });
                //
                //};

                //starts here

                $scope.selectingRoutes = function(index, points){

                    if(!$scope.routeobjects[index].selected){
                        map.removeLayer($scope.routeobjects[index].markers);
                        layergroup.removeLayer($scope.routeobjects[index].polyline);
                    }else{
                        map.addLayer($scope.routeobjects[index].markers);
                        layergroup.addLayer($scope.routeobjects[index].polyline);
                    }
                };

                $scope.removeRoutes = function(item, index){
                    mapdatafactory.removeRoute(item.route._id).then(function(deleteRoute){
                        map.removeLayer($scope.routeobjects[index].markers);
                        layergroup.removeLayer($scope.routeobjects[index].polyline);
                        $scope.routeobjects.splice(index,1);
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
                    $("#file").val('').clone(true);
                    progressbarstatus(0);
                    $(".file-upload-btns").hide();
                };

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

                                    var newPolyline = L.polyline(LatLng, {color: 'blue'});

                                    var markers = clusterfactory.createMarkers(LatLng);

                                    layergroup.addLayer(newPolyline).addTo(map);
                                    map.addLayer(markers);

                                    map.fitBounds(newPolyline.getBounds());


                                    $scope.routeobjects.push({
                                        route:data,
                                        polyline:newPolyline,
                                        markers:markers,
                                        selected:true
                                    });

                                    console.log('the data',data);
                                    console.log('the latlng',LatLng);

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