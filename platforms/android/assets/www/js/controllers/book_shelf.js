angular.module('livrio.controllers')

.controller('book_shelf_ctrl', function($scope, $rootScope, $stateParams, $filter, SHELF, BOOK) {

    var id = $stateParams.id;

    var trans = $filter('translate');

    $scope.empty_list = trans('shelf.empty_list');

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
