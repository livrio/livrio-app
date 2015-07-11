angular.module('starter.controllers')

.controller('notificationCtrl', function($scope, $rootScope, $ionicHistory, $ionicPopup, $timeout, PUSH, LOAN) {


    $timeout(function() {
        PUSH.markRead();
    },1000);

});
