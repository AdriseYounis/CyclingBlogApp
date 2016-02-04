/**
 * Created by Adries on 31/01/2016.
 */
(function () {
    'use strict';

    var app = angular.module('cyclingblog');

    app.controller('registration', [
        '$scope',
        '$state',
        'auth',

        function ($scope, $state, auth) {

        $scope.user = {};

        $scope.signup = function(){
            console.log($scope.user);
            auth.signup($scope.user).error(function(error){
                $scope.error = error;
            }).then(function(){
                $state.go('setting');
            });
        };

         $scope.login = function(){
             auth.logIn($scope.user).error(function(error) {
                $scope.error = error;
            }).then(function(){
                $state.go('setting');
            });
         };
            //$scope.regButton = function(){
            //
            //    //$('html, body').animate({scrollTop: $(".second").offset().top - 80},'slow');
            //    jQuery('.logo').animate(
            //        {
            //            top: 300
            //        }, console.log("working"));
            //
            //    console.log("end");
            //};

            $(".user-button").click(function() {
                $('html, body').animate({scrollTop: $(".second").offset().top - 80},'slow');
            });


            //$(".user-button").click(function() {
            //    jQuery('.second').animate(
            //        {
            //            top: -80
            //        });
            //
            //    //$('html, body').animate({scrollTop: $(".second").offset().top - 80},'slow');
            //});


            //$(".upIcon").click(function() {
            //    $('html, body').animate({scrollTop: '0px'}, 'slow');
            //});

            $(".login").hide();
        $(".signup").hide();
        $(".forgotpassword").hide();

        $("#btnLoginPage").click(function() {
            $(".login").show();
            $(".signup").hide();
            $(".forgotpassword").hide();
        });

        $("#btnSignPage").click(function() {
            $(".signup").show();
            $(".login").hide();
            $(".forgotpassword").hide();
        });

        $("#link-forgotpassword").click(function(){
            $(".forgotpassword").show();
            $(".signup").hide();
            $(".login").hide();
        });

    }]);

}());
