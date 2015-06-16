angular.module('starter.controllers')

.controller('libraryViewCtrl', function($scope, $rootScope, $stateParams, $ionicHistory, $ionicPopover) {

    var id = $stateParams.id;

    $scope.onBack = function() {
        $ionicHistory.goBack();
    };

    $ionicPopover.fromTemplateUrl('templates/menu_book.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    });

    $scope.onLoan = function() {
        $rootScope.$emit('loan.add',id);
    };


    $scope.onHide = function() {
        $scope.popover.hide();
    };

});
