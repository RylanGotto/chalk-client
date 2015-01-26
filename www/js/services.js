angular.module('init.services', ['ngResource'])

    .factory(("ionPlatform"), function ($q) {
        var ready = $q.defer();

        ionic.Platform.ready(function (device) {
            ready.resolve(device);
        });

        return {
            ready: ready.promise
        }
    })


    .factory('AuthenticationService', function () {
        var auth = {
            isLogged: false
        }

        return auth;
    })

    .factory('UserLoginService', function ($http) {
        var serverUrl = "https://mighty-fortress-8853.herokuapp.com";

        return {
            logIn: function (username, password) {
                return $http.post(serverUrl + '/api/auth/login', {username: username, password: password});
            },

            logOut: function () {

            }
        }
    })


    .factory('RegistrationService', function ($http) {
        var serverUrl = "https://mighty-fortress-8853.herokuapp.com";

        return {
            register: function (regInfo) {
                return $http.post(serverUrl + '/api/auth/register', regInfo);
            }
        }
    })

    .factory('TokenInterceptor', function ($q, $window, $location, AuthenticationService) {
        return {
            request: function (config) {
                config.headers = config.headers || {};
                if (localStorage.token) {
                    //config.headers.Authorization = 'x-auth ' + localStorage.token;
                }
                return config;
            },

            requestError: function (rejection) {
                return $q.reject(rejection);
            },

            /* Set Authentication.isAuthenticated to true if 200 received */
            response: function (response) {
                if (response != null && response.status == 200 && localStorage.token && !AuthenticationService.isAuthenticated) {
                    AuthenticationService.isAuthenticated = true;
                }
                return response || $q.when(response);
            },

            /* Revoke client authentication if 401 is received */
            responseError: function (rejection) {
                if (rejection != null && rejection.status === 401 && (localStorage.token || AuthenticationService.isAuthenticated)) {
                    delete localStorage.token;
                    AuthenticationService.isAuthenticated = false;
                    $location.path("/init/login");
                }

                return $q.reject(rejection);
            }
        };
    });


angular.module('data.services', ['ngResource'])

    .factory('BoardService', function ($http) {
        var serverUrl = "https://mighty-fortress-8853.herokuapp.com";

        $http.defaults.headers.common['x-auth'] = localStorage.token;
        return {
            addBoard: function(newBoardData){
                return $http.post(serverUrl + '/api/boards', newBoardData);
            },
            getPublishedBoards: function(){
                return $http.get(serverUrl + '/api/boards');
            },
            getMyBoard: function(){
                return $http.get(serverUrl + '/api/myboard');
            },
            getBoardByTag: function(Tag){
                return $http.get(serverUrl + '/api/boards/' + Tag);
            }

        }
    })
    .factory('PostService', function ($http) {
        var serverUrl = "https://mighty-fortress-8853.herokuapp.com";

        $http.defaults.headers.common['x-auth'] = localStorage.token;
        return {
            addPost: function(newPostData){
                return $http.post(serverUrl + '/api/posts', newPostData);
            }

        }
    })
    .factory('UserDataService', function ($http) {
        var serverUrl = "https://mighty-fortress-8853.herokuapp.com";
        $http.defaults.headers.common['x-auth'] = localStorage.token;
        return {
            getAllUsers: function(){
                return $http.get(serverUrl + '/api/users');
            },
            getAllFriends: function(){
                return $http.post(serverUrl + '/api/users');
            },
            getFriendRequest: function(){
                return $http.get(serverUrl + '/api/friendRequest');
            },
            sendFriendRequest: function(newFriendData){
                return $http.put(serverUrl + '/api/users/' + localStorage.userid, newFriendData);
            },respondFriendRequest: function(decisionData){
                return $http.post(serverUrl + '/api/friendRequest', decisionData);
            }


        }
    })
;










