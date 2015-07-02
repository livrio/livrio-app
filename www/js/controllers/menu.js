angular.module('starter.controllers')

.controller('menuCtrl', function($scope, $ionicPopover, SHELF, PUSH) {

    SHELF.all();

    PUSH.all();

    $scope.onShelfAdd = function() {
        SHELF.add();
    };

    $scope.doLogout = function() {
        var email = window.localStorage.email;
        window.localStorage.clear();
        window.localStorage.email = email;
        window.location = '#/login';
        window.location.reload();
    };
});

