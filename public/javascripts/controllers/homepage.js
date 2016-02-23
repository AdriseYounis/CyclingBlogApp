(function () {
    'use strict';

    var app = angular.module('cyclingblog');

    app.controller('homepage',
        ['$scope', '$state', 'auth','$window','mapdatafactory',
            function ($scope,$state, auth, $window, mapdatafactory) {

                $scope.wayPoints = [];

        //logout function
            $scope.logout = function(){
                auth.logout();
                $state.go('preview');
            };

            $scope.userName = auth.currentUser();
                //console.log($scope.userName);     console.log(auth.currentUser());

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
                        var time = doc.getElementsByTagName("time");

                        for(var i = 0; i< trkpt.length; i++){
                            var lat = trkpt[i].getAttribute('lat');
                            var lon = trkpt[i].getAttribute('lon');
                            var t = time[i].textContent;
                            routesArray.push([lon, lat]);
                        }

                        mapdatafactory.uploadRoutes(routesArray).then(function(data){

                            var coordinates = data.geom.coordinates;

                            var lat = parseFloat(coordinates[10][1]);
                            var lng = parseFloat(coordinates[10][0]);

                            var ll = new google.maps.LatLng(lat,lng);

                            $scope.wayPoints =[
                                {location:{
                                    lat:ll.lat(),
                                    lng: ll.lng()},
                                    stopover:true
                                }];

                            //$scope.wayPoints =[
                            //    {location:{
                            //        lat:parseFloat(coordinates[10][1]),
                            //        lng:parseFloat(coordinates[10][0])},
                            //        stopover:true
                            //    }];

                            //console.log($scope.wayPoints);
                            //
                            //
                            //
                            $scope.origin = coordinates[0][1] + "," + coordinates[0][0];
                            //
                            $scope.destination = coordinates[coordinates.length -1][1] + "," + coordinates[coordinates.length -1][0];

                            //coordinates.splice(0,1);
                            //coordinates.pop();
                            //
                            //$scope.wayPoints = coordinates.map(function(wayPoint){
                            //
                            //    return {location:{lat:parseInt(wayPoint[1]), lng: parseInt(wayPoint[0])},stopover:true};
                            //
                            //});

                            var progress = parseInt(theFile.loaded / theFile.total * 100, 10);
                            $('#progress .progress-bar').css(
                                'width', progress + '%'
                            );
                        });

                    };

                    reader.readAsText(file);
                }
            };

                //$scope.logLatLng = function(e){
                //   console.log('loc', e.latLng);
                //};
                //
                //$scope.wayPoints = [
                //    {location: {lat:52.471000, lng: -1.892350}, stopover: true},
                //     {location: {lat:52.508411, lng: -1.885073}, stopover: true}
                //];
                //
                //console.log($scope.wayPoints);
                //
                //$scope.origin = "52.479090,-1.892470";
                //$scope.destination = "52.508408,-1.885373";



    }]);

}());
