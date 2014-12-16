angular.module('starter.services', ['ngResource'])

    .factory('Post', ['$resource',
        function ($resource) {
            var serverUrl = "http://localhost:8080";
            return $resource(serverUrl + '/api/myboard', {}, {
                query: {method: 'GET', isArray: true, headers:{'x-auth':localStorage.jwttoken } }
            });
        }])


    .factory('Board', ['$resource',
        function ($resource) {
            var serverUrl = "http://localhost:8080";
            return $resource(serverUrl + '/api/boards', {}, {
                query: {method: 'GET', isArray: true, headers:{'x-auth':localStorage.jwttoken } }
            });
        }]);




