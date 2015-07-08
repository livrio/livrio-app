angular.module('starter.controllers')

.controller('shelfCtrl', function($scope, $stateParams, SHELF, BOOK) {

    var id = $stateParams.id;

    $scope.shelf = {};

    SHELF.get(id).then(function(item) {
        $scope.shelf = item;
    });


    $scope.librarys = [];

    $scope.loading = true;


    $scope.onRefresh = function() {

        SHELF.books(id).then(function(books) {
            $scope.librarys = books;
            $scope.loading = false;
        });
    };

    $scope.onView = function(item) {
        BOOK.view(item);
    };

    $scope.onDelete = function(item) {
        SHELF.delete(item);
    }


    $scope.onActionBook = function(event, item) {
        BOOK.menuAction(event, item);
    };


    $scope.onRefresh();


});
