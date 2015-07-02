angular.module("starter.controllers")

.controller("libraryCtrl", function($scope, $rootScope, $http, $ionicPopup, $ionicLoading, $ionicActionSheet, settings, BOOK, LOAN) {


    $scope.librarys = [];

    $scope.loading = true;


    $scope.onRefresh = function() {
        BOOK.all().then(function(books) {
            // $scope.librarys = columnize(books, 2);
            $scope.librarys = books;
            $scope.loading = false;
            $scope.$broadcast('scroll.refreshComplete');
        });
    };


    $scope.onView = function(item) {
        BOOK.view(item);
    };


    $scope.onActionBook = function(event, item) {
        BOOK.menuAction(event, item);
    };

    $scope.onRefresh();


    $rootScope.$on("library.refresh",function() {
        $scope.onRefresh();
    });

});
