angular.module('starter.controllers')

.controller('loanCtrl', function($scope, $rootScope, $http, $ionicLoading, $ionicActionSheet, BOOK, settings) {

    $scope.librarys = [];

    $scope.loading = true;
    $scope.onRefresh = function() {
        $http.get(settings.URL.LOAN)
        .success(function(response) {
            if (!response.errors) {
                var library = [];
                angular.forEach(response.data, function(item) {

                    item.author = item.author[0];//.author.join(", ");
                    if (!item.thumb) {
                        item.thumb = "img/cover.gif?";
                    }
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

    $scope.onRefresh();

    $scope.onView = function(book) {
        BOOK.view(book);
    };


    $rootScope.$on("loan.refresh",function() {
        $scope.onRefresh();
    });
});
