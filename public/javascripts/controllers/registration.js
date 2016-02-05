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

            //$('#myModal').on('shown.bs.modal', function () {
            //    $('#myInput').focus()
            //});


            //$(".user-button").click(function() {
            //    $('.second-wrapper').animate({top:'12%'}, 'slow');
            //});
            //
            //
            //$(".upIcon").click(function() {
            //    $('.second-wrapper').animate({top:'100%'}, 'slow');
            //});

            //$(".login").hide();
            //$(".signup").hide();
            //$(".forgotpassword").hide();
            //
            //$("#btnLoginPage").click(function() {
            //    $(".login").show();
            //    $(".signup").hide();
            //    $(".forgotpassword").hide();
            //});
            //
            //$("#btnSignPage").click(function() {
            //    $(".signup").show();
            //    $(".login").hide();
            //    $(".forgotpassword").hide();
            //});
            //
            //$("#link-forgotpassword").click(function(){
            //    $(".forgotpassword").show();
            //    $(".signup").hide();
            //    $(".login").hide();
            //});
            //
            //$('#myModal').on('shown.bs.modal', function () {
            //    $('#myInput').focus()
            //});

    }]);

}());
