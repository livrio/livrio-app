angular.module("starter.controllers")

.controller("libraryCtrl", function($scope, $rootScope, $ionicActionSheet, $filter, BOOK) {


    $scope.librarys = [];

    $scope.loading = true;

    var trans = $filter('translate');

    $scope.empty_list = trans('library.empty_list');


    $scope.onRefresh = function() {
        BOOK.all().then(function(books) {
            $scope.librarys = books;
            $scope.loading = false;
            $scope.$broadcast('scroll.refreshComplete');
        },
        function() {
            $scope.$broadcast('scroll.refreshComplete');
            $scope.loading = false;
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
