angular.module('starter.controllers')

.controller('aboutCtrl', function($scope, $ionicHistory) {


    $scope.onBack = function() {
        $ionicHistory.goBack();
    };

});
