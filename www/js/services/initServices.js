/**
 * Created by rylan on 07/02/15.
 * Initilization Services handles all data related to logging a user in and registering
 * and monitoring that users inbound and out bound http requests for shenanigans.
 */
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
        var serverUrl = "http://192.168.0.4:8080";


        return {
            logIn: function (username, password) {
                return $http.post(serverUrl + '/api/auth/login', {username: username, password: password});
            },

            logOut: function () {

            }
        }
    })


    .factory('RegistrationService', function ($http) {
        var serverUrl = "http://192.168.0.4:8080";

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
                if (rejection != null && rejection.status === 400 && (localStorage.token || AuthenticationService.isAuthenticated)) {
                    delete localStorage.token;
                    AuthenticationService.isAuthenticated = false;
                    $location.path("/init/login");
                }

                return $q.reject(rejection);
            }
        };
    })

