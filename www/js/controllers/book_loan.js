angular.module('livrio.controllers')

.controller('book_loan_ctrl', function($scope, $rootScope, $filter, BOOK) {


    var trans = $filter('translate');

    $scope.empty_list = trans('book_loan.empty_list');

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

    $rootScope.$on("book_loan.refresh",function() {
        $scope.onRefresh();
    });
});
