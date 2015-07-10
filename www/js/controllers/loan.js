angular.module('starter.controllers')

.controller('loanCtrl', function($scope, $rootScope, $http, $ionicLoading, $ionicActionSheet, BOOK, settings) {

    $scope.librarys = [];

    $scope.loading = true;
    $scope.onRefresh = function() {

        BOOK.all({
            loan: 'my'
        })
        .then(function(data) {
            $scope.bookLoaneds = data;

            BOOK.all({
                loan: 'other'
            })
            .then(function(data) {
                $scope.bookLoans = data;

                $scope.loading = false;
                $scope.$broadcast('scroll.refreshComplete');
            });
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
