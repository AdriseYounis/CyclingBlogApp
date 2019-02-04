(function () {
    'use strict';

    var app = angular.module('cyclingblog');

    app.controller('setting',
        ['$scope',
            function ($scope) {



            $scope.GetFile = function() {

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

                    for(var i = 0; i< trkpt.length; i++){
                        var lat = trkpt[i].getAttribute('lat');
                        var lon = trkpt[i].getAttribute('lon');
                        var t = time[i].textContent;
                        console.log(i + "  lat:  " + lat + "  lon: " + lon + "  time: " + t);
                    }
                        console.log("xmlname:  " + xmlname);

                        var progress = parseInt(theFile.loaded / theFile.total * 100, 10);
                         $('#progress .progress-bar').css(
                            'width',
                            progress + '%'
                        );
                };

                reader.readAsText(file);

            }
        };

        $scope.Amend = function(){

            $scope.showsave = "false";
            $scope.showCancel = "false";

            $("#firstname").removeAttr("readonly");
            $("#lastname").removeAttr("readonly");
            $("#email").removeAttr("readonly");
            $("#password").removeAttr("readonly");

            $scope.item = true;
            $scope.cancel = true;
            $scope.remove = true;
            $scope.test = false;

            document.getElementById("file").disabled = false;

        };

        $scope.Cancel= function(){
            window.location.reload();
        };

        $scope.Remove= function(){
            $("#file").val("");

            var progress = parseInt(0);

            $('#progress .progress-bar').css(
                'width',
                progress + '%'
            );
        };

    }]);

}());
