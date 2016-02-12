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





        }]);

}());
