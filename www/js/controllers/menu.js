angular.module('starter.controllers')

.controller('menuCtrl', function($scope, $ionicPopover) {
    $ionicPopover.fromTemplateUrl('templates/menu.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    });


    $scope.onHide = function() {
        $scope.popover.hide();
    };
    $scope.onLogout = function() {
        $scope.popover.hide();
        delete window.localStorage.token;
        window.location = '#/login';
        window.location.reload();
    };

});

