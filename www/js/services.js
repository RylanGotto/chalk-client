angular.module('starter.services', ['ngResource'])

.factory('Post', ['$resource',
    function($resource){
        return $resource('posts/posts.json', {}, {
            query: {method:'GET', params:{phoneId:'phones'}, isArray:true}
        });
    }]);