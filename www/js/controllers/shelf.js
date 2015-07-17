angular.module('starter.controllers')

.controller('shelfCtrl', function($scope, $rootScope, $stateParams, SHELF, BOOK) {

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
            $scope.$broadcast('scroll.refreshComplete');
        },
        function() {
            $scope.$broadcast('scroll.refreshComplete');
            $scope.$emit('error.http');
        });
    };

    $scope.onView = function(item) {
        BOOK.view(item);
    };

    $scope.onDelete = function(item) {
        SHELF.delete(item);
    }

    $scope.onUpdate = function(item) {
        SHELF.update(item);
    };

    $scope.onAddBook = function(item) {
        $rootScope.shelfTmp = item;
    };


    $scope.onActionBook = function(event, item) {
        BOOK.menuAction(event, item);
    };


    $scope.onRefresh();

    $rootScope.$on("library.shelf.refresh",function() {
        $scope.librarys = [];
        $scope.loading = true;
        $scope.onRefresh();
    });


});
