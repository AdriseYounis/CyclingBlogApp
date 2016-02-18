(function () {
    'use strict';

    var app = angular.module('cyclingblog');

    app.controller('homepage',
        ['$scope', '$state', 'auth','$window','$http',
            function ($scope,$state, auth, $window, $http) {

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

                var routesArray1 = [];
                var file = document.getElementById('file').files[0];

                if (!file) {
                        alert("File not uploaded");
                } else {

                    var reader = new FileReader();

                    reader.onloadend = function (theFile) {
                        var fileData = theFile.target.result;
                        $scope.data = fileData;

                        var parser = new DOMParser();
                        var doc = parser.parseFromString(fileData, "application/xml");

                        var xmlname = doc.getElementsByTagName('name')[0].textContent;
                        var trkpt = doc.getElementsByTagName('trkpt');
                        var time = doc.getElementsByTagName("time");

                        for(var i = 0; i< 5; i++){
                            var lat = trkpt[i].getAttribute('lat');
                            var lon = trkpt[i].getAttribute('lon');
                            var t = time[i].textContent;
                            routesArray1.push([lon, lat]);
                            console.log(routesArray1);
                            //console.log(i + "  lat:  " + lat + "  lon: " + lon + "  time: " + t);
                        }    //console.log("xmlname:  " + xmlname);

                        console.log("Routes Array 2 " + routesArray1);

                        $http.post('/uploadRoutes', {routesArray1: routesArray1},
                            {headers: {Authorization:'Bearer '+ auth.getToken()}}) //only logged users upload routes
                            .success(function(data){

                            })
                            .error(function(data){
                                console.log('error:'+ data);
                            });
                        console.log("Routes Array 3 " + routesArray1);

                        var progress = parseInt(theFile.loaded / theFile.total * 100, 10);
                        $('#progress .progress-bar').css(
                            'width',
                            progress + '%'
                        );
                    };

                    reader.readAsText(file);
                }
            };

    }]);

}());
