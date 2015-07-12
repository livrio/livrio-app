angular.module('starter.controllers')

.controller('notificationCtrl', function($scope, $rootScope, $ionicHistory, $ionicPopup, $timeout, PUSH, LOAN) {


    $timeout(function() {
        PUSH.markRead();
    },1000);

    $scope.onRefresh = function() {
        PUSH.all()
        .then(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
    };

});
