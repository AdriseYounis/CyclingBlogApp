(function () {
    'use strict';

    angular.module('cyclingblog', ['ui.router'])
        .config([
        "$stateProvider",
        "$urlRouterProvider",

        function($stateProvider,$urlRouterProvider){
            $stateProvider
                .state('preview',{
                    url:'/preview',
                    templateUrl: "templates/preview.html",
                    controller: "registration",
                    onEnter: ['$state', 'auth', function($state, auth){
                        if(auth.isLoggedIn()){
                            $state.go('homepage');
                        }
                    }]
                })

                .state('homepage',{
                    url:'/homepage',
                    templateUrl: "templates/homepage.html",
                    controller: "homepage"
                })

                .state('setting',{
                    url:'/setting',
                    templateUrl: "templates/setting.html",
                    controller: "setting"
                });

                $urlRouterProvider.otherwise('registration');
        }
    ])

    //auth factory
    .factory('auth',['$http', '$window', function($http, $window){
        var auth = {};

        //setting token
        auth.saveToken = function (token){
            $window.localStorage['cycling-blog-token'] = token;
        };

        //getting token
        auth.getToken = function (){
            return $window.localStorage['cycling-blog-token'];
        };

        //isLoggedIn function it will return a boolean value to see if the user is logged in.
        auth.isLoggedIn = function(){
            var token = auth.getToken();
        //if a token exists we need to check the payload to see if the token has expired
            if(token){
                var payload = JSON.parse($window.atob(token.split('.')[1])); //payload is the middle part in the token and its a JSON object, we use window.atob to get it to a string and then to a JSON object by JSON.parse

                return payload.exp > Date.now() / 1000;
            }
            else{
                return false;
            }
        };

        //returns the username of the user
        auth.currentUser = function(){
            if(auth.isLoggedIn()){
                var token = auth.getToken();
                var payload = JSON.parse($window.atob(token.split('.')[1]));

                return payload.username;
            }
        };

        //posts a user to our /signup route
        auth.signup = function(user){
            console.log(user);
            return $http.post('/signup', user).success(function(data) {
                auth.saveToken(data.token);
            });
        };

        //posts a user to our /login route
        auth.logIn = function(user) {
            return $http.post('/login', user).success(function (data) {
                auth.saveToken(data.token);
            });
        };

        //logout
        auth.logout = function() {
            $window.localStorage.removeItem("cycling-blog-token");
        };

        return auth;
    }])

})();

