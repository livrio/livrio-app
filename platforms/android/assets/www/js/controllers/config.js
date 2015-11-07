"use strict";

angular.module('starter.controllers')
.controller('configCtrl', function( $scope, $rootScope, $http, settings) {

    var user = $rootScope.user;

    console.log(user);

    $scope.config = user.config;

    $scope.onChangeField = function() {
        var post = {
            config: $scope.config
        };

        $http.put(settings.URL.USER + '/' + user.id, post)
        .success(function(response) {
            window.localStorage.user = JSON.stringify(response.data);
            $rootScope.user = response.data;
        })
        .error(function() {
            console.log(JSON.stringify(arguments));
        });
    };
});
