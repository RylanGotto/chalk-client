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

/**
 * Token Interception
 * Middleware for dealing with the authentication
 *
 */
    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('TokenInterceptor');
    }])

    .config(function ($stateProvider, $urlRouterProvider) {


        $stateProvider

        /**
         *  Initialize state
         *  send the user to the login page
         */
            .state('init', {
                url: "/init",
                abstract: true,
                templateUrl: "templates/loginPage.html",
                controller: 'initCtrl'
            })

        /**
         * Login page state
         *  in case they've logged out.
         */
            .state('init.login', {
                url: "/login",
                views: {
                    'menuContent': {
                        templateUrl: "templates/loginPage.html"
                    }
                },
                access: {requiredLogin: false}
            })

        /**
         * The base app controller state
         * - Provides the menu
         */
            .state('app', {
                url: "/app",
                abstract: true,
                templateUrl: "templates/menu.html",
                controller: 'appCtrl'
            })

        /**
         * Search state
         */
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

        /**
         * Currently, view all available boards
         * TODO: remove this, and include this functionality into the search
         */
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

        /**
         * Viewing Posts state
         *  used when looking at a board that is not yours
         */
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

        /**
         * View Friends state
         * See the list of friends attached to the current user.
         */
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

        /**
         * My Board state
         * the 'homepage' of the app
         * - view posts that have been made to your board
         */
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

        /**
         * Fallback
         *  In case the user is attempting to access
         *  a page that might not exist, or etc.
         *  send them to myBoard if they're logged in
         *  or login page if they're not.
         */
        $urlRouterProvider.otherwise(function () {
            if (typeof localStorage.jwttoken === 'undefined') {
                return 'init/login';
            } else {
                return 'init/myBoard';
            }

        });
    });

