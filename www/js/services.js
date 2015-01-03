angular.module('starter.services', ['ngResource'])

//get all posts for my board
    .factory('Post', ['$resource',
        function ($resource) {
            var serverUrl = "https://localhost:8080";
            return $resource(serverUrl + '/api/myboard', {}, {
                query: {method: 'GET', isArray: true, headers:{'x-auth':localStorage.jwttoken } }
            });
        }])

//get all users for search potentially
    .factory('Users', ['$resource',
        function ($resource) {
            var serverUrl = "http://localhost:8080";
            return $resource(serverUrl + '/api/users', {}, {
                query: {method: 'GET', isArray: true, headers:{'x-auth':localStorage.jwttoken } }
            });
        }])

    .factory('Friends', ['$resource',
        function ($resource) {
            var serverUrl = "http://localhost:8080";
            return $resource(serverUrl + '/api/users', {}, {
                charge: {method: 'POST', headers:{'x-auth':localStorage.jwttoken } }
            });
        }])

//get all published boards for a logged in user
    .factory('Board', ['$resource',
        function ($resource) {
            var serverUrl = "http://localhost:8080";
            return $resource(serverUrl + '/api/boards', {}, {
                query: {method: 'GET', isArray: true, headers:{'x-auth':localStorage.jwttoken } }
            });
        }]);





