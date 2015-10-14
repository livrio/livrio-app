angular.module('starter.controllers')

.controller('libraryViewCtrl', function($scope, $rootScope, $stateParams, $ionicHistory, $ionicPopover, $ionicPopup, $filter, BOOK, LOAN, FRIEND) {

    var id = $stateParams.id;

    var trans  = $filter('translate');

    $scope.loading = true;
    var book;
    BOOK.view(id)
    .then(function(data) {
        $scope.loading = false;
        book = $rootScope.bookView = data;
    });


    $scope.onLike = function(book) {
        BOOK.like(book)
        .then(function(data) {
            $rootScope.bookView = data;
        });
    }




    $scope.onLoan = function(book) {
        $rootScope.$emit('loan.add',book);
    };


    $scope.onAction = function(event, book) {
        BOOK.menuAction(event, book);
    }



    $scope.onRequestLoan = function(book) {
        LOAN.requestLoan(book);
    }

});
