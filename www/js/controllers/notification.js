angular.module('starter.controllers')

.controller('notificationCtrl', function($scope, $rootScope, $ionicHistory, $timeout, PUSH) {


    $timeout(function() {
        PUSH.markRead();
    },1000);




    $scope.onBack = function() {
        $ionicHistory.goBack();
    };

    $scope.onClick = function(item) {

    };


});

