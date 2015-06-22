angular.module('starter.controllers')

.controller('libraryViewCtrl', function($scope, $rootScope, $stateParams, $ionicHistory, $ionicPopover, BOOK) {

    var id = $stateParams.id;

    $scope.onBack = function() {
        $ionicHistory.goBack();
    };

    $ionicPopover.fromTemplateUrl('templates/menu_book.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    });

    $scope.onLoan = function(book) {
        $rootScope.$emit('loan.add',book);
    };


    $scope.onMenu = function(event, book) {
        BOOK.menuAction(event, book);
    }

    $scope.onUpdate = function(book) {
        BOOK.update(book);
    }


    $scope.onHide = function() {
        $scope.popover.hide();
    };

});
