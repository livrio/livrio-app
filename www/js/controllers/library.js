angular.module("starter.controllers")

.controller("libraryCtrl", function($scope, $rootScope, $http, $ionicPopup, $ionicLoading, $ionicActionSheet, settings, BOOK, LOAN) {


    $scope.librarys = [];

    $scope.loading = true;


    $scope.onRefresh = function() {
        $http.get(settings.URL.BOOK)
        .success(function(response) {
            if (!response.errors) {
                var library = [];
                angular.forEach(response.data, function(item) {

                    item.author = item.author[0];//.author.join(", ");
                    library.push(item);
                });

                $scope.librarys = columnize(library, 2);
                $scope.loading = false;

            }
        })
        .error(function() {
            console.log("TRATAR ERROR");
        });
    };


    $scope.onBook = function(item) {
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
