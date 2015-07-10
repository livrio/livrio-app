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

    $ionicPopover.fromTemplateUrl('templates/menu_book.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    });

    $scope.onLoan = function(book) {
        $rootScope.$emit('loan.add',book);
    };


    $scope.onAction = function(event, book) {
        BOOK.menuAction(event, book);
    }

    $scope.onUpdate = function(book) {
        BOOK.update(book);
    }

    $scope.onRequestReturnBook = function(book) {
        BOOK.requestReturn(book);
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


    $scope.onHide = function() {
        $scope.popover.hide();
    };

});
