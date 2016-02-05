(function () {
    'use strict';

    var app = angular.module('cyclingblog');

    app.controller('homepage', [
        '$scope',
        '$state',
        'auth', function ($scope,$state, auth) {

            $scope.logout = function(){
                auth.logout();
                $state.go('registration');
            };


            initialize();

            $(".route-upload").hide();

            $('#file').change(function(evt) {
                $("#btnuploadremove").removeAttr("disabled");
                $("#btnuploadremove1").removeAttr("disabled");
            });

            function initialize() {
                var mapCanvas = document.getElementById('map-canvas');
                var mapOptions = {
                    center: new google.maps.LatLng(44.5403, -78.5463),
                    zoom: 8,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                var map = new google.maps.Map(mapCanvas, mapOptions)
            }
            google.maps.event.addDomListener(window, 'load', initialize);


            function AddBlog() {

                window.location = "/addblog.html";
            }

            $( "#showFileUpload" ).click(function() {
                $(this).attr("disabled", "disabled");
                $(".route-upload").show();
            });


        }]);

}());
