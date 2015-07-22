angular.module('starter.controllers')

.controller('menuCtrl', function($scope, $rootScope, $ionicPopover, SHELF, PUSH) {

    SHELF.all();

    PUSH.all();

    $scope.onShelfAdd = function() {
        SHELF.add();
    };

    $scope.doLogout = function() {
        window.localStorage.clear();
        window.localStorage.email = $rootScope.user.email;
        window.location = '#/login';
    };
});

