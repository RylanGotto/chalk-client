angular.module('chalk', ['ionic', 'init.controller', 'app.controller', 'myBoard.controller', 'board.controller', 'search.controller',
    'publishedBoards.controller', 'friends.controller', 'init.services', 'userSettings.controller', 'data.services', 'ngCordova'])

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


        /**
         * When a view is changed, listen for the event "$stateChangeStart"
         * check to see if JWT exists in localStorage, is only checking if exists.
         * if it does not, sign the user out and redirect them to the login page
         * Then check to see if the page reuqested required being logged in, if we are logged in take them to that page
         * if not redirect them to the login page.
         */
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
                controller: 'initCtrl'
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
                controller: 'appCtrl'
            })


            .state('app.search', {
                url: "/search",
                views: {
                    'menuContent': {
                        templateUrl: "templates/search.html",
                        controller: 'searchCtrl'
                    }
                },
                access: {requiredLogin: true}

            })

            .state('app.publishedboards', {
                url: "/pubboards",
                views: {
                    'menuContent': {
                        templateUrl: "templates/publishedBoards.html",
                        controller: 'publishedCtrl'
                    }
                },
                access: {requiredLogin: true}

            })

            .state('app.viewposts', {
                url: "/viewposts",
                views: {
                    'menuContent': {
                        templateUrl: "templates/viewPosts.html",
                        controller: 'boardCtrl'
                    }
                },
                access: {requiredLogin: true}

            })

            .state('app.viewfriends', {
                url: "/viewfriends",
                views: {
                    'menuContent': {
                        templateUrl: "templates/viewFriends.html",
                        controller: 'friendsCtrl'
                    }
                },
                access: {requiredLogin: true}

            })

            .state('app.myBoard', {
                url: "/myBoard",
                views: {
                    'menuContent': {
                        templateUrl: "templates/myBoard.html",
                        controller: 'myBoardCtrl'
                    }
                },
                access: {requiredLogin: true}

            })

            .state('app.userSettings', {
                url: "/userSettings",
                views: {
                    'menuContent': {
                        templateUrl: "templates/userSettings.html",
                        controller: 'userSettingsCtrl'
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

