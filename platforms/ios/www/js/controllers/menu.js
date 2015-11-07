angular.module('starter.controllers')

.controller('menuCtrl', function($scope, $state, $rootScope, $ionicPopover, $ionicSideMenuDelegate, SHELF, PUSH) {

    SHELF.all();

    PUSH.all();

    $scope.onShelfAdd = function() {
        SHELF.add()
        .then(function(item) {
            $ionicSideMenuDelegate.toggleLeft();
            $state.go('app.shelf',{
                id: item.id
            });
        });
    };

    $scope.doLogout = function() {
        window.localStorage.clear();
        window.localStorage.email = $rootScope.user.email;
        window.location = '#/login';
    };
});

