angular.module('starter.services', ['ngResource'])

    .factory('Post', ['$resource',
        function ($resource) {
            return $resource('http://localhost:8080/api/boards', {}, {
                query: {method: 'GET', isArray: true, headers:{'x-auth':localStorage.jwttoken } }
            });
        }]);


