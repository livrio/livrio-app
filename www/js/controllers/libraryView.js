angular.module('starter.controllers')

.controller('libraryViewCtrl', function($scope, $rootScope, $stateParams, $ionicHistory, $ionicPopover, BOOK, LOAN) {

    var id = $stateParams.id;

    $scope.loading = true;
    var book;
    BOOK.view(id)
    .then(function(data) {
        $scope.loading = false;
        book = $rootScope.bookView = data;
    });

    $scope.onLoan = function(book) {
        $rootScope.$emit('loan.add',book);
    };


    $scope.onAction = function(event, book) {
        BOOK.menuAction(event, book);
    }



    $scope.onRequestLoan = function(book) {
        LOAN.requestLoan(book);
    }

    $scope.onChangeStatus = function(status) {
        LOAN.changeStatus(book.id, status)
        .then(function(data) {
            book.loaned = data.loaned;
        });
    }


});
