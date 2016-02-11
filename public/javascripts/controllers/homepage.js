(function () {
    'use strict';

    var app = angular.module('cyclingblog');

    app.controller('homepage', [
        '$scope',
        '$state',
        'auth', function ($scope,$state, auth, $window) {

            $scope.logout = function(){
                auth.logout();
                $state.go('preview');
            };

            $scope.userName = auth.currentUser();
            console.log(auth.currentUser());
            console.log($scope.userName);

            initialize();

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

            function initialize() {
                var mapCanvas = document.getElementById('map-canvas');

                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(function (position) {

                            var mapOptions = {
                                center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
                                zoom: 8,
                                mapTypeId: google.maps.MapTypeId.ROADMAP
                            };
                            var map = new google.maps.Map(mapCanvas, mapOptions);
                        });
                    }


            }

            google.maps.event.addDomListener(window, 'load', initialize);



        }]);

}());
