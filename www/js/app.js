// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'main.controllers', 'init.services', 'data.services', 'ngCordova'])

    .run(function ($ionicPlatform, $rootScope, $location, $ionicViewService, AuthenticationService) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });


        $rootScope.$on("$stateChangeStart", function (event, nextState) {

            if (!localStorage.token) {
                AuthenticationService.isLogged = false;
                $location.path("/init/login");
                $ionicViewService.nextViewOptions({
                    disableBack: true
                });
            }
            if (nextState.access.requiredLogin && !AuthenticationService.isLogged) {
                $location.path("/init/login");
            }
        });

    })

    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('TokenInterceptor');
    }])

    .config(function ($stateProvider, $urlRouterProvider) {


        $stateProvider


            .state('init', {
                url: "/init",
                abstract: true,
                templateUrl: "templates/loginPage.html",
                controller: 'InitCtrl'
            })

            .state('init.login', {
                url: "/login",
                views: {
                    'menuContent': {
                        templateUrl: "templates/loginPage.html"
                    }
                },
                access: {requiredLogin: false}
            })

            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/menu.html",
                controller: 'AppCtrl'
            })


            .state('app.search', {
                url: "/search",
                views: {
                    'menuContent': {
                        templateUrl: "templates/search.html"
                    }
                },
                access: {requiredLogin: true}
            })


            .state('app.browse', {
                url: "/browse",
                views: {
                    'menuContent': {
                        templateUrl: "templates/browse.html"
                    }
                },
                access: {requiredLogin: true}
            })

            .state('app.publishedboards', {
                url: "/pubboards",
                views: {
                    'menuContent': {
                        templateUrl: "templates/publishedBoards.html"
                    }
                },
                access: {requiredLogin: true}
            })

            .state('app.viewposts', {
                url: "/viewposts",
                views: {
                    'menuContent': {
                        templateUrl: "templates/viewPosts.html"
                    }
                },
                access: {requiredLogin: true}
            })

            .state('app.viewfriends', {
                url: "/viewfriends",
                views: {
                    'menuContent': {
                        templateUrl: "templates/viewFriends.html"
                    }
                },
                access: {requiredLogin: true}
            })



            .state('app.myBoard', {
                url: "/myBoard",
                views: {
                    'menuContent': {
                        templateUrl: "templates/myBoard.html"
                    }
                },
                access: {requiredLogin: true}
            });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise(function () {
            if (typeof localStorage.jwttoken === 'undefined') {
                return 'init/login';
            } else {
                return 'init/myBoard';
            }

        });
    });

