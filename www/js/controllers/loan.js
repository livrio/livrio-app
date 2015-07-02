angular.module('starter.controllers')

.controller('loanCtrl', function($scope, $rootScope, $http, $ionicLoading, $ionicActionSheet, BOOK, settings) {

    $scope.librarys = [];

    $scope.loading = true;
    $scope.onRefresh = function() {
        $http.get(settings.URL.LOAN)
        .success(function(response) {
            if (!response.errors) {
                var bookLoans = [];
                angular.forEach(response.data.loan, function(item) {
                    item.author = item.author[0];//.author.join(", ");
                    bookLoans.push(item);
                });

                $scope.bookLoans = bookLoans;

                var bookLoaneds = [];
                angular.forEach(response.data.loaned, function(item) {
                    item.author = item.author[0];//.author.join(", ");
                    bookLoaneds.push(item);
                });

                $scope.bookLoaneds = bookLoaneds;

                $scope.loading = false;
                $scope.$broadcast('scroll.refreshComplete');

            }
        })
        .error(function() {
            $scope.$broadcast('scroll.refreshComplete');
            console.log("TRATAR ERROR");
        });
    };

    $scope.onRefresh();

    $scope.onView = function(item) {
        BOOK.view(item);
    };


    $scope.onActionBook = function(event, item) {
        BOOK.menuAction(event, item);
    };


    $rootScope.$on("loan.refresh",function() {
        $scope.onRefresh();
    });
});
